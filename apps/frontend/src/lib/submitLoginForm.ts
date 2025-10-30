import { Effect, Console } from "effect";
import { HttpError, ParseError } from "./errors";
import { LoginFormValues } from "../../../../packages/shared/schema/login.validation";
// import { Dispatch, SetStateAction } from "react";
// import { useTurnstile } from "react-turnstile";
// import { useRouter } from "next/navigation";

export const submitLoginForm = async (
  captchaToken: string,
  data: LoginFormValues
) => {
  return Effect.tryPromise({
    try: () =>
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, captchaToken }),
      }),
    catch: (err) =>
      new HttpError({
        message: "An error occurred. Please try again." + err,
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
};
