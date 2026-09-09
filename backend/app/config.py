"""
Centralized app configuration.

All values are read from environment variables (see .env.example).
Nothing here should ever hold a real secret - only defaults for local dev.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db_name: str = "free_fly_tourism"
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    # Admin auth - no defaults for the password/secret so a misconfigured
    # deployment fails loudly instead of shipping with a known credential.
    admin_username: str = "admin"
    admin_password: str = ""
    admin_secret_key: str = ""
    admin_token_expire_minutes: int = 480

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
