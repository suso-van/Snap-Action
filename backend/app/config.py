from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


# Load backend/.env for local development.
BACKEND_ROOT = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND_ROOT / ".env")


def _get_bool(name: str, default: bool = False) -> bool:
    value = os.getenv(name)

    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


def _get_int(name: str, default: int) -> int:
    value = os.getenv(name)

    if value is None:
        return default

    try:
        parsed = int(value)
    except ValueError as exc:
        raise ValueError(
            f"{name} must be a valid integer."
        ) from exc

    if parsed <= 0:
        raise ValueError(f"{name} must be greater than zero.")

    return parsed


def _get_float(name: str, default: float) -> float:
    value = os.getenv(name)

    if value is None:
        return default

    try:
        parsed = float(value)
    except ValueError as exc:
        raise ValueError(
            f"{name} must be a valid number."
        ) from exc

    if parsed <= 0:
        raise ValueError(f"{name} must be greater than zero.")

    return parsed


def _get_csv(name: str, default: str) -> list[str]:
    value = os.getenv(name, default)

    return [
        item.strip().rstrip("/")
        for item in value.split(",")
        if item.strip()
    ]


class Config:
    # Application
    APP_NAME = os.getenv("APP_NAME", "SnapAction")
    APP_ENV = os.getenv("APP_ENV", "development")

    DEBUG = _get_bool("DEBUG", False)
    TESTING = False

    SECRET_KEY = os.getenv(
        "FLASK_SECRET_KEY",
        "development-only-change-me",
    )

    # Upload limits
    MAX_CONTENT_LENGTH_BYTES = _get_int(
        "MAX_CONTENT_LENGTH_BYTES",
        50 * 1024 * 1024,
    )

    MAX_DECODED_IMAGE_BYTES = _get_int(
        "MAX_DECODED_IMAGE_BYTES",
        12 * 1024 * 1024,
    )

    # AI provider: use local Ollama by default
    AI_PROVIDER = os.getenv(
        "AI_PROVIDER",
        "ollama",
    ).strip().lower()

    AI_REQUEST_TIMEOUT_SECONDS = _get_float(
        "AI_REQUEST_TIMEOUT_SECONDS",
        180.0,
    )

    # Local Ollama configuration
    OLLAMA_BASE_URL = os.getenv(
        "OLLAMA_BASE_URL",
        "http://127.0.0.1:11434",
    ).strip().rstrip("/")

    OLLAMA_MODEL = os.getenv(
        "OLLAMA_MODEL",
        "qwen3-vl:4b-instruct",
    ).strip()

    OLLAMA_REQUEST_TIMEOUT_SECONDS = _get_float(
        "OLLAMA_REQUEST_TIMEOUT_SECONDS",
        180.0,
    )

    # Optional Gemini configuration
    # These values are ignored when AI_PROVIDER=ollama.
    GEMINI_API_KEY = os.getenv(
        "GEMINI_API_KEY",
        "",
    ).strip()

    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-2.5-flash",
    ).strip()

    # Frontend CORS
    CORS_ORIGINS = _get_csv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )

    # Logging
    LOG_LEVEL = os.getenv(
        "LOG_LEVEL",
        "INFO",
    ).upper()