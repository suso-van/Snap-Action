from typing import Protocol

from app.schemas.actions import (
    ActionCreate,
    ActionRecord,
    ActionUpdate,
)
from app.schemas.reminders import (
    ReminderCreate,
    ReminderRecord,
    ReminderUpdate,
)
from app.schemas.resources import (
    ResourceCreate,
    ResourceRecord,
    ResourceUpdate,
)
from app.schemas.settings import UserSettings


class ResourceRepository(Protocol):
    """Persistence contract for screenshot resources."""

    def create(
        self,
        owner_id: str,
        payload: ResourceCreate,
    ) -> ResourceRecord:
        ...

    def get_by_id(
        self,
        owner_id: str,
        resource_id: str,
    ) -> ResourceRecord | None:
        ...

    def list_for_owner(
        self,
        owner_id: str,
        limit: int = 50,
        cursor: str | None = None,
    ) -> tuple[list[ResourceRecord], str | None]:
        ...

    def update(
        self,
        owner_id: str,
        resource_id: str,
        patch: ResourceUpdate,
    ) -> ResourceRecord | None:
        ...

    def delete(
        self,
        owner_id: str,
        resource_id: str,
    ) -> bool:
        ...


class ActionRepository(Protocol):
    """Persistence contract for executed or pending actions."""

    def create(
        self,
        owner_id: str,
        payload: ActionCreate,
    ) -> ActionRecord:
        ...

    def get_by_id(
        self,
        owner_id: str,
        action_record_id: str,
    ) -> ActionRecord | None:
        ...

    def list_for_resource(
        self,
        owner_id: str,
        screenshot_id: str,
        limit: int = 50,
        cursor: str | None = None,
    ) -> tuple[list[ActionRecord], str | None]:
        ...

    def update(
        self,
        owner_id: str,
        action_record_id: str,
        patch: ActionUpdate,
    ) -> ActionRecord | None:
        ...


class ReminderRepository(Protocol):
    """Persistence contract for scheduled reminders."""

    def create(
        self,
        owner_id: str,
        payload: ReminderCreate,
    ) -> ReminderRecord:
        ...

    def get_by_id(
        self,
        owner_id: str,
        reminder_id: str,
    ) -> ReminderRecord | None:
        ...

    def list_for_owner(
        self,
        owner_id: str,
        limit: int = 50,
        cursor: str | None = None,
    ) -> tuple[list[ReminderRecord], str | None]:
        ...

    def update(
        self,
        owner_id: str,
        reminder_id: str,
        patch: ReminderUpdate,
    ) -> ReminderRecord | None:
        ...

    def delete(
        self,
        owner_id: str,
        reminder_id: str,
    ) -> bool:
        ...


class SettingsRepository(Protocol):
    """Persistence contract for per-user settings."""

    def get(
        self,
        owner_id: str,
    ) -> UserSettings | None:
        ...

    def upsert(
        self,
        owner_id: str,
        settings: UserSettings,
    ) -> UserSettings:
        ...