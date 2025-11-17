import { Data } from "effect";
import type { ErrorMetadata } from "../base.error";
import { HTTP_STATUS } from "../../constants";

/**
 * Thrown when user credentials are invalid.
 * HTTP Status: 401 (Unauthorized)
 */
export class InvalidCredentialsError extends Data.TaggedError(
  "InvalidCredentials"
)<{
  message: string;
  attemptedEmail?: string;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    httpStatus: HTTP_STATUS.UNAUTHORIZED,
    userMessage: "Invalid email or password.",
    context: {
      ...this.context,
    },
  };
}

/**
 * Thrown when user is not authenticated but an authenticated endpoint is accessed.
 * HTTP Status: 401 (Unauthorized)
 */
export class UnauthorizedError extends Data.TaggedError("Unauthorized")<{
  message: string;
  reason?: string; // e.g., "NO_TOKEN", "TOKEN_EXPIRED", "USER_NOT_FOUND"
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    httpStatus: HTTP_STATUS.UNAUTHORIZED,
    userMessage: "You must be logged in to access this resource.",
    context: {
      reason: this.reason,
      ...this.context,
    },
  };
}

/**
 * Thrown when user is authenticated but lacks permission for an action.
 * HTTP Status: 403 (Forbidden)
 */
export class ForbiddenError extends Data.TaggedError("Forbidden")<{
  message: string;
  requiredRole?: string;
  requiredPermission?: string;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    httpStatus: HTTP_STATUS.FORBIDDEN,
    userMessage: "You don't have permission to perform this action.",
    context: {
      requiredRole: this.requiredRole,
      requiredPermission: this.requiredPermission,
      ...this.context,
    },
  };
}

/**
 * Thrown when a JWT token has expired.
 * HTTP Status: 401 (Unauthorized)
 */
export class TokenExpiredError extends Data.TaggedError("TokenExpired")<{
  message: string;
  tokenType: "access" | "refresh"; // e.g., "access", "refresh"
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    httpStatus: HTTP_STATUS.UNAUTHORIZED,
    userMessage: "Your session has expired. Please log in again.",
    context: {
      tokenType: this.tokenType,
      ...this.context,
    },
  };
}

/**
 * Thrown when a user account is locked (e.g., too many login attempts).
 * HTTP Status: 429 (Too Many Requests)
 */
export class AccountLockedError extends Data.TaggedError("AccountLocked")<{
  message: string;
  email: string;
  lockedUntil?: Date;
  attemptsAllowed?: number;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    httpStatus: HTTP_STATUS.TOO_MANY_REQUESTS,
    userMessage: "Too many login attempts. Please try again later.",
    context: {
      email: this.email,
      lockedUntil: this.lockedUntil?.toISOString(),
      attemptsAllowed: this.attemptsAllowed,
      ...this.context,
    },
  };
}
