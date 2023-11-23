import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("created_sarcophagi", (table) => {
    table.string("id").primary();
    table.timestamps(true, true);
    table.uuid("embalmer_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.uuid("client_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("created_sarcophagi");
}
