from __future__ import annotations

import uuid

from flask import g


def request_id_before_request() -> None:
    """
    Generate a server-controlled correlation ID for each request.
    """
    g.request_id = f"req_{uuid.uuid4().hex}"


def get_request_id() -> str:
    """
    Return the current request ID.

    A fallback is provided for cases where there is no active
    Flask request context.
    """
    try:
        return getattr(g, "request_id", "req_unavailable")
    except RuntimeError:
        return "req_unavailable"