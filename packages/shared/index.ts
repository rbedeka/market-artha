import { Schema } from "effect";
import { annotations } from "effect/Schema";

export const UserSchema = Schema.Struct({
  id: Schema.Number,
  email: Schema.NonEmptyString,
  username: Schema.NonEmptyString,
  name: Schema.NonEmptyString,
});

export type User = Schema.Schema.Type<typeof UserSchema>;

export const LoginDtoSchema = Schema.Struct({
  email: Schema.TemplateLiteral(
    Schema.String,
    Schema.Literal("@"),
    Schema.String
  ),
  password: Schema.NonEmptyString,
});

export type LoginDto = Schema.Schema.Type<typeof LoginDtoSchema>;

export const RegisterDtoSchema = Schema.Struct({
  email: Schema.TemplateLiteral(
    Schema.String,
    Schema.Literal("@"),
    Schema.String
  ),
  username: Schema.NonEmptyString.pipe(Schema.minLength(3)),
  password: Schema.NonEmptyString.pipe(
    Schema.filter(
      (s) =>
        /[A-Z]/.test(s) &&
        /[a-z]/.test(s) &&
        /[0-9]/.test(s) &&
        /[^A-Za-z0-9]/.test(s),
      {
        message: () =>
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }
    )
  ),
});

export type RegisterDto = Schema.Schema.Type<typeof RegisterDtoSchema>;

export const AuthResponseSchema = Schema.Struct({
  accessToken: Schema.NonEmptyString,
  refreshToken: Schema.NonEmptyString,
  user: UserSchema,
});

export type AuthResponse = Schema.Schema.Type<typeof AuthResponseSchema>;
