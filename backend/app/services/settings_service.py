from app.repositories.contracts import SettingsRepository
from app.schemas.settings import SettingsPatch, UserSettings


class SettingsService:
    """Business logic for user preferences."""

    def __init__(self, repository: SettingsRepository) -> None:
        self._repository = repository

    def get(self, owner_id: str) -> UserSettings:
        """Return saved settings or the application defaults."""
        self._validate_owner(owner_id)

        settings = self._repository.get(owner_id)

        if settings is None:
            return UserSettings()

        return settings

    def update(
        self,
        owner_id: str,
        patch: SettingsPatch | dict,
    ) -> UserSettings:
        """Merge a partial update and persist the complete settings."""
        self._validate_owner(owner_id)

        if not isinstance(patch, SettingsPatch):
            patch = SettingsPatch.model_validate(patch)

        current = self._repository.get(owner_id)

        if current is None:
            current = UserSettings()

        merged = current.model_dump(by_alias=True)
        changes = patch.model_dump(
            by_alias=True,
            exclude_unset=True,
        )
        merged.update(changes)

        updated = UserSettings.model_validate(merged)

        return self._repository.upsert(
            owner_id,
            updated,
        )

    @staticmethod
    def _validate_owner(owner_id: str) -> None:
        if not isinstance(owner_id, str) or not owner_id.strip():
            raise ValueError("A valid owner_id is required.")