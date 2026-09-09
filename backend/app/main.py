"""
FastAPI entrypoint for the Free Fly & Tourism enquiry landing page.

Deliberately small: one router (enquiries), CORS for the frontend,
and MongoDB connect/disconnect wired to app startup/shutdown.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import close_mongo_connection, connect_to_mongo
from app.routes.auth import router as auth_router
from app.routes.enquiries import router as enquiries_router
from app.routes.notifications import router as notifications_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    connect_to_mongo()
    yield
    close_mongo_connection()


app = FastAPI(title="Free Fly & Tourism - Enquiry API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(enquiries_router)
app.include_router(auth_router)
app.include_router(notifications_router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
