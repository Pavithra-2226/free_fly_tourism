"""
Pydantic models for the enquiry form and admin enquiries.
"""

from datetime import date, datetime, timedelta
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ============================================================
# EARLY BIRD CONFIG
# ============================================================

EARLY_BIRD_DESTINATION = "munnar"
EARLY_BIRD_SEAT_LIMIT = 7
EARLY_BIRD_PRICE = 2699
REGULAR_PRICE = 2999

# Fixed deadline - IST
EARLY_BIRD_OFFER_ENDS_AT = "2026-09-10T23:59:59+05:30"


# ============================================================
# ENQUIRY STATUS
# ============================================================

class EnquiryStatus(str, Enum):
    PENDING = "Pending"
    CONTACTED = "Contacted"
    CONFIRMED = "Confirmed / Booked"
    CANCELLED = "Cancelled"


# ============================================================
# CUSTOMER ENQUIRY
# ============================================================

class EnquiryCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    phone: str = Field(
        ...,
        min_length=7,
        max_length=20,
    )

    # Keep optional for compatibility with any old records.
    email: Optional[EmailStr] = None

    destination: str = Field(
        default="Munnar",
        min_length=2,
        max_length=100,
    )

    travel_date_from: date
    travel_date_to: date

    travellers: int = Field(
        ...,
        ge=1,
        le=50,
    )

    # Kept optional so existing MongoDB records remain compatible.
    trip_type: Optional[str] = None

    # Kept optional for old records.
    message: Optional[str] = Field(
        default=None,
        max_length=1000,
    )

    @field_validator("phone")
    @classmethod
    def phone_must_be_digits(
        cls,
        value: str,
    ) -> str:

        cleaned = (
            value
            .replace(" ", "")
            .replace("-", "")
        )

        digits = cleaned.lstrip("+")

        if not digits.isdigit():
            raise ValueError(
                "Phone number must contain only digits, "
                "spaces, '-' or a leading '+'"
            )

        if len(digits) < 7:
            raise ValueError(
                "Phone number is too short"
            )

        return cleaned

    @field_validator("destination")
    @classmethod
    def destination_must_be_munnar(
        cls,
        value: str,
    ) -> str:

        if value.strip().lower() != "munnar":
            raise ValueError(
                "This enquiry form is currently available "
                "only for the Munnar trip."
            )

        return "Munnar"

    @field_validator("travel_date_from")
    @classmethod
    def travel_date_must_be_saturday(
        cls,
        value: date,
    ) -> date:

        # Monday = 0
        # Saturday = 5
        if value.weekday() != 5:
            raise ValueError(
                "Travel date must be a Saturday."
            )

        return value

    @field_validator("travel_date_to")
    @classmethod
    def travel_date_must_be_sunday(
        cls,
        value: date,
        info,
    ) -> date:

        from_date = info.data.get(
            "travel_date_from"
        )

        if from_date:
            expected_to_date = (
                from_date + timedelta(days=1)
            )

            if value != expected_to_date:
                raise ValueError(
                    "This trip runs from Saturday to Sunday."
                )

        return value


# ============================================================
# DATABASE MODEL
# ============================================================

class EnquiryInDB(EnquiryCreate):
    created_at: datetime = Field(
        default_factory=datetime.utcnow
    )

    # Every new enquiry starts as Pending.
    status: EnquiryStatus = EnquiryStatus.PENDING

    # Assigned only when admin confirms.
    offer_type: Optional[str] = None
    price: Optional[int] = None


# ============================================================
# CREATE RESPONSE
# ============================================================

class EnquiryResponse(BaseModel):
    success: bool
    message: str
    id: Optional[str] = None


# ============================================================
# ADMIN ENQUIRY RESPONSE
# ============================================================

class EnquiryOut(BaseModel):
    id: str
    name: str
    phone: str

    email: Optional[EmailStr] = None

    destination: str

    travel_date_from: date
    travel_date_to: date

    travellers: int

    # Optional for compatibility with old records.
    trip_type: Optional[str] = None

    message: Optional[str] = None

    created_at: datetime

    status: EnquiryStatus

    offer_type: Optional[str] = None
    price: Optional[int] = None


# ============================================================
# EARLY BIRD SUMMARY
# ============================================================

class EarlyBirdSummary(BaseModel):
    total: int = EARLY_BIRD_SEAT_LIMIT
    booked: int
    remaining: int


class EnquiryListResponse(BaseModel):
    enquiries: list[EnquiryOut]
    early_bird: EarlyBirdSummary


# ============================================================
# STATUS UPDATE
# ============================================================

class EnquiryStatusUpdate(BaseModel):
    status: EnquiryStatus


# ============================================================
# PUBLIC EARLY BIRD SUMMARY
# ============================================================

class EarlyBirdPublicSummary(BaseModel):
    total: int
    booked: int
    remaining: int

    early_bird_price: int
    regular_price: int

    offer_ends_at: str

    sold_out: bool
    offer_expired: bool


# ============================================================
# NOTIFICATIONS
# ============================================================

class NotificationOut(BaseModel):
    id: str
    enquiry_id: str

    message: str
    customer_name: str
    destination: str

    created_at: datetime
    read: bool