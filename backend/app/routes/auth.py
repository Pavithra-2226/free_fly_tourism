"""
Admin login.

POST /api/auth/login - the only unauthenticated admin-auth endpoint.
Everything else admin-related requires the bearer token this returns.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.auth import create_admin_token, verify_admin_credentials

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest) -> LoginResponse:
    if not verify_admin_credentials(payload.username, payload.password):
        raise HTTPException(status_code=401, detail="Invalid username or password.")

    token = create_admin_token(payload.username)
    return LoginResponse(access_token=token)
