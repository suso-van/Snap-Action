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


class OllamaProvider(AIProvider):
    """
    Local multimodal AI provider using Ollama.

    Supports text generation, screenshot understanding,
    and structured JSON responses using local models.
    """

    def __init__(
        self,
        base_url: str = "http://127.0.0.1:11434",
        model: str = "qwen3-vl:4b-instruct",
        timeout_seconds: float = 180.0,
    ) -> None:
        if not base_url.strip():
            raise AIProviderUnavailable(
                "OLLAMA_BASE_URL must be configured."
            )

        if not model.strip():
            raise AIProviderUnavailable(
                "OLLAMA_MODEL must be configured."
            )

        self.base_url = base_url.strip().rstrip("/")
        self.model = model.strip()
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
        """Generate a response using the local Ollama model."""

        if not prompt or not prompt.strip():
            raise AnalysisFailed(
                "The AI prompt cannot be empty."
            )

        messages: list[dict[str, Any]] = []

        if system_instruction:
            messages.append({
                "role": "system",
                "content": system_instruction.strip(),
            })

        user_message: dict[str, Any] = {
            "role": "user",
            "content": prompt.strip(),
        }

        if image_data is not None:
            if not image_mime_type:
                raise AnalysisFailed(
                    "An image MIME type is required."
                )

            user_message["images"] = [
                base64.b64encode(image_data).decode("ascii")
            ]

        messages.append(user_message)

        payload: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "think": False,
            "options": {
                "temperature": 0.1,
                "num_ctx": 8192,
                "num_predict": 4096,
            },
        }

        if response_format == "application/json":
            payload["format"] = "json"
        elif response_format != "text/plain":
            raise AnalysisFailed(
                "The requested response format is unsupported."
            )

        try:
            response = httpx.post(
                f"{self.base_url}/api/chat",
                json=payload,
                timeout=self.timeout_seconds,
            )

        except httpx.TimeoutException:
            raise AIProviderUnavailable(
                "The local AI request timed out. "
                "Check system resources or try a smaller model."
            ) from None

        except httpx.RequestError:
            raise AIProviderUnavailable(
                "Cannot connect to Ollama. Make sure Ollama "
                "is running at the configured base URL."
            ) from None

        if response.status_code == 404:
            raise AIProviderUnavailable(
                f"Ollama could not find model '{self.model}'. "
                f"Run: ollama pull {self.model}"
            )

        if response.status_code == 429:
            raise AIProviderUnavailable(
                "Ollama is temporarily unable to process "
                "the request. Please retry."
            )

        if response.status_code >= 500:
            raise AIProviderUnavailable(
                "The Ollama server encountered an internal error."
            )

        if not response.is_success:
            raise AIProviderUnavailable(
                "Ollama rejected the request. Check the "
                "model, Ollama version, and configuration."
            )

        try:
            result = response.json()
        except ValueError:
            raise AnalysisFailed(
                "Ollama returned an invalid response."
            ) from None

        if result.get("error"):
            raise AIProviderUnavailable(
                "Ollama reported a model inference error. "
                "Check the local Ollama logs."
            )

        message = result.get("message") or {}
        generated_text = message.get("content")

        if (
            not isinstance(generated_text, str)
            or not generated_text.strip()
        ):
            thinking = message.get("thinking")

            if isinstance(thinking, str) and thinking.strip():
                raise AnalysisFailed(
                    "Ollama generated reasoning but no final "
                    "answer. Check the model and think parameter."
                )

            raise AnalysisFailed(
                "Ollama returned an empty response. "
                "Check the model and local Ollama logs."
            )

        usage: dict[str, Any] = {}

        prompt_tokens = result.get("prompt_eval_count")
        completion_tokens = result.get("eval_count")
        done_reason = result.get("done_reason")

        if isinstance(prompt_tokens, int):
            usage["prompt_tokens"] = prompt_tokens

        if isinstance(completion_tokens, int):
            usage["completion_tokens"] = completion_tokens

        if isinstance(done_reason, str):
            usage["done_reason"] = done_reason

        return AIResponse(
            text=generated_text.strip(),
            model=self.model,
            usage=usage or None,
        )