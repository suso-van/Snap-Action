from __future__ import annotations

import base64
from typing import Any

import httpx

from app.ai.providers.base import (
    AIProvider,
    AIResponse,
    ResponseFormat,
)
from app.errors import (
    AIProviderUnavailable,
    AnalysisFailed,
)


GEMINI_API_BASE = (
    "https://generativelanguage.googleapis.com/v1beta/models"
)


class GeminiProvider(AIProvider):
    """
    Gemini REST API adapter.

    The API key is sent in the x-goog-api-key header.
    It is never added to application logs or response bodies.
    """

    def __init__(
        self,
        api_key: str,
        model: str,
        timeout_seconds: float = 45.0,
    ) -> None:
        if not api_key or not api_key.strip():
            raise AIProviderUnavailable(
                "Gemini is not configured. Set GEMINI_API_KEY "
                "in your backend environment."
            )

        if not model or not model.strip():
            raise AIProviderUnavailable(
                "Set GEMINI_MODEL to a valid model name."
            )

        model = model.strip()

        if model.startswith("models/"):
            model = model.removeprefix("models/")

        self._api_key = api_key.strip()
        self.model = model
        self.timeout_seconds = timeout_seconds

    def generate(
        self,
        prompt: str,
        *,
        image_data: bytes | None = None,
        image_mime_type: str | None = None,
        system_instruction: str | None = None,
        response_format: ResponseFormat = "text/plain",
    ) -> AIResponse:
        if not prompt or not prompt.strip():
            raise AnalysisFailed(
                "The AI prompt cannot be empty."
            )

        parts: list[dict[str, Any]] = [
            {"text": prompt.strip()}
        ]

        if image_data is not None:
            if not image_mime_type:
                raise AnalysisFailed(
                    "An image MIME type is required when "
                    "sending image data."
                )

            image_base64 = base64.b64encode(
                image_data
            ).decode("ascii")

            parts.append(
                {
                    "inline_data": {
                        "mime_type": image_mime_type,
                        "data": image_base64,
                    }
                }
            )

        payload: dict[str, Any] = {
            "contents": [
                {
                    "role": "user",
                    "parts": parts,
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
            },
        }

        if system_instruction:
            payload["systemInstruction"] = {
                "parts": [
                    {"text": system_instruction.strip()}
                ]
            }

        if response_format == "application/json":
            payload["generationConfig"]["responseMimeType"] = (
                "application/json"
            )
        elif response_format != "text/plain":
            raise AnalysisFailed(
                "The requested AI response format is unsupported."
            )

        endpoint = (
            f"{GEMINI_API_BASE}/{self.model}:generateContent"
        )

        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": self._api_key,
        }

        try:
            response = httpx.post(
                endpoint,
                headers=headers,
                json=payload,
                timeout=self.timeout_seconds,
            )

        except httpx.TimeoutException:
            raise AIProviderUnavailable(
                "The AI request timed out. Please try again."
            ) from None

        except httpx.RequestError:
            raise AIProviderUnavailable(
                "Could not connect to the AI provider."
            ) from None

        if response.status_code == 429:
            raise AIProviderUnavailable(
                "The AI provider is rate-limiting requests. "
                "Please try again later."
            )

        if response.status_code in (401, 403):
            raise AIProviderUnavailable(
                "The AI provider rejected the credentials. "
                "Check GEMINI_API_KEY and its permissions."
            )

        if response.status_code == 404:
            raise AIProviderUnavailable(
                "The configured AI model was not found. "
                "Check GEMINI_MODEL."
            )

        if response.status_code >= 500:
            raise AIProviderUnavailable(
                "The AI provider is temporarily unavailable."
            )

        if not response.is_success:
            raise AIProviderUnavailable(
                "The AI provider rejected the request. "
                "Check the request settings and model configuration."
            )

        try:
            result = response.json()
        except ValueError:
            raise AnalysisFailed(
                "The AI provider returned an invalid response."
            ) from None

        candidates = result.get("candidates", [])

        if not candidates:
            # Do not expose provider internals or user data.
            raise AnalysisFailed(
                "The AI provider did not return a usable answer."
            )

        candidate = candidates[0]
        content = candidate.get("content") or {}
        response_parts = content.get("parts") or []

        text_parts = [
            part["text"]
            for part in response_parts
            if isinstance(part, dict)
            and isinstance(part.get("text"), str)
            and not part.get("thought", False)
        ]

        generated_text = "\n".join(text_parts).strip()

        if not generated_text:
            raise AnalysisFailed(
                "The AI provider returned an empty answer."
            )

        usage_metadata = result.get("usageMetadata")

        return AIResponse(
            text=generated_text,
            model=self.model,
            usage=(
                usage_metadata
                if isinstance(usage_metadata, dict)
                else None
            ),
        )