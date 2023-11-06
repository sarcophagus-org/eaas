import dotenv from "dotenv";
import Joi from "joi";
import path from "path";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
} else if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.join(__dirname, "../../.env.test") });
}

const envVarsSchema = Joi.object()
  .keys({
    /**
     * Required ENV Vars
     */
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    DATABASE_URL: Joi.string().required().description("database connection url"),

    /**
     * Optional ENV vars
     */
    PORT: Joi.number().default(4000).description("api port number"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_ACCESS_EXPIRATION_DAYS: Joi.number()
      .default(365)
      .description("days after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(365)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which verify email token expires"),
    JWT_INVITE_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which invite token expires"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Environment variable validation error: ${error.message}`);
}

export const envConfig = {
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    inviteExpirationDays: envVars.JWT_INVITE_EXPIRATION_DAYS,
  },
  databaseUrl: envVars.DATABASE_URL,
};