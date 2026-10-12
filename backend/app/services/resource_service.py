from typing import Any

from app.repositories.contracts import ResourceRepository
from app.schemas.resources import ResourceCreate, ResourceRecord, ResourceUpdate


class ResourceService:
    """Business logic for screenshot resources."""

    def __init__(self, repository: ResourceRepository) -> None:
        self._repository = repository

    def create(
        self,
        owner_id: str,
        payload: ResourceCreate | dict[str, Any],
    ) -> ResourceRecord:
        self._validate_owner(owner_id)

        request = (
            payload
            if isinstance(payload, ResourceCreate)
            else ResourceCreate.model_validate(payload)
        )

        return self._repository.create(owner_id, request)

    def get_by_id(
        self,
        owner_id: str,
        resource_id: str,
    ) -> ResourceRecord | None:
        self._validate_owner(owner_id)
        self._validate_id(resource_id, "resource_id")

        return self._repository.get_by_id(owner_id, resource_id)

    def list_for_owner(
        self,
        owner_id: str,
        limit: int = 50,
        cursor: str | None = None,
    ) -> tuple[list[ResourceRecord], str | None]:
        self._validate_owner(owner_id)
        self._validate_limit(limit)

        return self._repository.list_for_owner(
            owner_id=owner_id,
            limit=limit,
            cursor=cursor,
        )

    def update(
        self,
        owner_id: str,
        resource_id: str,
        payload: ResourceUpdate | dict[str, Any],
    ) -> ResourceRecord | None:
        self._validate_owner(owner_id)
        self._validate_id(resource_id, "resource_id")

        patch = (
            payload
            if isinstance(payload, ResourceUpdate)
            else ResourceUpdate.model_validate(payload)
        )

        return self._repository.update(
            owner_id,
            resource_id,
            patch,
        )

    def delete(
        self,
        owner_id: str,
        resource_id: str,
    ) -> bool:
        self._validate_owner(owner_id)
        self._validate_id(resource_id, "resource_id")

        return self._repository.delete(owner_id, resource_id)

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