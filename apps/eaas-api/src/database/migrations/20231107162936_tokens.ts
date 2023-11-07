import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tokens", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
    table.timestamps(true, true);
    table.uuid("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
    table.string("expires").notNullable();
    table
      .enum("type", ["access", "refresh", "reset_password", "verify_email", "invite"])
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tokens");
}
