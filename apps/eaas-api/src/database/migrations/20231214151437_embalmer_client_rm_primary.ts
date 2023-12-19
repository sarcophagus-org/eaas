import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("embalmer_has_clients", (table) => {
    table.dropPrimary("embalmer_has_clients_pkey");
  });
}

export async function down(knex: Knex): Promise<void> {}
