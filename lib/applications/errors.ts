export class ApplicationError extends Error {
  constructor(
    message: string,
    readonly status = 400,
    readonly code = "APPLICATION_ERROR",
  ) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class DuplicateApplicationError extends ApplicationError {
  constructor(message = "An open application with this email already exists for this intake.") {
    super(message, 409, "DUPLICATE_APPLICATION");
    this.name = "DuplicateApplicationError";
  }
}

export class ApplicationNotFoundError extends ApplicationError {
  constructor(message = "Application not found.") {
    super(message, 404, "APPLICATION_NOT_FOUND");
    this.name = "ApplicationNotFoundError";
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized.") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ApplicationStorageError extends ApplicationError {
  constructor(message = "Application storage is not available.") {
    super(message, 503, "APPLICATION_STORAGE");
    this.name = "ApplicationStorageError";
  }
}

export function toApplicationHttpError(error: unknown) {
  if (error instanceof ApplicationError) {
    return { status: error.status, error: error.message, code: error.code };
  }
  const message = error instanceof Error ? error.message : "";
  const status = message.includes("not configured") || message.includes("POSTGRES_URL") ? 503 : 500;
  return {
    status,
    error: status === 503 ? "Application storage is not available." : "Unexpected application error.",
    code: "APPLICATION_ERROR",
  };
}
