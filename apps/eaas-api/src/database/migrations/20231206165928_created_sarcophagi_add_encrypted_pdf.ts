import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("created_sarcophagi", (table) => {
    table.text("encrypted_pdf").notNullable().defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("created_sarcophagi", (table) => {
    table.dropColumn("encrypted_pdf");
  });
}
