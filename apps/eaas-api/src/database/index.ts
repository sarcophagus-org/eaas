import Knex from "knex";
import knexfile from "../../knexfile";

const env = process.env.NODE_ENV || "development";

console.log("env", env);

const eaasKnex = Knex(knexfile[env]);

export { eaasKnex };
