import { Effect } from "effect";
import { HttpError, ParseError } from "@/lib/errors";
import { toast } from "sonner";
import { SignupFormValues } from "./register.validation";
import { useRouter } from "next/navigation";

export const submitRegisterForm =
  (router: ReturnType<typeof useRouter>) => async (data: SignupFormValues) =>
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
      Effect.andThen((res) =>
        Effect.if(res.ok, {
          onTrue: () => {
            toast.success("Registration successful! Please log in.");
            router.push("/login");
            return Effect.tryPromise({
              try: () => res.json(),
              catch: (err) =>
                new ParseError({
                  message: "Failed to parse response." + err,
                  status: 500,
                }),
            });
          },
          onFalse: () => Effect.sync(() => toast.error("Response not ok")),
        })
      ),
      Effect.runPromise
    );
