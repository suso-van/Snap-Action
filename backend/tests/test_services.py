import pytest
from types import SimpleNamespace

from app.domain import InvalidStateTransition
from app.errors import ResourceNotFound
from app.services.action_service import ActionService
from app.services.reminder_service import ReminderService
from app.services.resource_service import ResourceService


class FakeResourceRepository:
    def __init__(self, resource=None):
        self.resource = resource
        self.list_calls = []
        self.delete_calls = []

    def get_by_id(self, owner_id, resource_id):
        return self.resource

    def list_for_owner(
        self,
        owner_id,
        limit=50,
        cursor=None,
    ):
        self.list_calls.append(
            (owner_id, limit, cursor)
        )
        return [], None

    def delete(self, owner_id, resource_id):
        self.delete_calls.append(
            (owner_id, resource_id)
        )
        return True


class FakeActionRepository:
    def __init__(self, current_action=None):
        self.current_action = current_action
        self.create_calls = []
        self.update_calls = []

    def create(self, owner_id, payload):
        self.create_calls.append((owner_id, payload))
        return payload

    def get_by_id(self, owner_id, action_record_id):
        return self.current_action

    def update(self, owner_id, action_record_id, patch):
        self.update_calls.append(
            (owner_id, action_record_id, patch)
        )
        return self.current_action


class FakeReminderRepository:
    def __init__(self, current_reminder=None):
        self.current_reminder = current_reminder
        self.create_calls = []
        self.update_calls = []

    def create(self, owner_id, payload):
        self.create_calls.append((owner_id, payload))
        return payload

    def get_by_id(self, owner_id, reminder_id):
        return self.current_reminder

    def update(self, owner_id, reminder_id, patch):
        self.update_calls.append(
            (owner_id, reminder_id, patch)
        )
        return self.current_reminder


def test_resource_list_rejects_limit_above_100():
    repository = FakeResourceRepository()
    service = ResourceService(repository)

    with pytest.raises(ValueError):
        service.list_for_owner("user-1", limit=101)

    assert repository.list_calls == []


def test_resource_delete_passes_owner_and_resource_ids():
    repository = FakeResourceRepository()
    service = ResourceService(repository)

    result = service.delete("user-1", "resource-1")

    assert result is True
    assert repository.delete_calls == [
        ("user-1", "resource-1")
    ]


def test_action_creation_requires_existing_resource():
    resource_repository = FakeResourceRepository(
        resource=None
    )
    action_repository = FakeActionRepository()

    service = ActionService(
        action_repository,
        resource_repository,
    )

    with pytest.raises(ResourceNotFound):
        service.create(
            "user-1",
            {
                "screenshotId": "resource-1",
                "actionId": "action-1",
            },
        )

    assert action_repository.create_calls == []


def test_completed_action_cannot_be_reactivated():
    resource_repository = FakeResourceRepository()
    action_repository = FakeActionRepository(
        current_action=SimpleNamespace(
            status="completed"
        )
    )

    service = ActionService(
        action_repository,
        resource_repository,
    )

    with pytest.raises(InvalidStateTransition):
        service.update(
            "user-1",
            "action-record-1",
            {"status": "active"},
        )

    assert action_repository.update_calls == []


def test_reminder_creation_requires_existing_resource():
    resource_repository = FakeResourceRepository(
        resource=None
    )
    reminder_repository = FakeReminderRepository()

    service = ReminderService(
        reminder_repository,
        resource_repository,
    )

    with pytest.raises(ResourceNotFound):
        service.create(
            "user-1",
            {
                "resourceId": "missing-resource",
                "title": "Test reminder",
                "scheduledAt": "2026-11-01T10:00:00+05:30",
                "timeZone": "Asia/Kolkata",
            },
        )

    assert reminder_repository.create_calls == []


def test_cancelled_reminder_cannot_be_reactivated():
    resource_repository = FakeResourceRepository()
    reminder_repository = FakeReminderRepository(
        current_reminder=SimpleNamespace(
            status="cancelled"
        )
    )

    service = ReminderService(
        reminder_repository,
        resource_repository,
    )

    with pytest.raises(InvalidStateTransition):
        service.update(
            "user-1",
            "reminder-1",
            {"status": "active"},
        )

    assert reminder_repository.update_calls == []
