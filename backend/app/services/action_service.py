from typing import Any

from app.domain import validate_action_status_transition
from app.errors import ResourceNotFound
from app.repositories.contracts import ActionRepository, ResourceRepository
from app.schemas.actions import ActionCreate, ActionRecord, ActionUpdate


class ActionService:
    """Business logic for actions associated with screenshot resources."""

    def __init__(
        self,
        action_repository: ActionRepository,
        resource_repository: ResourceRepository,
    ) -> None:
        self._actions = action_repository
        self._resources = resource_repository

    def create(
        self,
        owner_id: str,
        payload: ActionCreate | dict[str, Any],
    ) -> ActionRecord:
        self._validate_owner(owner_id)

        request = (
            payload
            if isinstance(payload, ActionCreate)
            else ActionCreate.model_validate(payload)
        )

        resource = self._resources.get_by_id(
            owner_id,
            request.screenshot_id,
        )

        if resource is None:
            raise ResourceNotFound(
                "The screenshot resource was not found."
            )

        return self._actions.create(owner_id, request)

    def get_by_id(
        self,
        owner_id: str,
        action_record_id: str,
    ) -> ActionRecord | None:
        self._validate_owner(owner_id)
        self._validate_id(action_record_id, "action_record_id")

        return self._actions.get_by_id(
            owner_id,
            action_record_id,
        )

    def list_for_resource(
        self,
        owner_id: str,
        screenshot_id: str,
        limit: int = 50,
        cursor: str | None = None,
    ) -> tuple[list[ActionRecord], str | None]:
        self._validate_owner(owner_id)
        self._validate_id(screenshot_id, "screenshot_id")
        self._validate_limit(limit)

        resource = self._resources.get_by_id(
            owner_id,
            screenshot_id,
        )

        if resource is None:
            raise ResourceNotFound(
                "The screenshot resource was not found."
            )

        return self._actions.list_for_resource(
            owner_id=owner_id,
            screenshot_id=screenshot_id,
            limit=limit,
            cursor=cursor,
        )

    def update(
        self,
        owner_id: str,
        action_record_id: str,
        payload: ActionUpdate | dict[str, Any],
    ) -> ActionRecord | None:
        self._validate_owner(owner_id)
        self._validate_id(action_record_id, "action_record_id")

        patch = (
            payload
            if isinstance(payload, ActionUpdate)
            else ActionUpdate.model_validate(payload)
        )

        current = self._actions.get_by_id(
            owner_id,
            action_record_id,
        )

        if current is None:
            return None

        if patch.status is not None:
            validate_action_status_transition(
                current.status,
                patch.status,
            )

        return self._actions.update(
            owner_id,
            action_record_id,
            patch,
        )

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