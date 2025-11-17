import { Data } from "effect";
import type { ErrorMetadata } from "../base.error";
import { HTTP_ERRORS, HTTP_STATUS } from "../../constants";

/**
 * Thrown when an HTTP request fails (network error, bad response, etc).
 * Replaces the current HttpError with enhanced metadata.
 * HTTP Status: configurable (typically 4xx or 5xx)
 */
export class HttpError extends Data.TaggedError("HttpError")<{
  message: string;
  // Only allowed from HTTP Errors
  status?: (typeof HTTP_ERRORS)[number];
  statusText?: string;
  url?: string;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "HTTP_REQUEST_FAILED",
    httpStatus: this.status ?? 500,
    userMessage: `Request failed: ${this.statusText ?? "Unknown error"}`,
    context: {
      url: this.url,
      status: this.status,
      ...this.context,
    },
  };
}

/**
 * Thrown when parsing a network response (JSON, etc) fails.
 * HTTP Status: 502 (Bad Gateway) - indicates malformed upstream response
 */
export class ParseError extends Data.TaggedError("ParseError")<{
  message: string;
  type?: string; // e.g., "json", "xml", "form-data"
  originalError?: string;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "PARSE_ERROR",
    httpStatus: HTTP_STATUS.BAD_GATEWAY,
    userMessage:
      "Failed to process response from the server. Please try again.",
    context: {
      parseType: this.type,
      originalError: this.originalError,
      ...this.context,
    },
  };
}

/**
 * Thrown when an external service (API, webhook, etc) is unreachable or times out.
 * HTTP Status: 503 (Service Unavailable)
 */
export class ExternalServiceError extends Data.TaggedError("ExternalService")<{
  message: string;
  serviceName: string; // e.g., "PaymentGateway", "EmailService", "CaptchaService"
  serviceUrl?: string;
  statusCode?: number;
  timeout?: boolean;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "EXTERNAL_SERVICE_FAILED",
    httpStatus: HTTP_STATUS.SERVICE_UNAVAILABLE,
    userMessage: `${this.serviceName} is temporarily unavailable. Please try again later.`,
    context: {
      serviceName: this.serviceName,
      serviceUrl: this.serviceUrl,
      isTimeout: this.timeout,
      ...this.context,
    },
  };
}

/**
 * Thrown when a network request times out.
 * HTTP Status: 504 (Gateway Timeout)
 */
export class TimeoutError extends Data.TaggedError("Timeout")<{
  message: string;
  endpoint?: string;
  timeoutMs?: number;
  context?: Record<string, unknown>;
}> {
  readonly metadata: ErrorMetadata = {
    // code: "REQUEST_TIMEOUT",
    httpStatus: HTTP_STATUS.GATEWAY_TIMEOUT,
    userMessage: "Request took too long. Please try again.",
    context: {
      endpoint: this.endpoint,
      timeoutMs: this.timeoutMs,
      ...this.context,
    },
  };
}
