from typing import Optional, Literal

from pydantic import ConfigDict, Field, model_validator

from app.schemas.analysis import APIModel


class UserSettings(APIModel):
    """User preferences used by the SnapAction frontend."""

    auto_detect_actions: bool = Field(
        default=True,
        alias="autoDetectActions",
    )

    require_confirmation: str = Field(
        default="high_impact_only",
        alias="requireConfirmation",
    )

    default_reminder_offset: str = Field(
        default="1h",
        alias="defaultReminderOffset",
    )

    default_calendar: Literal["google", "apple", "ics"] = Field(
        default="google",
        alias="defaultCalendar",
    )

    store_screenshots_locally: bool = Field(
        default=True,
        alias="storeScreenshotsLocally",
    )

    cloud_sync: bool = Field(
        default=False,
        alias="cloudSync",
    )

    haptic_feedback: bool = Field(
        default=True,
        alias="hapticFeedback",
    )

    theme: str = "dark"

    device_frame: str = Field(
        default="mobile",
        alias="deviceFrame",
    )


class SettingsPatch(APIModel):
    """Partial update to user settings."""

    model_config = ConfigDict(
        extra="forbid",
        populate_by_name=True,
        str_strip_whitespace=True,
    )

    auto_detect_actions: Optional[bool] = Field(
        default=None,
        alias="autoDetectActions",
    )

    require_confirmation: Optional[str] = Field(
        default=None,
        alias="requireConfirmation",
    )

    default_reminder_offset: Optional[str] = Field(
        default=None,
        alias="defaultReminderOffset",
    )

    default_calendar: Optional[Literal["google", "apple", "ics"]] = Field(
        default=None,
        alias="defaultCalendar",
    )

    store_screenshots_locally: Optional[bool] = Field(
        default=None,
        alias="storeScreenshotsLocally",
    )

    cloud_sync: Optional[bool] = Field(
        default=None,
        alias="cloudSync",
    )

    haptic_feedback: Optional[bool] = Field(
        default=None,
        alias="hapticFeedback",
    )

    theme: Optional[str] = None

    device_frame: Optional[str] = Field(
        default=None,
        alias="deviceFrame",
    )

    @model_validator(mode="after")
    def validate_patch(self):
        if not self.model_fields_set:
            raise ValueError(
                "At least one settings field must be provided."
            )

        for field_name in self.model_fields_set:
            if getattr(self, field_name) is None:
                raise ValueError(
                    f"'{field_name}' cannot be null."
                )

        return self