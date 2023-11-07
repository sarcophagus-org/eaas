import dotenv from "dotenv";
import Joi from "joi";
import path from "path";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname, ".env") });
} else if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.join(__dirname, ".env.test") });
}

const dbUrlSchema = Joi.object()
  .keys({
    DATABASE_URL: Joi.string().required().description("database connection url"),
  })
  .unknown();

const { value: env, error } = dbUrlSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  throw new Error(`Environment variable validation error: ${error.message}`);
}

// TODO: Use envConfig instead. For some reason, its import is currently not working.
const DATABASE_URL = env.DATABASE_URL;
const DATABASE_URL_TEST = `${DATABASE_URL}-test`;
const MIGRATIONS_DIR = "../migrations";
const SEEDS_DIR = "../seeds";

export default {
  production: {
    client: "postgres",
    connection: `${DATABASE_URL}`,
    migrations: {
      directory: `${MIGRATIONS_DIR}`,
    },
    seeds: {
      directory: `${SEEDS_DIR}`,
    },
  },
  development: {
    client: "postgres",
    connection: `${DATABASE_URL}`,
    migrations: {
      directory: `${MIGRATIONS_DIR}`,
    },
    seeds: {
      directory: `${SEEDS_DIR}`,
    },
  },
  test: {
    client: "postgres",
    connection: `${DATABASE_URL_TEST}`,
    migrations: {
      directory: `${MIGRATIONS_DIR}`,
    },
  },
};
