from __future__ import annotations

from typing import Any

from pydantic import ValidationError

from flask import current_app

from app.ai.orchestrator import analyze_image
from app.errors import InvalidRequest
from app.schemas.analysis import (
    AnalysisRequest,
    AnalysisResult,
)
from app.security.image_validation import (
    decode_and_validate_image,
)


def analyze_screenshot(
    payload: dict[str, Any],
) -> AnalysisResult:
    """
    Validate an incoming screenshot request and analyze the image.

    Database persistence and external action execution are
    intentionally outside this service for now.
    """

    if not isinstance(payload, dict):
        raise InvalidRequest(
            "The request body must be a JSON object."
        )

    try:
        request = AnalysisRequest.model_validate(payload)
    except ValidationError:
        raise InvalidRequest(
            "Provide a valid imageBase64 value and optional "
            "mimeType and filename fields."
        ) from None

    image = decode_and_validate_image(
        payload=request.image_base64,
        mime_type=request.mime_type,
        max_decoded_bytes=current_app.config[
            "MAX_DECODED_IMAGE_BYTES"
        ],
    )

    return analyze_image(
        image_data=image.data,
        mime_type=image.mime_type,
    )