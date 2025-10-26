"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import Image from "next/image";
import { SocialLoginGroups } from "./ui/social-logins";
import { LoginFormValues, loginSchema } from "@/utils/login.validation";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { InputField, PasswordField } from "./ui/input-fields";
import Link from "next/link";
import { Console, Effect } from "effect";
import { HttpError, ParseError } from "@/utils/errors";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(loginSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const submitForm = async (data: LoginFormValues) =>
    Effect.tryPromise({
      try: () =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
            toast.success("Login successful!");
            return Effect.tryPromise({
              try: () => res.json(),
              catch: (err) =>
                new ParseError({
                  message: "Failed to parse response." + err,
                  status: 500,
                }),
            });
          },
          onFalse: () => Effect.sync(() => toast.error("Invalid Credentials")),
        })
      ),
      Effect.tap(() => Console.log(process.env.NEXT_PUBLIC_API_URL)),
      Effect.runPromise
    );
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(submitForm)}>
            <FieldGroup>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance py-4">
                  Login to your Market Artha account
                </p>
              </div>
              <InputField
                label="Email"
                id="email"
                type="email"
                register={register}
                error={errors.email?.message}
              />
              <PasswordField
                label="Password"
                id="password"
                register={register}
                error={errors.password?.message}
              />
              <Link
                href="#"
                className="ml-auto text-sm underline-offset-2 hover:underline -mt-5"
              >
                Forgot your password?
              </Link>

              <Field>
                <Button type="submit" disabled={!isValid}>
                  Login
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <SocialLoginGroups />
              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href="/register">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              loading="eager"
              src="/login-page.jpg"
              width={500}
              height={500}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:grayscale-50"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
