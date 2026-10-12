from typing import Final


class InvalidStateTransition(ValueError):
    """Raised when an entity cannot move to the requested status."""


ACTION_TRANSITIONS: Final[dict[str, frozenset[str]]] = {
    "active": frozenset({"completed", "snoozed"}),
    "snoozed": frozenset({"active", "completed"}),
    "completed": frozenset(),
}

REMINDER_TRANSITIONS: Final[dict[str, frozenset[str]]] = {
    "active": frozenset({"completed", "snoozed", "cancelled"}),
    "snoozed": frozenset({"active", "completed", "cancelled"}),
    "completed": frozenset(),
    "cancelled": frozenset(),
}


def _validate_transition(
    current_status: str,
    new_status: str,
    *,
    entity_name: str,
    transitions: dict[str, frozenset[str]],
) -> None:
    """Validate a status change without modifying the entity."""

    if not isinstance(current_status, str) or not isinstance(new_status, str):
        raise InvalidStateTransition(
            f"{entity_name} statuses must be strings."
        )

    current = current_status.strip().lower()
    target = new_status.strip().lower()

    if current not in transitions:
        raise InvalidStateTransition(
            f"Unknown current {entity_name} status: '{current}'."
        )

    if target not in transitions:
        raise InvalidStateTransition(
            f"Unknown target {entity_name} status: '{target}'."
        )

    # Repeating the current status is an idempotent operation.
    if current == target:
        return

    if target not in transitions[current]:
        raise InvalidStateTransition(
            f"{entity_name} cannot transition from "
            f"'{current}' to '{target}'."
        )


def validate_action_status_transition(
    current_status: str,
    new_status: str,
) -> None:
    """Validate an action status change."""

    _validate_transition(
        current_status,
        new_status,
        entity_name="Action",
        transitions=ACTION_TRANSITIONS,
    )


def validate_reminder_status_transition(
    current_status: str,
    new_status: str,
) -> None:
    """Validate a reminder status change."""

    _validate_transition(
        current_status,
        new_status,
        entity_name="Reminder",
        transitions=REMINDER_TRANSITIONS,
    )