from __future__ import annotations

from typing import Any, Mapping

from flask import current_app, has_app_context

from app.ai.providers.base import AIProvider
from app.ai.providers.gemini import GeminiProvider
from app.errors import AIProviderUnavailable


def get_ai_provider(
    config: Mapping[str, Any] | None = None,
) -> AIProvider:
    """
    Return the configured AI provider.

    Pass a config mapping explicitly when using this function
    outside a Flask application context.
    """

    if config is None:
        if not has_app_context():
            raise RuntimeError(
                "get_ai_provider() requires a Flask application "
                "context or an explicit config mapping."
            )

        config = current_app.config

    provider_name = str(
        config.get("AI_PROVIDER", "gemini")
    ).strip().lower()

    if provider_name == "gemini":
        return GeminiProvider(
            api_key=str(
                config.get("GEMINI_API_KEY", "")
            ),
            model=str(
                config.get("GEMINI_MODEL", "")
            ),
            timeout_seconds=float(
                config.get(
                    "AI_REQUEST_TIMEOUT_SECONDS",
                    45.0,
                )
            ),
        )

    raise AIProviderUnavailable(
        f"The configured AI provider '{provider_name}' "
        "is not supported."
    )