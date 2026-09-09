"""
Minimal admin authentication.

Deliberately simple, per the brief: one admin account, credentials from
environment variables (never hardcoded, never sent to the frontend build),
a signed JWT issued on login, and a FastAPI dependency (`require_admin`)
that protects admin-only routes. No user table, no roles, no refresh-token
dance - just enough to stop the admin API being publicly open.
"""
import hmac
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

_JWT_ALGORITHM = "HS256"
_bearer_scheme = HTTPBearer(auto_error=False)


def _ensure_configured() -> None:
    """Fail loudly (not with a mysterious 500) if the deployment forgot to set secrets."""
    if not settings.admin_password or not settings.admin_secret_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Admin auth is not configured. Set ADMIN_PASSWORD and "
                "ADMIN_SECRET_KEY in the backend environment."
            ),
        )


def verify_admin_credentials(username: str, password: str) -> bool:
    _ensure_configured()
    # constant-time comparisons - avoids leaking timing info about the secret
    username_ok = hmac.compare_digest(username, settings.admin_username)
    password_ok = hmac.compare_digest(password, settings.admin_password)
    return username_ok and password_ok


def create_admin_token(username: str) -> str:
    _ensure_configured()
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.admin_token_expire_minutes
    )
    payload = {"sub": username, "role": "admin", "exp": expires_at}
    return jwt.encode(payload, settings.admin_secret_key, algorithm=_JWT_ALGORITHM)


def require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> str:
    """FastAPI dependency - attach to any admin-only route.

    Returns the admin username on success; raises 401 on missing/invalid/
    expired token so unauthenticated requests never reach the route body.
    """
    _ensure_configured()

    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(
            credentials.credentials, settings.admin_secret_key, algorithms=[_JWT_ALGORITHM]
        )
    except jwt.ExpiredSignatureError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc
    except jwt.InvalidTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc

    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized.")

    return payload.get("sub", "admin")
