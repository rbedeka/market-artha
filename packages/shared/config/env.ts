import { z } from "zod";
import { ConfigValidationError } from "../error";

// Define environment schema
const baseEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Backend-specific env
export const backendEnvSchema = baseEnvSchema.extend({
  // Frontend URL for CORS
  FRONTEND_URL: z.url(),
  // Postgres DB configuration
  DATABASE_URL: z.url(),
  POSTGRES_DB: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  // Redis configuration
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  // Cloudflare Turnstile configuration
  TURNSTILE_SECRET_KEY: z.string(),
  BACKEND_PORT: z.coerce.number().default(3001),
  // JWT configuration
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

// Frontend-specific env (public vars only!)
export const frontendEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string(),
});

// Type inference
export type BackendEnv = z.infer<typeof backendEnvSchema>;
export type FrontendEnv = z.infer<typeof frontendEnvSchema>;

// Runtime parsing with error handling
export const parseBackendEnv = (env: Record<string, any>): BackendEnv => {
  const result = backendEnvSchema.safeParse(env);
  if (!result.success) {
    throw new ConfigValidationError({
      message: result.error.message,
      issues: result.error.issues,
      context: { path: z.treeifyError(result.error).properties },
    });
  }
  return result.data;
};

export const parseFrontendEnv = (env: Record<string, any>): FrontendEnv => {
  const result = frontendEnvSchema.safeParse(env);
  if (!result.success) {
    throw new ConfigValidationError({
      message: result.error.message,
      issues: result.error.issues,
      context: { path: z.treeifyError(result.error).properties },
    });
  }
  return result.data;
};
