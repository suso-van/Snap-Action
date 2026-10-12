import pytest

from app.services.settings_service import SettingsService
from app.schemas.settings import UserSettings


class FakeSettingsRepository:
    def __init__(self, settings=None):
        self.settings = settings
        self.get_calls = []
        self.upsert_calls = []

    def get(self, owner_id):
        self.get_calls.append(owner_id)
        return self.settings

    def upsert(self, owner_id, settings):
        self.upsert_calls.append((owner_id, settings))
        self.settings = settings
        return settings


def test_get_returns_defaults_when_no_settings_exist():
    repository = FakeSettingsRepository()
    service = SettingsService(repository)

    settings = service.get("user-1")

    assert settings.auto_detect_actions is True
    assert settings.cloud_sync is False
    assert settings.theme == "dark"
    assert repository.get_calls == ["user-1"]


def test_get_returns_saved_settings():
    saved = UserSettings(theme="light", cloudSync=True)
    repository = FakeSettingsRepository(saved)
    service = SettingsService(repository)

    settings = service.get("user-1")

    assert settings.theme == "light"
    assert settings.cloud_sync is True


def test_update_changes_only_supplied_fields():
    repository = FakeSettingsRepository(
        UserSettings(theme="dark", cloudSync=False)
    )
    service = SettingsService(repository)

    settings = service.update(
        "user-1",
        {"theme": "light"},
    )

    assert settings.theme == "light"
    assert settings.cloud_sync is False
    assert settings.auto_detect_actions is True


def test_update_persists_complete_settings():
    repository = FakeSettingsRepository()
    service = SettingsService(repository)

    settings = service.update(
        "user-1",
        {
            "autoDetectActions": False,
            "defaultCalendar": "ics",
        },
    )

    assert settings.auto_detect_actions is False
    assert settings.default_calendar == "ics"
    assert len(repository.upsert_calls) == 1

    owner_id, persisted = repository.upsert_calls[0]
    assert owner_id == "user-1"
    assert persisted == settings


def test_update_preserves_false_values():
    repository = FakeSettingsRepository()
    service = SettingsService(repository)

    settings = service.update(
        "user-1",
        {
            "cloudSync": False,
            "hapticFeedback": False,
        },
    )

    assert settings.cloud_sync is False
    assert settings.haptic_feedback is False


def test_update_rejects_empty_patch():
    repository = FakeSettingsRepository()
    service = SettingsService(repository)

    with pytest.raises(ValueError):
        service.update("user-1", {})

    assert repository.upsert_calls == []


def test_update_rejects_invalid_calendar():
    repository = FakeSettingsRepository()
    service = SettingsService(repository)

    with pytest.raises(ValueError):
        service.update(
            "user-1",
            {"defaultCalendar": "invalid"},
        )

    assert repository.upsert_calls == []


def test_service_rejects_empty_owner_id():
    repository = FakeSettingsRepository()
    service = SettingsService(repository)

    with pytest.raises(ValueError):
        service.get("")

    assert repository.get_calls == []