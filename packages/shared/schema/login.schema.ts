import z from "zod";

export const loginRequest = z.object({
  email: z.email("Invalid email address"),
  password: z.string(),
});

export type LoginRequestType = z.infer<typeof loginRequest>;
