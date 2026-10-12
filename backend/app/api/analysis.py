from __future__ import annotations

from flask import Blueprint, jsonify, request

from app.errors import InvalidRequest
from app.request_context import get_request_id
from app.services.analysis_service import analyze_screenshot


analysis_bp = Blueprint(
    "analysis",
    __name__,
)


@analysis_bp.post("/analyze-screenshot")
def analyze_screenshot_endpoint():
    """
    POST /api/analyze-screenshot

    Expected JSON:
    {
        "imageBase64": "...",
        "mimeType": "image/png",
        "filename": "screenshot.png"
    }

    Returns the analysis object at the top level.
    """

    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        raise InvalidRequest(
            "Send a JSON object with an imageBase64 field."
        )

    analysis = analyze_screenshot(payload)

    response = analysis.model_dump(
        by_alias=True,
        mode="json",
    )

    response["requestId"] = get_request_id()

    return jsonify(response), 200