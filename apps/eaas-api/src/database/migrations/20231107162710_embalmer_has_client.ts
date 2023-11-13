import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("embalmer_has_client", (table) => {
    table.uuid("embalmer_id").references("id").inTable("users").primary();
    table.uuid("client_id").references("id").inTable("users").primary();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("embalmer_has_client");
}
