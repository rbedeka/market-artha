import { Effect } from "effect";
import z from "zod";

const emailNotTaken = (email: string) =>
  Effect.if({
    onTrue: () => Effect.succeed(true),
    onFalse: () =>
      Effect.tryPromise(() =>
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/auth/check-email?email=${encodeURIComponent(email)}`
        ).then((res) => res.json())
      ).pipe(
        Effect.catchAll(() => Effect.succeed(true)),
        Effect.map((data) => !data.exists)
      ),
  })(!email).pipe(Effect.runPromise);

export const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z
      .email({ message: "Invalid email address" })
      .refine(emailNotTaken, "Email is already registered"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (val) => /[A-Z]/.test(val),
        "Password must contain at least 1 uppercase character"
      )
      .refine(
        (val) => /[a-z]/.test(val),
        "Password must contain at least 1 lowercase character"
      )
      .refine(
        (val) => /[0-9]/.test(val),
        "Password must contain at least 1 number"
      )
      .refine(
        (val) => /[^A-Za-z0-9]/.test(val),
        "Password must contain at least 1 special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
