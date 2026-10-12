from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Literal


ResponseFormat = Literal[
    "text/plain",
    "application/json",
]


@dataclass(frozen=True)
class AIResponse:
    """
    Normalized response returned by an AI provider.
    """

    text: str
    model: str
    usage: dict[str, Any] | None = None


class AIProvider(ABC):
    """
    Base interface for multimodal AI providers.
    """

    @abstractmethod
    def generate(
        self,
        prompt: str,
        *,
        image_data: bytes | None = None,
        image_mime_type: str | None = None,
        system_instruction: str | None = None,
        response_format: ResponseFormat = "text/plain",
    ) -> AIResponse:
        """
        Generate a text response, optionally using an image.

        Args:
            prompt: User or application prompt.
            image_data: Raw image bytes, not base64 text.
            image_mime_type: MIME type of the image.
            system_instruction: Optional model instructions.
            response_format: Plain text or JSON output.

        Returns:
            A normalized AIResponse.

        Raises:
            AppError: If the provider cannot process the request.
        """
        raise NotImplementedError