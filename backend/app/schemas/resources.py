from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import Field, ConfigDict, model_validator

from app.schemas.analysis import (
    APIModel,
    AnalysisResult,
    Category,
    ExtractedEntity,
    SuggestedAction,
)


class ResourceImage(APIModel):
    """Server-generated reference to a stored screenshot."""

    content_type: Literal[
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    ] = Field(alias="contentType")

    url: str | None = None


class ResourceCreate(APIModel):
    """
    Analysis data submitted for resource creation.

    Ownership, IDs, and timestamps must be generated or derived
    by the backend rather than trusted from the request.
    """

    category: Category

    title: str = Field(
        min_length=1,
        max_length=240,
    )

    summary: str = Field(
        max_length=2000,
    )

    confidence_score: float = Field(
        alias="confidenceScore",
        ge=0,
        le=1,
    )

    category_confidence: float | None = Field(
        default=None,
        alias="categoryConfidence",
        ge=0,
        le=1,
    )

    warnings: list[str] = Field(
        default_factory=list,
        max_length=30,
    )

    extracted_entities: list[ExtractedEntity] = Field(
        alias="extractedEntities",
        max_length=200,
    )

    suggested_actions: list[SuggestedAction] = Field(
        alias="suggestedActions",
        max_length=50,
    )

    ocr_text: str | None = Field(
        default=None,
        alias="ocrText",
        max_length=100000,
    )

    # Must refer to a server-issued upload/storage reference.
    # Never treat a client-provided path as proof of ownership.
    image_storage_key: str | None = Field(
        default=None,
        alias="imageStorageKey",
        max_length=1024,
    )

    is_saved_to_library: bool = Field(
        default=False,
        alias="isSavedToLibrary",
    )

    is_archived: bool = Field(
        default=False,
        alias="isArchived",
    )

    tags: list[str] = Field(
        default_factory=list,
        max_length=50,
    )

    @model_validator(mode="after")
    def validate_tags(self):
        normalized = [tag.strip() for tag in self.tags]

        if any(not tag for tag in normalized):
            raise ValueError("Tags cannot be empty.")

        if any(len(tag) > 80 for tag in normalized):
            raise ValueError("Tags cannot exceed 80 characters.")

        if len(set(tag.casefold() for tag in normalized)) != len(normalized):
            raise ValueError("Duplicate tags are not allowed.")

        self.tags = normalized
        return self


class ResourceUpdate(APIModel):
    """
    Partial update for user-editable resource information.

    The service should use model_fields_set to determine which
    fields were actually included in the PATCH request.
    """

    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
        str_strip_whitespace=True,
    )

    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=240,
    )

    summary: str | None = Field(
        default=None,
        max_length=2000,
    )

    extracted_entities: list[ExtractedEntity] | None = Field(
        default=None,
        alias="extractedEntities",
        max_length=200,
    )

    is_saved_to_library: bool | None = Field(
        default=None,
        alias="isSavedToLibrary",
    )

    is_archived: bool | None = Field(
        default=None,
        alias="isArchived",
    )

    tags: list[str] | None = Field(
        default=None,
        max_length=50,
    )

    @model_validator(mode="after")
    def validate_patch(self):
        if not self.model_fields_set:
            raise ValueError(
                "Provide at least one field to update."
            )

        if "title" in self.model_fields_set and self.title is None:
            raise ValueError("Title cannot be null.")

        if "summary" in self.model_fields_set and self.summary is None:
            raise ValueError("Summary cannot be null.")

        if "extracted_entities" in self.model_fields_set:
            if self.extracted_entities is None:
                raise ValueError(
                    "Extracted entities cannot be null."
                )

        if "tags" in self.model_fields_set:
            if self.tags is None:
                raise ValueError("Tags cannot be null.")

            self.tags = [tag.strip() for tag in self.tags]

            if any(not tag or len(tag) > 80 for tag in self.tags):
                raise ValueError("Each tag must contain 1–80 characters.")

        return self


class ResourceRecord(AnalysisResult):
    """Complete server-side resource response."""

    id: str = Field(min_length=1)

    timestamp: int = Field(
        ge=0,
        description="Creation timestamp in epoch milliseconds.",
    )

    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")

    executed_actions: list[dict] = Field(
        default_factory=list,
        alias="executedActions",
    )

    image: ResourceImage | None = None

    is_saved_to_library: bool = Field(
        default=False,
        alias="isSavedToLibrary",
    )

    is_archived: bool = Field(
        default=False,
        alias="isArchived",
    )

    tags: list[str] = Field(default_factory=list)