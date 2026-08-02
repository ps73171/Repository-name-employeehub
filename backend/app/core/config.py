from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "EmployeeHub API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"

    DATABASE_URL: str = (
        "postgresql+psycopg2://employeehub_user:change_me"
        "@database:5432/employeehub"
    )

    JWT_SECRET_KEY: str = "change-this-secret-key-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    FRONTEND_URL: str = "http://192.168.10.101:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()