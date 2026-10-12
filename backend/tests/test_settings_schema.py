import pytest
from pydantic import ValidationError

from app.schemas import SettingsPatch, UserSettings


def test_user_settings_defaults():
    settings = UserSettings()

    result = settings.model_dump(by_alias=True)

    assert result["autoDetectActions"] is True
    assert result["requireConfirmation"] == "high_impact_only"
    assert result["defaultReminderOffset"] == "1h"
    assert result["defaultCalendar"] == "google"
    assert result["storeScreenshotsLocally"] is True
    assert result["cloudSync"] is False
    assert result["hapticFeedback"] is True
    assert result["theme"] == "dark"
    assert result["deviceFrame"] == "mobile"


def test_settings_patch_uses_camel_case():
    patch = SettingsPatch(
        autoDetectActions=False,
        theme="light",
    )

    result = patch.model_dump(
        by_alias=True,
        exclude_unset=True,
    )

    assert result == {
        "autoDetectActions": False,
        "theme": "light",
    }


def test_empty_settings_patch_is_rejected():
    with pytest.raises(ValidationError):
        SettingsPatch()


def test_null_settings_value_is_rejected():
    with pytest.raises(ValidationError):
        SettingsPatch(theme=None)


def test_unknown_settings_field_is_rejected():
    with pytest.raises(ValidationError):
        SettingsPatch(unknownSetting=True)


def test_settings_patch_accepts_false_values():
    patch = SettingsPatch(
        autoDetectActions=False,
        cloudSync=False,
    )

    result = patch.model_dump(
        by_alias=True,
        exclude_unset=True,
    )

    assert result["autoDetectActions"] is False
    assert result["cloudSync"] is False