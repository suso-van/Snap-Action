from __future__ import annotations

from datetime import datetime
from typing import Literal
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import Field, ConfigDict, field_validator, model_validator

from app.schemas.analysis import APIModel


ReminderStatus = Literal[
    "active",
    "completed",
    "snoozed",
    "cancelled",
]


class ReminderCreate(APIModel):
    """Request to create a reminder linked to a resource."""

    resource_id: str = Field(
        alias="resourceId",
        min_length=1,
        max_length=200,
    )

    title: str = Field(
        min_length=1,
        max_length=240,
    )

    scheduled_at: datetime = Field(
        alias="scheduledAt",
    )

    time_zone: str = Field(
        alias="timeZone",
        min_length=1,
        max_length=100,
    )

    notification_preference: str = Field(
        default="default",
        alias="notificationPreference",
        max_length=50,
    )

    @field_validator("scheduled_at")
    @classmethod
    def require_timezone_aware_datetime(cls, value):
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError(
                "scheduledAt must include a timezone offset."
            )

        return value

    @field_validator("time_zone")
    @classmethod
    def validate_timezone(cls, value: str) -> str:
        try:
            ZoneInfo(value)
        except (ZoneInfoNotFoundError, ValueError):
            raise ValueError(
                "timeZone must be a valid IANA timezone."
            ) from None

        return value


class ReminderUpdate(APIModel):
    """Partial update for an existing reminder."""

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

    scheduled_at: datetime | None = Field(
        default=None,
        alias="scheduledAt",
    )

    time_zone: str | None = Field(
        default=None,
        alias="timeZone",
        min_length=1,
        max_length=100,
    )

    notification_preference: str | None = Field(
        default=None,
        alias="notificationPreference",
        max_length=50,
    )

    status: ReminderStatus | None = None

    @model_validator(mode="after")
    def validate_patch(self):
        if not self.model_fields_set:
            raise ValueError(
                "Provide at least one field to update."
            )

        if (
            "scheduled_at" in self.model_fields_set
            and self.scheduled_at is not None
            and (
                self.scheduled_at.tzinfo is None
                or self.scheduled_at.utcoffset() is None
            )
        ):
            raise ValueError(
                "scheduledAt must include a timezone offset."
            )

        if "time_zone" in self.model_fields_set:
            if self.time_zone is None:
                raise ValueError("timeZone cannot be null.")

            try:
                ZoneInfo(self.time_zone)
            except (ZoneInfoNotFoundError, ValueError):
                raise ValueError(
                    "timeZone must be a valid IANA timezone."
                ) from None

        return self


class ReminderRecord(APIModel):
    """Server representation of a reminder."""

    id: str = Field(min_length=1)

    resource_id: str = Field(alias="resourceId")

    title: str

    scheduled_at: datetime = Field(alias="scheduledAt")

    time_zone: str = Field(alias="timeZone")

    notification_preference: str = Field(
        alias="notificationPreference",
    )

    status: ReminderStatus

    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")