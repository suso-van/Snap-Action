from __future__ import annotations

from datetime import datetime, timezone

from flask import Blueprint, current_app, jsonify


health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health():
    """
    Return server health independently of AI availability.
    """
    provider = current_app.config.get("AI_PROVIDER", "unknown")

    if provider == "gemini":
        ai_available = bool(
            current_app.config.get("GEMINI_API_KEY")
        )
    elif provider == "mock":
        ai_available = True
    else:
        ai_available = False

    current_time = (
        datetime.now(timezone.utc)
        .isoformat()
        .replace("+00:00", "Z")
    )

    return jsonify({
        "status": "ok",
        "time": current_time,
        "aiAvailable": ai_available,
    }), 200