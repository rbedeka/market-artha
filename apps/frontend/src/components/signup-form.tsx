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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField, PasswordField } from "./ui/input-fields";
import { SignupFormValues, signupSchema } from "@/lib/register.validation";
import { SocialLoginGroups } from "./ui/social-logins";
import Link from "next/link";
import { submitRegisterForm } from "@/lib/submitRegisterForm";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const form = useForm<SignupFormValues>({
    mode: "onBlur", // Changed to onBlur for real-time async validation
    reValidateMode: "onBlur",
    resolver: zodResolver(signupSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const registerMutation = useMutation({
    mutationFn: (data: SignupFormValues) => submitRegisterForm(data),
    onSuccess: (data) => {
      console.log("Register response data:", data);
      toast.success("Registered successfully!");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const submitForm = (data: SignupFormValues) => registerMutation.mutate(data);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(submitForm)}>
            <FieldGroup className="gap-2">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold py-4">Create your account</h1>
              </div>

              <InputField
                label="Username"
                id="username"
                register={register}
                error={errors.username?.message}
              />
              <InputField
                label="Email"
                id="email"
                type="email"
                register={register}
                error={errors.email?.message}
              />
              {errors.email?.type === "custom" && (
                <div className="-mt-4 py-2">
                  <Link
                    href="/login"
                    className="text-sm text-blue-500 underline"
                  >
                    Log in
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-500 underline"
                  >
                    Reset password
                  </Link>
                </div>
              )}

              <PasswordField
                label="Password"
                id="password"
                register={register}
                error={errors.password?.message}
              />
              <PasswordField
                label="Confirm Password"
                id="confirmPassword"
                register={register}
                error={errors.confirmPassword?.message}
              />
              <Field>
                <Button type="submit" disabled={!isValid} className="w-full">
                  Create Account
                </Button>
              </Field>
              <div className="h-2" />

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <div className="h-2" />

              <SocialLoginGroups />
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/login-page.jpg"
              loading="eager"
              width={500}
              height={500}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:grayscale-50"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
