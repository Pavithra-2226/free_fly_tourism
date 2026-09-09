"""
MongoDB connection using Motor (async driver).

Kept intentionally minimal: one client, one database, one collection
getter. Reused by main.py on startup/shutdown and by the enquiries route.
"""
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

client: AsyncIOMotorClient | None = None


def connect_to_mongo() -> None:
    global client
    client = AsyncIOMotorClient(settings.mongo_uri)


def close_mongo_connection() -> None:
    global client
    if client is not None:
        client.close()


def get_enquiries_collection():
    if client is None:
        raise RuntimeError("MongoDB client not initialized yet")
    db = client[settings.mongo_db_name]
    return db["enquiries"]


def get_notifications_collection():
    if client is None:
        raise RuntimeError("MongoDB client not initialized yet")
    db = client[settings.mongo_db_name]
    return db["notifications"]
