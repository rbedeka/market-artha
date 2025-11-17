import { Data } from "effect";
import type { ErrorMetadata } from "../base.error";
import { HTTP_STATUS } from "../../constants";

/**
 * Thrown when a requested database record is not found.
 * HTTP Status: 404
 */
export class DatabaseNotFoundError extends Data.TaggedError(
  "DatabaseNotFound"
)<{
  message: string;
  entityType: string; // e.g., "User", "Journal", "Algorithm"
  entityId?: string | number;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "DB_NOT_FOUND",
    httpStatus: HTTP_STATUS.NOT_FOUND,
    userMessage: `The requested ${this.entityType} was not found.`,
    context: {
      entityType: this.entityType,
      entityId: this.entityId,
      ...this.context,
    },
  };
}

/**
 * Thrown when a database connection cannot be established.
 * HTTP Status: 503 (Service Unavailable)
 */
export class DatabaseConnectionError extends Data.TaggedError(
  "DatabaseConnection"
)<{
  message: string;
  serviceName?: string; // e.g., "PostgreSQL", "TimescaleDB"
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "DB_CONNECTION_FAILED",
    httpStatus: HTTP_STATUS.SERVICE_UNAVAILABLE,
    userMessage:
      "Database service is temporarily unavailable. Please try again later.",
    context: {
      serviceName: this.serviceName,
      ...this.context,
    },
  };
}

/**
 * Thrown when a database query fails unexpectedly.
 * HTTP Status: 500 (Internal Server Error)
 */
export class DatabaseQueryError extends Data.TaggedError("DatabaseQuery")<{
  message: string;
  query?: string;
  code?: string; // Prisma error code
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "DB_QUERY_FAILED",
    httpStatus: HTTP_STATUS.INTERNAL_ERROR,
    userMessage: "Failed to process your request. Please try again.",
    context: {
      queryCode: this.code,
      ...this.context,
    },
  };
}

/**
 * Thrown when attempting to create a record that violates unique constraints.
 * HTTP Status: 409 (Conflict)
 */
export class DatabaseDuplicateError extends Data.TaggedError(
  "DatabaseDuplicateError"
)<{
  message: string;
  field: string; // e.g., "email", "username"
  value?: string;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "DB_DUPLICATE_ENTRY",
    httpStatus: HTTP_STATUS.CONFLICT,
    userMessage: `This ${this.field} is already in use. Please use a different value.`,
    context: {
      field: this.field,
      value: this.value,
      ...this.context,
    },
  };
}
