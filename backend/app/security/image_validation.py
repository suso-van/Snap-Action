from __future__ import annotations

import base64
import binascii
import io
import re

from dataclasses import dataclass

from PIL import (
    Image,
    UnidentifiedImageError,
)

from app.errors import AppError


SUPPORTED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
}

DATA_URL_RE = re.compile(
    r"^data:([^;,]+)?;base64,(.*)$",
    re.IGNORECASE | re.DOTALL,
)

FORMAT_TO_MIME = {
    "JPEG": "image/jpeg",
    "PNG": "image/png",
    "WEBP": "image/webp",
    "GIF": "image/gif",
}

MAX_IMAGE_PIXELS = 80_000_000


@dataclass(frozen=True)
class ValidatedImage:
    data: bytes
    mime_type: str
    width: int
    height: int


def decode_and_validate_image(
    payload: str,
    mime_type: str | None,
    max_decoded_bytes: int,
) -> ValidatedImage:
    """
    Decode and validate an uploaded screenshot.

    Supports:
      - Raw base64 strings
      - Base64 data URLs
      - JPEG, PNG, WebP, and GIF

    Raises AppError on invalid or unsupported input.
    """

    if not isinstance(payload, str) or not payload.strip():
        raise AppError(
            "INVALID_REQUEST",
            "A valid imageBase64 field is required.",
            400,
        )

    if max_decoded_bytes <= 0:
        raise ValueError(
            "max_decoded_bytes must be greater than zero."
        )

    encoded = payload.strip()
    data_url_mime = None

    match = DATA_URL_RE.match(encoded)

    if match:
        data_url_mime = (
            (match.group(1) or "").lower() or None
        )

        encoded = match.group(2)

    requested_mime = (
        mime_type or data_url_mime or "image/jpeg"
    ).strip().lower()

    if requested_mime == "image/jpg":
        requested_mime = "image/jpeg"

    if data_url_mime == "image/jpg":
        data_url_mime = "image/jpeg"

    if requested_mime not in SUPPORTED_MIME_TYPES:
        raise AppError(
            "UNSUPPORTED_MEDIA_TYPE",
            "Use a JPEG, PNG, WebP, or GIF image.",
            415,
        )

    if (
        data_url_mime
        and mime_type
        and data_url_mime != requested_mime
    ):
        raise AppError(
            "INVALID_IMAGE",
            "The data URL MIME type does not match mimeType.",
            400,
        )

    # Remove permitted base64 whitespace before decoding.
    compact = re.sub(r"\s+", "", encoded)

    if not compact:
        raise AppError(
            "INVALID_IMAGE",
            "The uploaded image is empty.",
            400,
        )

    # Reject obviously oversized content before allocation.
    estimated_size = (len(compact) * 3) // 4

    if estimated_size > max_decoded_bytes + 2:
        raise AppError(
            "IMAGE_TOO_LARGE",
            "The decoded image exceeds the configured size limit.",
            413,
        )

    try:
        raw = base64.b64decode(
            compact,
            validate=True,
        )
    except (binascii.Error, ValueError):
        raise AppError(
            "INVALID_IMAGE",
            "imageBase64 is not valid base64 data.",
            400,
        ) from None

    if not raw:
        raise AppError(
            "INVALID_IMAGE",
            "The uploaded image is empty.",
            400,
        )

    if len(raw) > max_decoded_bytes:
        raise AppError(
            "IMAGE_TOO_LARGE",
            "The decoded image exceeds the configured size limit.",
            413,
        )

    try:
        with Image.open(io.BytesIO(raw)) as image:
            actual_format = (image.format or "").upper()

            actual_mime = FORMAT_TO_MIME.get(
                actual_format
            )

            if actual_mime is None:
                raise AppError(
                    "UNSUPPORTED_MEDIA_TYPE",
                    "The uploaded file is not a supported image.",
                    415,
                )

            if actual_mime != requested_mime:
                raise AppError(
                    "INVALID_IMAGE",
                    "mimeType does not match the uploaded image content.",
                    400,
                )

            width, height = image.size

            if (
                width < 1
                or height < 1
                or width * height > MAX_IMAGE_PIXELS
            ):
                raise AppError(
                    "INVALID_IMAGE",
                    "The image dimensions are invalid or too large.",
                    400,
                )

            # Verify the file structure before accepting it.
            image.verify()

    except AppError:
        raise

    except (
        UnidentifiedImageError,
        OSError,
        ValueError,
        Image.DecompressionBombError,
    ):
        raise AppError(
            "INVALID_IMAGE",
            "The uploaded file is not a valid supported image.",
            400,
        ) from None

    return ValidatedImage(
        data=raw,
        mime_type=actual_mime,
        width=width,
        height=height,
    )
    