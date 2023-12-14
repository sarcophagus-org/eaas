import { envConfig } from "./src/config/env.config.ts";

const DATABASE_URL = envConfig.databaseUrl;
const DATABASE_URL_TEST = `${DATABASE_URL}-test`;

const MIGRATIONS_DIR = "./src/database/migrations";
const SEEDS_DIR = "./src/database/seeds";

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
