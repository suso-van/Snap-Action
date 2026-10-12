from flask import current_app, has_app_context
from supabase import Client, create_client
from supabase.client import ClientOptions


class SupabaseConfigurationError(RuntimeError):
    """Raised when Supabase configuration is missing or invalid."""


def _get_settings() -> tuple[str, str]:
    """Retrieve the Supabase URL and publishable key from Flask config."""

    if not has_app_context():
        raise RuntimeError(
            "Supabase client creation requires a Flask application context."
        )

    url = str(
        current_app.config.get("SUPABASE_URL", "")
    ).strip().rstrip("/")

    key = str(
        current_app.config.get("SUPABASE_PUBLISHABLE_KEY", "")
    ).strip()

    if not url:
        raise SupabaseConfigurationError(
            "SUPABASE_URL is not configured."
        )

    if not key:
        raise SupabaseConfigurationError(
            "SUPABASE_PUBLISHABLE_KEY is not configured."
        )

    return url, key


def create_supabase_auth_client() -> Client:
    """
    Create a Supabase client for authentication operations.

    Uses the publishable key and does not persist or automatically
    refresh a user session.
    """

    url, key = _get_settings()

    options = ClientOptions(
        auto_refresh_token=False,
        persist_session=False,
        postgrest_client_timeout=10,
        storage_client_timeout=10,
    )

    return create_client(
        supabase_url=url,
        supabase_key=key,
        options=options,
    )


def create_supabase_user_client(access_token: str) -> Client:
    """
    Create a client that sends a user's access token with requests.

    The caller must verify the token before using this client.
    This function does not itself authenticate or verify the user.
    """

    if not isinstance(access_token, str) or not access_token.strip():
        raise ValueError("A valid user access token is required.")

    url, key = _get_settings()

    options = ClientOptions(
        auto_refresh_token=False,
        persist_session=False,
        postgrest_client_timeout=10,
        storage_client_timeout=10,
        headers={
            "Authorization": f"Bearer {access_token.strip()}",
        },
    )

    return create_client(
        supabase_url=url,
        supabase_key=key,
        options=options,
    )