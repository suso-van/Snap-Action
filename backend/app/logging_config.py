from __future__ import annotations

import logging

from flask import Flask


def configure_logging(app: Flask) -> None:
    """
    Configure application logging.

    Do not log screenshots, API keys, authorization headers,
    or other sensitive request data.
    """
    level_name = str(
        app.config.get("LOG_LEVEL", "INFO")
    ).upper()

    level = getattr(
        logging,
        level_name,
        logging.INFO,
    )

    handler = logging.StreamHandler()

    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s %(levelname)s "
            "%(name)s %(message)s"
        )
    )

    app.logger.handlers.clear()
    app.logger.addHandler(handler)
    app.logger.setLevel(level)
    app.logger.propagate = False