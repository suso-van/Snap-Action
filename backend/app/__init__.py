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

    # Prevent oversized HTTP request bodies.
    app.config["MAX_CONTENT_LENGTH"] = app.config[
        "MAX_CONTENT_LENGTH_BYTES"
    ]

    # Never run production with a development secret.
    if app.config["APP_ENV"] == "production":
        secret = app.config.get("SECRET_KEY")

        if (
            not secret
            or secret in {
                "development-only-change-me",
                "replace-with-a-random-secret",
            }
        ):
            raise RuntimeError(
                "Set a secure FLASK_SECRET_KEY before "
                "running SnapAction in production."
            )

    configure_logging(app)

    # Assign a request ID before handling every request.
    app.before_request(request_id_before_request)

    # Add the request ID to every response.
    @app.after_request
    def add_request_id(response):
        response.headers["X-Request-ID"] = get_request_id()
        return response

    # Configure CORS without requiring an additional package.
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

            vary = response.headers.get("Vary", "")
            vary_values = {
                value.strip()
                for value in vary.split(",")
                if value.strip()
            }

            if "*" not in allowed_origins:
                vary_values.add("Origin")
                response.headers["Vary"] = ", ".join(
                    sorted(vary_values)
                )

        return response

    # Expected application errors.
    @app.errorhandler(AppError)
    def handle_app_error(error: AppError):
        response = jsonify(
            {
                "error": {
                    "code": error.code,
                    "message": error.message,
                    "request_id": get_request_id(),
                }
            }
        )

        response.status_code = error.status_code
        return response

    # Oversized uploads.
    @app.errorhandler(RequestEntityTooLarge)
    def handle_oversized_request(error):
        app_error = PayloadTooLarge()

        response = jsonify(
            {
                "error": {
                    "code": app_error.code,
                    "message": app_error.message,
                    "request_id": get_request_id(),
                }
            }
        )

        response.status_code = 413
        return response

    # Standard HTTP errors, including 404 and 405.
    @app.errorhandler(HTTPException)
    def handle_http_error(error: HTTPException):
        status_code = error.code or 500

        response = jsonify(
            {
                "error": {
                    "code": error.name.upper().replace(" ", "_"),
                    "message": error.description,
                    "request_id": get_request_id(),
                }
            }
        )

        response.status_code = status_code
        return response

    # Unexpected errors should not expose stack traces to clients.
    @app.errorhandler(Exception)
    def handle_unexpected_error(error: Exception):
        app.logger.exception(
            "Unhandled application error",
            extra={"request_id": get_request_id()},
        )

        response = jsonify(
            {
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": (
                        "An unexpected error occurred. "
                        "Please try again."
                    ),
                    "request_id": get_request_id(),
                }
            }
        )

        response.status_code = 500
        return response

    # Register the API routes.
    from app.api import register_api

    register_api(app)

    return app