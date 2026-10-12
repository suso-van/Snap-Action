from __future__ import annotations


class AppError(Exception):
    """
    Base exception for expected application errors.
    """

    def __init__(
        self,
        code: str,
        message: str,
        status_code: int = 400,
    ) -> None:
        super().__init__(message)

        self.code = code
        self.message = message
        self.status_code = status_code


class InvalidRequest(AppError):
    def __init__(
        self,
        message: str = "The request is invalid.",
    ) -> None:
        super().__init__(
            code="INVALID_REQUEST",
            message=message,
            status_code=400,
        )


class ResourceNotFound(AppError):
    def __init__(
        self,
        message: str = "The requested resource was not found.",
    ) -> None:
        super().__init__(
            code="RESOURCE_NOT_FOUND",
            message=message,
            status_code=404,
        )


class Unauthorized(AppError):
    def __init__(
        self,
        message: str = "Authentication is required.",
    ) -> None:
        super().__init__(
            code="UNAUTHORIZED",
            message=message,
            status_code=401,
        )


class Forbidden(AppError):
    def __init__(
        self,
        message: str = "You are not allowed to perform this action.",
    ) -> None:
        super().__init__(
            code="FORBIDDEN",
            message=message,
            status_code=403,
        )


class PayloadTooLarge(AppError):
    def __init__(
        self,
        message: str = "The uploaded content exceeds the permitted size.",
    ) -> None:
        super().__init__(
            code="PAYLOAD_TOO_LARGE",
            message=message,
            status_code=413,
        )


class AIProviderUnavailable(AppError):
    def __init__(
        self,
        message: str = (
            "The AI provider is not configured "
            "or is temporarily unavailable."
        ),
    ) -> None:
        super().__init__(
            code="AI_PROVIDER_UNAVAILABLE",
            message=message,
            status_code=503,
        )


class AnalysisFailed(AppError):
    def __init__(
        self,
        message: str = (
            "The screenshot could not be analyzed. Please try again."
        ),
    ) -> None:
        super().__init__(
            code="ANALYSIS_FAILED",
            message=message,
            status_code=422,
        )