import Knex from "knex";
import knexfile from "../../knexfile";

const env = process.env.NODE_ENV || "development";

const eaasKnex = Knex(knexfile[env]);

export { eaasKnex };
