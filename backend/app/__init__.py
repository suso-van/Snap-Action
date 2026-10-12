from __future__ import annotations

from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException, RequestEntityTooLarge

from app.config import Config
from app.errors import AppError, PayloadTooLarge
from app.logging_config import configure_logging
from app.request_context import (
    get_request_id,
    request_id_before_request,
)


def create_app(test_config: dict | None = None) -> Flask:
    """
    Create and configure the SnapAction Flask application.
    """

    app = Flask(__name__)

    app.config.from_object(Config)

    if test_config:
        app.config.update(test_config)

    # Configure maximum HTTP request size.
    app.config["MAX_CONTENT_LENGTH"] = app.config[
        "MAX_CONTENT_LENGTH_BYTES"
    ]

    # Prevent production from using a placeholder secret.
    if app.config["APP_ENV"] == "production":
        secret = app.config.get("SECRET_KEY")

        if secret in {
            None,
            "",
            "development-only-change-me",
            "replace-with-a-random-secret",
        }:
            raise RuntimeError(
                "Configure a secure FLASK_SECRET_KEY "
                "before running SnapAction in production."
            )

    # Configure application logging.
    configure_logging(app)

    # Generate a unique request ID for each request.
    app.before_request(request_id_before_request)

    @app.after_request
    def add_request_id(response):
        response.headers["X-Request-ID"] = get_request_id()
        return response

    # Configure CORS for approved frontend origins.
    @app.after_request
    def apply_cors(response):
        origin = request.headers.get("Origin")
        allowed_origins = app.config.get("CORS_ORIGINS", [])

        if origin and (
            origin in allowed_origins
            or "*" in allowed_origins
        ):
            response.headers["Access-Control-Allow-Origin"] = (
                "*" if "*" in allowed_origins else origin
            )

            response.headers["Access-Control-Allow-Methods"] = (
                "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            )

            response.headers["Access-Control-Allow-Headers"] = (
                "Content-Type, Authorization, X-Request-ID"
            )

            response.headers["Access-Control-Expose-Headers"] = (
                "X-Request-ID"
            )

            if "*" not in allowed_origins:
                response.headers.add("Vary", "Origin")

        return response

    # Handle known application errors.
    @app.errorhandler(AppError)
    def handle_app_error(error: AppError):
        return jsonify({
            "error": {
                "code": error.code,
                "message": error.message,
                "requestId": get_request_id(),
            }
        }), error.status_code

    # Handle oversized requests.
    @app.errorhandler(RequestEntityTooLarge)
    def handle_oversized_request(error):
        app_error = PayloadTooLarge()

        return jsonify({
            "error": {
                "code": app_error.code,
                "message": app_error.message,
                "requestId": get_request_id(),
            }
        }), 413

    # Handle standard HTTP errors.
    @app.errorhandler(HTTPException)
    def handle_http_error(error: HTTPException):
        return jsonify({
            "error": {
                "code": (
                    error.name.upper().replace(" ", "_")
                ),
                "message": error.description,
                "requestId": get_request_id(),
            }
        }), error.code or 500

    # Handle unexpected errors without exposing stack traces.
    @app.errorhandler(Exception)
    def handle_unexpected_error(error: Exception):
        app.logger.exception(
            "Unhandled application error",
            extra={"request_id": get_request_id()},
        )

        return jsonify({
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": (
                    "An unexpected error occurred. "
                    "Please try again."
                ),
                "requestId": get_request_id(),
            }
        }), 500

    # Register API endpoints.
    from app.api import register_api

    register_api(app)

    return app