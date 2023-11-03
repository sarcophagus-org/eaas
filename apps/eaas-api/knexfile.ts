import "dotenv/config";

// TODO: Move all env variables to config file and validate with joi https://github.com/hagopj13/node-express-boilerplate/blob/master/src/config/config.js

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_URL_TEST = `${DATABASE_URL}-test`;
const MIGRATIONS_DIR = "../migrations";
const SEEDS_DIR = "../seeds";

console.log("DATABASE_URL", DATABASE_URL);
console.log("DATABASE_URL_TEST", DATABASE_URL_TEST);

export default {
  production: {
    client: "postgres",
    connection: `${DATABASE_URL}`,
    // connection: {
    //   host: process.env.DB_HOST,
    //   port: process.env.DB_PORT,
    //   user: process.env.DB_USER,
    //   password: process.env.DB_PASS,
    //   database: process.env.DB_NAME,
    // },
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
