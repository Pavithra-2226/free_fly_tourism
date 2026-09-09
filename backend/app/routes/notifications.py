"""
Admin notifications - simple "new enquiry received" alerts.

GET   /api/notifications           - admin: list notifications, newest first (auth required)
PATCH /api/notifications/{id}/read - admin: mark one notification as read (auth required)

Deliberately minimal: one collection, one boolean `read` flag. A new
notification is created by app/routes/enquiries.py whenever a customer
submits the public enquiry form.
"""
from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException

from app.auth import require_admin
from app.database import get_notifications_collection
from app.models import NotificationOut

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationOut])
async def list_notifications(_admin: str = Depends(require_admin)) -> list[NotificationOut]:
    collection = get_notifications_collection()
    cursor = collection.find().sort("created_at", -1).limit(50)

    notifications = []
    async for doc in cursor:
        notifications.append(_to_notification_out(doc))
    return notifications


@router.patch("/{notification_id}/read", response_model=NotificationOut)
async def mark_notification_read(
    notification_id: str, _admin: str = Depends(require_admin)
) -> NotificationOut:
    collection = get_notifications_collection()

    try:
        object_id = ObjectId(notification_id)
    except InvalidId as exc:
        raise HTTPException(status_code=400, detail="Invalid notification id.") from exc

    existing = await collection.find_one({"_id": object_id})
    if existing is None:
        raise HTTPException(status_code=404, detail="Notification not found.")

    await collection.update_one({"_id": object_id}, {"$set": {"read": True}})
    updated = await collection.find_one({"_id": object_id})
    return _to_notification_out(updated)


def _to_notification_out(doc: dict) -> NotificationOut:
    created_at = doc.get("created_at")
    if isinstance(created_at, str):
        created_at = datetime.fromisoformat(created_at)
    return NotificationOut(
        id=str(doc["_id"]),
        enquiry_id=doc.get("enquiry_id", ""),
        message=doc.get("message", ""),
        customer_name=doc.get("customer_name", ""),
        destination=doc.get("destination", ""),
        created_at=created_at,
        read=doc.get("read", False),
    )
