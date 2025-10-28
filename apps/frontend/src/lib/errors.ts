import { Data } from "effect";

export class HttpError extends Data.TaggedError("HttpError")<{
  message: string;
  status?: number;
}> {}

export class ParseError extends Data.TaggedError("ParseError")<{
  message: string;
  status?: number;
}> {}
