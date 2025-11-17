import { Data } from "effect";
import type { ErrorMetadata } from "../base.error";
import type z from "zod";
import { HTTP_STATUS } from "../../constants";

/**
 * Thrown when request validation fails.
 * HTTP Status: 400 (Bad Request)
 */
export class ValidationError extends Data.TaggedError("ValidationError")<{
  message: string;
  issues: z.core.$ZodIssue[];
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    httpStatus: HTTP_STATUS.BAD_REQUEST,
    userMessage: "Invalid request data. Please check your input.",
    context: {
      fieldErrors: this.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
      ...this.context,
    },
  };
}

/**
 * Thrown when payload is malformed or missing required fields.
 * HTTP Status: 400 (Bad Request)
 */
export class BadRequestError extends Data.TaggedError("BadRequestError")<{
  message: string;
  field?: string;
  reason?: string;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "BAD_REQUEST",
    httpStatus: HTTP_STATUS.BAD_REQUEST,
    userMessage: `Bad request: ${this.reason ?? "Invalid input"}`,
    context: {
      field: this.field,
      reason: this.reason,
      ...this.context,
    },
  };
}
