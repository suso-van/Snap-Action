from __future__ import annotations

from flask import Blueprint, jsonify, request

from app.errors import InvalidRequest
from app.request_context import get_request_id
from app.services.assistant_service import ask_about_screenshot


assistant_bp = Blueprint(
    "assistant",
    __name__,
)


@assistant_bp.post("/ask-screenshot")
def ask_screenshot_endpoint():
    """
    POST /api/ask-screenshot

    Accepts a question and screenshot context or image data.
    Returns a contextual answer and suggested follow-up questions.
    """

    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        raise InvalidRequest(
            "Send a JSON object containing a question."
        )

    result = ask_about_screenshot(payload)

    response = result.model_dump(
        by_alias=True,
        mode="json",
    )

    response["requestId"] = get_request_id()

    return jsonify(response), 200