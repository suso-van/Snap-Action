from __future__ import annotations

import json
from typing import Any

from pydantic import ValidationError

from app.errors import AnalysisFailed
from app.schemas.analysis import AnalysisResult


def parse_json_object(text: str) -> dict[str, Any]:
    """
    Parse a JSON object from model output.

    Accepts plain JSON and JSON enclosed in Markdown code fences.
    """
    if not isinstance(text, str) or not text.strip():
        raise AnalysisFailed(
            "The AI returned an empty analysis."
        )

    content = text.strip()

    if content.startswith("```"):
        lines = content.splitlines()

        if (
            len(lines) >= 2
            and lines[-1].strip().startswith("```")
        ):
            content = "\n".join(lines[1:-1]).strip()

        if content.lower().startswith("json"):
            content = content[4:].strip()

    try:
        result = json.loads(content)
    except json.JSONDecodeError:
        # Some models accidentally add text around the JSON.
        # Attempt to recover a single enclosing object.
        start = content.find("{")
        end = content.rfind("}")

        if start < 0 or end <= start:
            raise AnalysisFailed(
                "The AI returned invalid structured data."
            ) from None

        try:
            result = json.loads(content[start:end + 1])
        except json.JSONDecodeError:
            raise AnalysisFailed(
                "The AI returned invalid structured data."
            ) from None

    if not isinstance(result, dict):
        raise AnalysisFailed(
            "The AI analysis must be a JSON object."
        )

    # Support a nested result if a provider wraps the analysis.
    nested = result.get("result")

    if isinstance(nested, dict):
        result = nested

    return result


def validate_analysis(text: str) -> AnalysisResult:
    """
    Parse model output and enforce the AnalysisResult contract.
    """
    payload = parse_json_object(text)

    try:
        return AnalysisResult.model_validate(payload)

    except ValidationError:
        raise AnalysisFailed(
            "The AI response did not match SnapAction's "
            "expected analysis format. Please try again."
        ) from None