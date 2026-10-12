from typing import Any

from app.domain import validate_reminder_status_transition
from app.errors import ResourceNotFound
from app.repositories.contracts import ReminderRepository, ResourceRepository
from app.schemas.reminders import ReminderCreate, ReminderRecord, ReminderUpdate


class ReminderService:
    """Business logic for scheduled reminders."""

    def __init__(
        self,
        reminder_repository: ReminderRepository,
        resource_repository: ResourceRepository,
    ) -> None:
        self._reminders = reminder_repository
        self._resources = resource_repository

    def create(
        self,
        owner_id: str,
        payload: ReminderCreate | dict[str, Any],
    ) -> ReminderRecord:
        self._validate_owner(owner_id)

        request = (
            payload
            if isinstance(payload, ReminderCreate)
            else ReminderCreate.model_validate(payload)
        )

        resource = self._resources.get_by_id(
            owner_id,
            request.resource_id,
        )

        if resource is None:
            raise ResourceNotFound(
                "The screenshot resource was not found."
            )

        return self._reminders.create(owner_id, request)

    def get_by_id(
        self,
        owner_id: str,
        reminder_id: str,
    ) -> ReminderRecord | None:
        self._validate_owner(owner_id)
        self._validate_id(reminder_id, "reminder_id")

        return self._reminders.get_by_id(
            owner_id,
            reminder_id,
        )

    def list_for_owner(
        self,
        owner_id: str,
        limit: int = 50,
        cursor: str | None = None,
    ) -> tuple[list[ReminderRecord], str | None]:
        self._validate_owner(owner_id)
        self._validate_limit(limit)

        return self._reminders.list_for_owner(
            owner_id=owner_id,
            limit=limit,
            cursor=cursor,
        )

    def update(
        self,
        owner_id: str,
        reminder_id: str,
        payload: ReminderUpdate | dict[str, Any],
    ) -> ReminderRecord | None:
        self._validate_owner(owner_id)
        self._validate_id(reminder_id, "reminder_id")

        patch = (
            payload
            if isinstance(payload, ReminderUpdate)
            else ReminderUpdate.model_validate(payload)
        )

        current = self._reminders.get_by_id(
            owner_id,
            reminder_id,
        )

        if current is None:
            return None

        if patch.status is not None:
            validate_reminder_status_transition(
                current.status,
                patch.status,
            )

        return self._reminders.update(
            owner_id,
            reminder_id,
            patch,
        )

    def delete(
        self,
        owner_id: str,
        reminder_id: str,
    ) -> bool:
        self._validate_owner(owner_id)
        self._validate_id(reminder_id, "reminder_id")

        return self._reminders.delete(owner_id, reminder_id)

    @staticmethod
    def _validate_owner(owner_id: str) -> None:
        if not isinstance(owner_id, str) or not owner_id.strip():
            raise ValueError("A valid owner_id is required.")

    @staticmethod
    def _validate_id(value: str, field_name: str) -> None:
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"A valid {field_name} is required.")

    @staticmethod
    def _validate_limit(limit: int) -> None:
        if isinstance(limit, bool) or not isinstance(limit, int):
            raise ValueError("limit must be an integer.")

        if not 1 <= limit <= 100:
            raise ValueError("limit must be between 1 and 100.")