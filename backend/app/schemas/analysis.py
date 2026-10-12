from __future__ import annotations

from typing import Any, Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)


Category = Literal[
    "ticket",
    "travel",
    "payment",
    "receipt",
    "package",
    "address",
    "task",
    "event",
    "contact",
    "link",
    "github",
    "document",
    "other",
    "unclear",
    "none",
]

EntityType = Literal[
    "text",
    "datetime",
    "currency",
    "location",
    "tracking",
    "phone",
    "email",
    "url",
    "status",
    "code",
    "badge",
]

ActionType = Literal[
    "calendar",
    "reminder",
    "map",
    "pay",
    "track",
    "task",
    "copy",
    "share",
    "call",
    "email",
    "contact",
    "open_link",
    "open_github",
]


class APIModel(BaseModel):
    """
    Common configuration for external API models.

    Python attributes use snake_case.
    JSON responses use the frontend's camelCase names
    when serialized with model_dump(by_alias=True).
    """

    model_config = ConfigDict(
        populate_by_name=True,
        extra="ignore",
        str_strip_whitespace=True,
    )


class AnalysisRequest(APIModel):
    image_base64: str = Field(
        alias="imageBase64",
        min_length=1,
    )

    mime_type: str | None = Field(
        default=None,
        alias="mimeType",
        max_length=100,
    )

    filename: str | None = Field(
        default=None,
        max_length=255,
    )

    @field_validator("image_base64")
    @classmethod
    def image_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError(
                "imageBase64 cannot be blank."
            )

        return value


class ExtractedEntity(APIModel):
    key: str = Field(
        min_length=1,
        max_length=120,
    )

    label: str = Field(
        min_length=1,
        max_length=200,
    )

    value: str = Field(
        max_length=10000,
    )

    type: EntityType | None = None

    is_editable: bool = Field(
        default=True,
        alias="isEditable",
    )

    provenance: Literal[
        "extracted",
        "inferred",
        "verified",
    ] = "extracted"

    confidence: float | None = Field(
        default=None,
        ge=0,
        le=1,
    )

    bounding_box: (
        tuple[float, float, float, float] | None
    ) = Field(
        default=None,
        alias="boundingBox",
    )

    is_warning: bool | None = Field(
        default=None,
        alias="isWarning",
    )

    warning_message: str | None = Field(
        default=None,
        alias="warningMessage",
        max_length=1000,
    )

    @field_validator("bounding_box")
    @classmethod
    def validate_bounding_box(cls, value):
        if value is None:
            return value

        ymin, xmin, ymax, xmax = value

        if any(number < 0 or number > 1000 for number in value):
            raise ValueError(
                "Bounding box coordinates must be between 0 and 1000."
            )

        if ymin > ymax or xmin > xmax:
            raise ValueError(
                "Bounding box minimum coordinates cannot exceed maximum coordinates."
            )

        return value


class SuggestedAction(APIModel):
    id: str = Field(
        min_length=1,
        max_length=160,
    )

    title: str = Field(
        min_length=1,
        max_length=200,
    )

    subtitle: str | None = Field(
        default=None,
        max_length=500,
    )

    action_type: ActionType = Field(
        alias="actionType",
    )

    risk_level: Literal["low", "high"] | None = Field(
        default=None,
        alias="riskLevel",
    )

    is_primary: bool | None = Field(
        default=None,
        alias="isPrimary",
    )

    icon_name: str | None = Field(
        default=None,
        alias="iconName",
        max_length=100,
    )

    details: dict[str, Any] = Field(
        default_factory=dict,
    )


class BoundingBoxLabel(APIModel):
    label: str = Field(
        min_length=1,
        max_length=200,
    )

    box: tuple[float, float, float, float]

    @field_validator("box")
    @classmethod
    def validate_box(cls, value):
        ymin, xmin, ymax, xmax = value

        if any(number < 0 or number > 1000 for number in value):
            raise ValueError(
                "Bounding box coordinates must be between 0 and 1000."
            )

        if ymin > ymax or xmin > xmax:
            raise ValueError(
                "Bounding box minimum coordinates cannot exceed maximum coordinates."
            )

        return value


class AnalysisResult(APIModel):
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
        default_factory=list,
        alias="extractedEntities",
        max_length=200,
    )

    suggested_actions: list[SuggestedAction] = Field(
        default_factory=list,
        alias="suggestedActions",
        max_length=50,
    )

    ocr_text: str | None = Field(
        default=None,
        alias="ocrText",
        max_length=100000,
    )

    bounding_boxes: list[BoundingBoxLabel] | None = Field(
        default=None,
        alias="boundingBoxes",
        max_length=200,
    )


class AskScreenshotRequest(APIModel):
    question: str = Field(
        min_length=1,
        max_length=2000,
    )

    screenshot_data: dict[str, Any] = Field(
        default_factory=dict,
        alias="screenshotData",
    )

    image_base64: str | None = Field(
        default=None,
        alias="imageBase64",
    )

    mime_type: str | None = Field(
        default=None,
        alias="mimeType",
        max_length=100,
    )

    @field_validator("question")
    @classmethod
    def question_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError(
                "question cannot be blank."
            )

        return value
class AskScreenshotResponse(APIModel):
    answer: str = Field(
        min_length=1,
        max_length=10000,
    )

    suggested_followups: list[str] = Field(
        default_factory=list,
        alias="suggestedFollowups",
        max_length=10,
    )