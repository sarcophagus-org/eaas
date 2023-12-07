import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("created_sarcophagi", (table) => {
    table.binary("encrypted_pdf").notNullable().defaultTo(Buffer.alloc(0));
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("created_sarcophagi", (table) => {
    table.dropColumn("encrypted_pdf");
  });
}
