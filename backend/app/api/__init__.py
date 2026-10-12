from __future__ import annotations

from flask import Flask


def register_api(app: Flask) -> None:
    """
    Register all implemented SnapAction API blueprints.
    """

    from app.api.health import health_bp
    from app.api.analysis import analysis_bp
    from app.api.assistant import assistant_bp

    app.register_blueprint(
        health_bp,
        url_prefix="/api",
    )

    app.register_blueprint(
        analysis_bp,
        url_prefix="/api",
    )

    app.register_blueprint(
        assistant_bp,
        url_prefix="/api",
    )