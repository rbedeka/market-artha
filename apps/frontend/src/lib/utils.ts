import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import { frontendEnvSchema, FrontendEnv } from "@market-artha/shared";
import { FrontendEnv, parseFrontendEnv } from "@market-artha/shared";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const envObj: Record<keyof FrontendEnv, string | undefined> = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
};

export const env = parseFrontendEnv(envObj);
