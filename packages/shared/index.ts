import { Schema } from "effect";

export const UserSchema = Schema.Struct({
  id: Schema.Number,
  email: Schema.NonEmptyString,
  username: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
});

export type User = Schema.Schema.Type<typeof UserSchema>;

export const LoginDtoSchema = Schema.Struct({
  email: Schema.NonEmptyString,
  password: Schema.NonEmptyString,
});

export type LoginDto = Schema.Schema.Type<typeof LoginDtoSchema>;

export const RegisterDtoSchema = Schema.Struct({
  email: Schema.NonEmptyString,
  username: Schema.NonEmptyString,
  password: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
});

export type RegisterDto = Schema.Schema.Type<typeof RegisterDtoSchema>;

export const AuthResponseSchema = Schema.Struct({
  accessToken: Schema.NonEmptyString,
  refreshToken: Schema.NonEmptyString,
  user: UserSchema,
});

export type AuthResponse = Schema.Schema.Type<typeof AuthResponseSchema>;
