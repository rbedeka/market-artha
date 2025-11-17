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
import { LoginFormValues, loginSchema } from "@/lib/login.validation";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { InputField, PasswordField } from "./ui/input-fields";
import Link from "next/link";
import TurnstileWidget from "./ui/captcha-turnstile";
import { useState } from "react";
import { submitLoginForm } from "@/lib/submitLoginForm";
import { useTurnstile } from "react-turnstile";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { HttpError, ParseError } from "@market-artha/shared/error";

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

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstile = useTurnstile();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      submitLoginForm(captchaToken!, data),
    onSuccess: (data) => {
      turnstile.reset();
      setCaptchaToken(null);

      console.log("Login response data:", data);

      if (data.status === "ok") {
        toast.success("Logged in!");
        router.push("/dashboard");
      } else {
        toast.error(data.message || "Login failed.");
      }
    },
    onError: (error: HttpError | ParseError) => {
      toast.error(error.message);
    },
  });

  const submitForm = (data: LoginFormValues) => loginMutation.mutate(data);

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
                className="ml-auto text-sm underline-offset-2 hover:underline -mt-8"
              >
                Forgot your password?
              </Link>

              <TurnstileWidget onVerify={setCaptchaToken} />
              <Field>
                <Button type="submit" disabled={!isValid || !captchaToken}>
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
