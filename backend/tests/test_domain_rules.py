import pytest

from app.domain import (
    InvalidStateTransition,
    validate_action_status_transition,
    validate_reminder_status_transition,
)


@pytest.mark.parametrize(
    ("current", "target"),
    [
        ("active", "completed"),
        ("active", "snoozed"),
        ("snoozed", "active"),
        ("snoozed", "completed"),
        ("active", "active"),
    ],
)
def test_valid_action_transitions(current, target):
    validate_action_status_transition(current, target)


@pytest.mark.parametrize(
    ("current", "target"),
    [
        ("completed", "active"),
        ("completed", "snoozed"),
        ("active", "unknown"),
        ("unknown", "active"),
    ],
)
def test_invalid_action_transitions(current, target):
    with pytest.raises(InvalidStateTransition):
        validate_action_status_transition(current, target)


@pytest.mark.parametrize(
    ("current", "target"),
    [
        ("active", "completed"),
        ("active", "snoozed"),
        ("active", "cancelled"),
        ("snoozed", "active"),
        ("snoozed", "cancelled"),
        ("completed", "completed"),
        ("cancelled", "cancelled"),
    ],
)
def test_valid_reminder_transitions(current, target):
    validate_reminder_status_transition(current, target)


@pytest.mark.parametrize(
    ("current", "target"),
    [
        ("completed", "active"),
        ("cancelled", "active"),
        ("active", "unknown"),
        ("unknown", "active"),
    ],
)
def test_invalid_reminder_transitions(current, target):
    with pytest.raises(InvalidStateTransition):
        validate_reminder_status_transition(current, target)


def test_status_comparison_ignores_surrounding_whitespace():
    validate_action_status_transition(" active ", "snoozed")


def test_status_comparison_is_case_insensitive():
    validate_reminder_status_transition("ACTIVE", "CANCELLED")


def test_non_string_status_is_rejected():
    with pytest.raises(InvalidStateTransition):
        validate_action_status_transition(None, "completed")
        