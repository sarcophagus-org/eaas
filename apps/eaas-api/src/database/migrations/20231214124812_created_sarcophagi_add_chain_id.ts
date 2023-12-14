import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("created_sarcophagi", (table) => {
    table.integer("chain_id").notNullable().defaultTo(process.env.CHAIN_ID!);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("created_sarcophagi", (table) => {
    table.dropColumn("chain_id");
  });
}
