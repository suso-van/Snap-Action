from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import Field, ConfigDict, model_validator

from app.schemas.analysis import APIModel, Category


ActionStatus = Literal[
    "active",
    "completed",
    "snoozed",
]


class ActionCreate(APIModel):
    """
    Request to record an action associated with a resource.

    This records application state; it does not itself execute
    calendar, payment, tracking, or device operations.
    """

    screenshot_id: str = Field(
        alias="screenshotId",
        min_length=1,
        max_length=200,
    )

    action_id: str = Field(
        alias="actionId",
        min_length=1,
        max_length=160,
    )

    status: ActionStatus = "active"

    category: Category | None = None

    details: dict = Field(
        default_factory=dict,
    )

    tracking_info: dict | None = Field(
        default=None,
        alias="trackingInfo",
    )


class ActionUpdate(APIModel):
    """Partial update for an existing action record."""

    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
        str_strip_whitespace=True,
    )

    status: ActionStatus | None = None

    @model_validator(mode="after")
    def validate_patch(self):
        if "status" not in self.model_fields_set:
            raise ValueError(
                "Provide a status to update."
            )

        if self.status is None:
            raise ValueError(
                "Status cannot be null."
            )

        return self


class ActionRecord(APIModel):
    """Server representation of a recorded action."""

    id: str = Field(min_length=1)

    screenshot_id: str = Field(alias="screenshotId")
    action_id: str = Field(alias="actionId")

    executed_at: int = Field(
        alias="executedAt",
        ge=0,
        description="Execution timestamp in epoch milliseconds.",
    )

    status: ActionStatus

    category: Category | None = None

    details: dict = Field(
        default_factory=dict,
    )

    tracking_info: dict | None = Field(
        default=None,
        alias="trackingInfo",
    )

    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
    