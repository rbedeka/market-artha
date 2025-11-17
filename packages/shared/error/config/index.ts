import { Data } from "effect";
import type { ErrorMetadata } from "../base.error";
import type z from "zod";
import { HTTP_STATUS } from "../../constants";

/**
 * Thrown when environment variable validation fails during app startup.
 * HTTP Status: 500 (Internal Server Error)
 */
export class ConfigValidationError extends Data.TaggedError(
  "ConfigValidation"
)<{
  message: string;
  issues: z.core.$ZodIssue[];
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    httpStatus: HTTP_STATUS.INTERNAL_ERROR,
    userMessage:
      "Server configuration error. Please contact system administrator.",
    context: {
      missingEnvVars: this.issues
        .map((issue) => issue.path.join("."))
        .filter(Boolean),
      ...this.context,
    },
  };
}

/**
 * Thrown when a required configuration value is missing.
 * HTTP Status: 500 (Internal Server Error)
 */
export class MissingConfigError extends Data.TaggedError("MissingConfig")<{
  message: string;
  key: string;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    httpStatus: HTTP_STATUS.INTERNAL_ERROR,
    userMessage:
      "Server configuration error. Please contact system administrator.",
    context: {
      missingKey: this.key,
      ...this.context,
    },
  };
}
