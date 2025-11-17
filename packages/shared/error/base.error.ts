import { Data } from "effect";

export type ErrorMetadata = {
  /** HTTP status code for the response */
  httpStatus: number;
  /** User-friendly message for frontend display */
  userMessage: string;
  /** Additional context data */
  context?: Record<string, unknown>;
};

/**
 * Base error class for all application errors.
 * Extends Effect's Data.TaggedError for proper error handling with Effect library.
 */
export abstract class BaseError extends Data.TaggedError("BaseError")<{
  message: string;
}> {
  abstract readonly metadata: ErrorMetadata;
}
