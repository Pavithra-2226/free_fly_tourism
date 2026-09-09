from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException

from app.auth import require_admin
from app.database import get_enquiries_collection, get_notifications_collection
from app.models import (
    EARLY_BIRD_DESTINATION,
    EARLY_BIRD_OFFER_ENDS_AT,
    EARLY_BIRD_PRICE,
    EARLY_BIRD_SEAT_LIMIT,
    REGULAR_PRICE,
    EarlyBirdPublicSummary,
    EarlyBirdSummary,
    EnquiryCreate,
    EnquiryInDB,
    EnquiryListResponse,
    EnquiryOut,
    EnquiryResponse,
    EnquiryStatus,
    EnquiryStatusUpdate,
)

router = APIRouter(prefix="/api/enquiries", tags=["enquiries"])

_OFFER_DEADLINE = datetime.fromisoformat(EARLY_BIRD_OFFER_ENDS_AT)


# ============================================================
# CREATE ENQUIRY
# ============================================================

@router.post("", response_model=EnquiryResponse, status_code=201)
async def create_enquiry(enquiry: EnquiryCreate) -> EnquiryResponse:
    collection = get_enquiries_collection()

    # A customer with an existing CONFIRMED booking for the same
    # destination cannot submit another enquiry for it.
    # Pending or Contacted enquiries do not trigger this.
    existing_booking = await _find_existing_confirmed_booking(
        collection,
        enquiry.phone,
        enquiry.destination,
    )

    if existing_booking is not None:
        raise HTTPException(
            status_code=409,
            detail=(
                "You already have a confirmed booking for this trip. "
                "Our team will contact you if any changes are required."
            ),
        )

    try:
        # Status defaults to Pending here.
        # An enquiry only counts as a booking once an admin confirms it.
        document = EnquiryInDB(**enquiry.model_dump())

        result = await collection.insert_one(
            document.model_dump(mode="json")
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Something went wrong while saving your enquiry. "
                "Please try again."
            ),
        ) from exc

    # Create admin notification
    await _create_new_enquiry_notification(
        enquiry_id=str(result.inserted_id),
        name=enquiry.name,
        destination=enquiry.destination,
    )

    return EnquiryResponse(
        success=True,
        message=(
            "Thank you! Your enquiry has been submitted. "
            "Our team will contact you shortly."
        ),
        id=str(result.inserted_id),
    )


# ============================================================
# PUBLIC EARLY BIRD AVAILABILITY
# ============================================================

@router.get(
    "/early-bird",
    response_model=EarlyBirdPublicSummary,
)
async def get_early_bird_availability() -> EarlyBirdPublicSummary:
    """
    Public endpoint.

    Both the customer page and the admin page read from
    this same live count, so the numbers stay synchronized.
    """

    collection = get_enquiries_collection()

    summary = await _get_early_bird_summary(collection)

    offer_expired = (
        datetime.now(timezone.utc) >= _OFFER_DEADLINE
    )

    return EarlyBirdPublicSummary(
        total=summary.total,
        booked=summary.booked,
        remaining=summary.remaining,
        early_bird_price=EARLY_BIRD_PRICE,
        regular_price=REGULAR_PRICE,
        offer_ends_at=EARLY_BIRD_OFFER_ENDS_AT,
        sold_out=summary.remaining <= 0,
        offer_expired=offer_expired,
    )


# ============================================================
# LIST ENQUIRIES - ADMIN ONLY
# ============================================================

@router.get(
    "",
    response_model=EnquiryListResponse,
)
async def list_enquiries(
    _admin: str = Depends(require_admin),
) -> EnquiryListResponse:

    collection = get_enquiries_collection()

    cursor = collection.find().sort("created_at", -1)

    enquiries = []

    async for doc in cursor:
        enquiries.append(_to_enquiry_out(doc))

    early_bird = await _get_early_bird_summary(collection)

    return EnquiryListResponse(
        enquiries=enquiries,
        early_bird=early_bird,
    )


# ============================================================
# UPDATE ENQUIRY STATUS - ADMIN ONLY
# ============================================================

@router.patch(
    "/{enquiry_id}",
    response_model=EnquiryOut,
)
async def update_enquiry_status(
    enquiry_id: str,
    update: EnquiryStatusUpdate,
    _admin: str = Depends(require_admin),
) -> EnquiryOut:

    collection = get_enquiries_collection()

    # Validate MongoDB ID
    try:
        object_id = ObjectId(enquiry_id)

    except InvalidId as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid enquiry id.",
        ) from exc

    # Find existing enquiry
    existing = await collection.find_one(
        {"_id": object_id}
    )

    if existing is None:
        raise HTTPException(
            status_code=404,
            detail="Enquiry not found.",
        )

    # --------------------------------------------------------
    # PREVENT DUPLICATE CONFIRMED BOOKINGS
    # --------------------------------------------------------
    #
    # If admin is trying to confirm this enquiry, check whether
    # another CONFIRMED enquiry already exists for the same
    # phone number + destination.
    #
    # Pending / Contacted enquiries are allowed.
    # Only CONFIRMED bookings are blocked.
    #

    if update.status == EnquiryStatus.CONFIRMED:

        existing_booking = await _find_existing_confirmed_booking(
            collection,
            existing.get("phone", ""),
            existing.get("destination", ""),
        )

        # Ignore the current enquiry itself.
        if (
            existing_booking is not None
            and str(existing_booking["_id"]) != enquiry_id
        ):
            raise HTTPException(
                status_code=409,
                detail=(
                    "This customer already has a confirmed booking "
                    "for this destination."
                ),
            )

    # --------------------------------------------------------
    # UPDATE STATUS
    # --------------------------------------------------------

    fields_to_set = {
        "status": update.status.value
    }

    # Only decide the price/offer type the first time
    # an enquiry is confirmed.
    #
    # This locks the Early Bird price at confirmation time.
    is_newly_confirmed = (
        update.status == EnquiryStatus.CONFIRMED
        and existing.get("offer_type") is None
    )

    if is_newly_confirmed:

        offer_type, price = await _resolve_offer_for_confirmation(
            collection,
            existing,
        )

        fields_to_set["offer_type"] = offer_type
        fields_to_set["price"] = price

    # Update MongoDB
    await collection.update_one(
        {"_id": object_id},
        {"$set": fields_to_set},
    )

    # Get updated document
    updated = await collection.find_one(
        {"_id": object_id}
    )

    return _to_enquiry_out(updated)


# ============================================================
# DELETE ENQUIRY - ADMIN ONLY
# ============================================================

@router.delete("/{enquiry_id}")
async def delete_enquiry(
    enquiry_id: str,
    _admin: str = Depends(require_admin),
):
    """
    Permanently delete an enquiry.

    Only authenticated admins can use this endpoint.
    """

    collection = get_enquiries_collection()

    # Validate MongoDB ID
    try:
        object_id = ObjectId(enquiry_id)

    except InvalidId as exc:
        raise HTTPException(
            status_code=400,
            detail="Invalid enquiry id.",
        ) from exc

    # Delete enquiry
    result = await collection.delete_one(
        {"_id": object_id}
    )

    # Enquiry doesn't exist
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Enquiry not found.",
        )

    return {
        "success": True,
        "message": "Enquiry deleted successfully.",
    }


# ============================================================
# FIND EXISTING CONFIRMED BOOKING
# ============================================================

async def _find_existing_confirmed_booking(
    collection,
    phone: str,
    destination: str,
):
    """
    Look up a CONFIRMED/BOOKED enquiry for this
    phone + destination.

    Destination comparison is case-insensitive and trimmed.

    Pending or Contacted enquiries are deliberately excluded.
    Only a locked-in confirmed booking blocks another booking.
    """

    normalized_destination = (
        destination or ""
    ).strip().lower()

    cursor = collection.find(
        {
            "phone": phone,
            "status": EnquiryStatus.CONFIRMED.value,
        }
    )

    async for doc in cursor:

        if (
            (doc.get("destination") or "")
            .strip()
            .lower()
            == normalized_destination
        ):
            return doc

    return None


# ============================================================
# CREATE ADMIN NOTIFICATION
# ============================================================

async def _create_new_enquiry_notification(
    enquiry_id: str,
    name: str,
    destination: str,
) -> None:

    notifications = get_notifications_collection()

    await notifications.insert_one(
        {
            "enquiry_id": enquiry_id,
            "message": f"New enquiry received from {name}",
            "customer_name": name,
            "destination": destination,
            "created_at": datetime.now(timezone.utc),
            "read": False,
        }
    )


# ============================================================
# RESOLVE OFFER / PRICE
# ============================================================

async def _resolve_offer_for_confirmation(
    collection,
    existing: dict,
) -> tuple[str, int]:
    """
    Decide Early Bird vs Regular pricing
    for an enquiry being confirmed now.

    Early Bird capacity is based on the number of
    CONFIRMED MEMBERS/TRAVELLERS, not booking documents.
    """

    destination = (
        existing.get("destination") or ""
    ).strip().lower()

    # Only Munnar receives Early Bird pricing
    if destination != EARLY_BIRD_DESTINATION:
        return "Regular", REGULAR_PRICE

    # Offer expired
    if datetime.now(timezone.utc) >= _OFFER_DEADLINE:
        return "Regular", REGULAR_PRICE

    # --------------------------------------------------------
    # COUNT CONFIRMED EARLY BIRD MEMBERS
    # --------------------------------------------------------
    #
    # We sum the travellers field instead of counting
    # booking documents.
    #

    pipeline = [
        {
            "$match": {
                "status": EnquiryStatus.CONFIRMED.value,
                "offer_type": "Early Bird",
            }
        },
        {
            "$group": {
                "_id": None,
                "booked": {
                    "$sum": {
                        "$ifNull": ["$travellers", 0]
                    }
                },
            }
        },
    ]

    result = await collection.aggregate(
        pipeline
    ).to_list(length=1)

    confirmed_early_bird_members = (
        int(result[0]["booked"])
        if result
        else 0
    )

    # Number of members in the booking being confirmed
    current_booking_members = int(
        existing.get("travellers") or 0
    )

    # --------------------------------------------------------
    # CHECK WHETHER THE COMPLETE BOOKING FITS
    # --------------------------------------------------------
    #
    # Example:
    #
    # Existing Early Bird members = 6
    # New booking members = 1
    # 6 + 1 = 7 -> Early Bird
    #
    # Existing Early Bird members = 6
    # New booking members = 2
    # 6 + 2 = 8 -> Regular
    #
    if (
        confirmed_early_bird_members
        + current_booking_members
        <= EARLY_BIRD_SEAT_LIMIT
    ):
        return "Early Bird", EARLY_BIRD_PRICE

    # Not enough Early Bird capacity for this booking.
    return "Regular", REGULAR_PRICE


# ============================================================
# EARLY BIRD SUMMARY
# ============================================================

async def _get_early_bird_summary(
    collection,
) -> EarlyBirdSummary:
    """
    Calculate Early Bird availability using
    CONFIRMED MEMBERS/TRAVELLERS.

    Pending, Contacted and other non-confirmed enquiries
    do not consume Early Bird capacity.
    """

    pipeline = [
        {
            "$match": {
                "status": EnquiryStatus.CONFIRMED.value,
                "offer_type": "Early Bird",
            }
        },
        {
            "$group": {
                "_id": None,
                "booked": {
                    "$sum": {
                        "$ifNull": ["$travellers", 0]
                    }
                },
            }
        },
    ]

    result = await collection.aggregate(
        pipeline
    ).to_list(length=1)

    booked = (
        int(result[0]["booked"])
        if result
        else 0
    )

    remaining = max(
        0,
        EARLY_BIRD_SEAT_LIMIT - booked,
    )

    return EarlyBirdSummary(
        total=EARLY_BIRD_SEAT_LIMIT,
        booked=booked,
        remaining=remaining,
    )


# ============================================================
# CONVERT MONGO DOCUMENT TO API RESPONSE
# ============================================================

def _to_enquiry_out(doc: dict) -> EnquiryOut:

    return EnquiryOut(
        id=str(doc["_id"]),
        name=doc["name"],
        phone=doc["phone"],
        email=doc.get("email"),
        destination=doc["destination"],
        travel_date_from=doc["travel_date_from"],
        travel_date_to=doc["travel_date_to"],
        travellers=doc["travellers"],
        trip_type=doc["trip_type"],
        message=doc.get("message"),
        created_at=doc["created_at"],
        status=doc.get(
            "status",
            EnquiryStatus.PENDING.value,
        ),
        offer_type=doc.get("offer_type"),
        price=doc.get("price"),
    )