import { Console, Effect } from "effect";
import { HttpError, ParseError } from "@market-artha/shared/error";
import { LoginFormValues } from "./login.validation";
import { env } from "./utils";

export const submitLoginForm = async (
  captchaToken: string,
  data: LoginFormValues
) => {
  return Effect.tryPromise({
    try: () =>
      fetch(`${env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
      res.ok
        ? Effect.succeed(res)
        : new HttpError({
            message: `Invalid user or password`,
          })
    ),
    Effect.flatMap((res) =>
      Effect.tryPromise({
        try: () => res.json(),
        catch: () =>
          new ParseError({ message: "Failed to parse response from server." }),
      })
    ),
    Effect.tap((resData) =>
      Console.log("Login response data:", JSON.stringify(resData))
    ),

    Effect.runPromise
  );
};
