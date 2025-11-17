import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { Button } from "./button";
import { Field, FieldError, FieldLabel } from "./field";
import { Input } from "./input";

export function PasswordField({
  label,
  id,
  register,
  error,
}: {
  label: string;
  id: "password" | "confirmPassword";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field className="w-full max-w-full box-border">
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder=" "
          required
          {...register(id)}
          className="peer h-12 w-full max-w-full box-border rounded-md border-2 border-gray-300 bg-transparent px-4 py-4 text-sm text-gray-900 outline-none transition-all duration-200
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0
                     dark:bg-slate-950 dark:text-white dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        <FieldLabel
          htmlFor={id}
          className="absolute left-3 px-1 transition-all duration-200 ease-in-out
                     top-1/2 -translate-y-1/2 text-sm font-normal text-gray-500 bg-transparent
                     peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-placeholder-shown:bg-transparent
                     peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-blue-500 peer-focus:bg-white peer-focus:dark:bg-slate-950 peer-focus:px-1
                     peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-blue-500 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:dark:bg-slate-950 peer-not-placeholder-shown:px-1
                     dark:text-gray-400 dark:peer-focus:text-blue-400 dark:peer-not-placeholder-shown:text-blue-400
                     pointer-events-none z-10"
        >
          {label}
        </FieldLabel>
      </div>

      <span
        className={`block text-sm mt-0.5 mb-1.5 min-h-5 transition-all duration-200 ${
          error ? "text-red-500 visible" : "invisible"
        }`}
      >
        {error ? error : "\u00A0"}
      </span>
      <FieldError>{error}</FieldError>
    </Field>
  );
}

export function InputField({
  label,
  id,
  type,
  register,
  error,
}: {
  label: string;
  id: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: string;
}) {
  return (
    <Field className="w-full max-w-full box-border">
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder=" "
          required
          {...register(id)}
          className="peer h-12 w-full max-w-full box-border rounded-md border-2 border-gray-300 bg-transparent px-4 py-4 text-sm text-gray-900 outline-none transition-all duration-200
                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-offset-0
                     dark:bg-slate-950 dark:text-white dark:border-gray-600 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />

        <FieldLabel
          htmlFor={id}
          className="absolute left-3 px-1 transition-all duration-200 ease-in-out
                     top-1/2 -translate-y-1/2 text-sm font-normal text-gray-500 bg-transparent
                     peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-placeholder-shown:bg-transparent
                     peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-xs peer-focus:font-medium peer-focus:text-blue-500 peer-focus:bg-white peer-focus:dark:bg-slate-950 peer-focus:px-1
                     peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium peer-not-placeholder-shown:text-blue-500 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:dark:bg-slate-950 peer-not-placeholder-shown:px-1
                     dark:text-gray-400 dark:peer-focus:text-blue-400 dark:peer-not-placeholder-shown:text-blue-400
                     pointer-events-none z-10"
        >
          {label}
        </FieldLabel>
      </div>

      <span
        className={`block text-sm mt-0.5 mb-1.5 min-h-5 transition-all duration-200 ${
          error ? "text-red-500 visible" : "invisible"
        }`}
      >
        {error ? error : "\u00A0"}
      </span>
    </Field>
  );
}
