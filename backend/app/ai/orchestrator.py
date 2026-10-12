from __future__ import annotations

from app.ai.extraction import validate_analysis
from app.ai.prompts import (
    ANALYSIS_PROMPT,
    ANALYSIS_SYSTEM_INSTRUCTION,
)
from app.ai.providers.factory import get_ai_provider
from app.schemas.analysis import AnalysisResult


def analyze_image(
    image_data: bytes,
    mime_type: str,
) -> AnalysisResult:
    """
    Analyze a validated screenshot using the configured provider.

    This function does not persist data or execute actions.
    """

    provider = get_ai_provider()

    response = provider.generate(
        ANALYSIS_PROMPT,
        image_data=image_data,
        image_mime_type=mime_type,
        system_instruction=ANALYSIS_SYSTEM_INSTRUCTION,
        response_format="application/json",
    )

    return validate_analysis(response.text)