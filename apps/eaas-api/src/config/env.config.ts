import dotenv from "dotenv";
import Joi from "joi";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
} else if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.join(__dirname, "../../.env.test") });
}

const envVarsSchema = Joi.object()
  .keys({
    PRIVATE_KEY: Joi.string().required().description("Embalmer private key"),
    PROVIDER_URL: Joi.string().required().description("Ethereum provider url"),
    ZERO_EX_API_KEY: Joi.string().required().description("0x API key"),

    CLIENT_URL: Joi.string().default("http://localhost:5173"),

    /**
     * Required ENV Vars
     */
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    DATABASE_URL: Joi.string().required().description("database connection url"),
    SENDGRID_EMAIL: Joi.string().required().description("Sendgrid from email"),
    SENDGRID_API_KEY: Joi.string().required().description("Sendgrid API key"),

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
  client: {
    url: envVars.CLIENT_URL,
  },
  sendGrid: {
    fromEmail: envVars.SENDGRID_EMAIL,
    apiKey: envVars.SENDGRID_API_KEY,
    eaasLogoUrl: "",
  },
  privateKey: envVars.PRIVATE_KEY,
  providerUrl: envVars.PROVIDER_URL,
  zeroExApiKey: envVars.ZERO_EX_API_KEY,
};
