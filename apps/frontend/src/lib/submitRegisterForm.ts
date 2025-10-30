import { Effect, Console } from "effect";
import { HttpError, ParseError } from "@/lib/errors";
import { SignupFormValues } from "./register.validation";

export const submitRegisterForm = async (data: SignupFormValues) =>
  Effect.tryPromise({
    try: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    catch: (err) =>
      new HttpError({
        message: "An error occurred. Please try again." + err,
        status: 500,
      }),
  }).pipe(
    Effect.flatMap((res) =>
      Effect.tryPromise({
        try: () => res.json(),
        catch: () =>
          new ParseError({ message: "Failed to parse response from server." }),
      })
    ),
    Effect.tap((res) => Console.log("Response from login:", res)),
    Effect.runPromise
  );
