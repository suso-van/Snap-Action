from __future__ import annotations

from flask import Flask, Blueprint


api_bp = Blueprint(
    "api",
    __name__,
    url_prefix="/api",
)


def register_api(app: Flask) -> None:
    """
    Register all API route blueprints.

    Additional blueprints will be registered here as the
    analysis, assistant, resources, and action modules are built.
    """
    from app.api.health import health_bp

    api_bp.register_blueprint(health_bp)

    # Register the API blueprint with the Flask application.
    app.register_blueprint(api_bp)