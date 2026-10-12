from __future__ import annotations

from flask import Flask


def register_api(app: Flask) -> None:
    """
    Register all SnapAction API blueprints.
    """

    from app.api.health import health_bp
    from app.api.analysis import analysis_bp

    app.register_blueprint(
        health_bp,
        url_prefix="/api",
    )

    app.register_blueprint(
        analysis_bp,
        url_prefix="/api",
    )

    # Register future modules here when implemented:
    #
    # from app.api.assistant import assistant_bp
    # from app.api.resources import resources_bp
    # from app.api.actions import actions_bp
    # from app.api.reminders import reminders_bp
    # from app.api.search import search_bp