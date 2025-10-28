import { Effect, Console } from "effect";
import { toast } from "sonner";
import { HttpError, ParseError } from "./errors";
import { LoginFormValues } from "./login.validation";
import { Dispatch, SetStateAction } from "react";
import { useTurnstile } from "react-turnstile";
import { useRouter } from "next/navigation";

export const submitLoginForm =
  (
    captchaToken: string,
    setCaptchaToken: Dispatch<SetStateAction<string | null>>,
    turnstile: ReturnType<typeof useTurnstile>,
    router: ReturnType<typeof useRouter>
  ) =>
  async (data: LoginFormValues) => {
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
      Effect.tap((res) => Console.log("Response from login:", res)),
      Effect.andThen((res) =>
        Effect.if(res.ok, {
          onTrue: () => {
            toast.success("Login successful!");
            router.push("/dashboard");
            return Effect.tryPromise({
              try: () => res.json(),
              catch: (err) =>
                new ParseError({
                  message: "Failed to parse response." + err,
                }),
            });
          },
          onFalse: () => Effect.sync(() => toast.error("Invalid Credentials")),
        })
      ),
      Effect.tap(() => setCaptchaToken(null)),
      Effect.tap(() => Effect.sync(() => turnstile.reset())),
      Effect.runPromise
    );
  };
