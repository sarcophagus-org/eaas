import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").defaultTo(knex.raw("gen_random_uuid()")).primary();
    table.timestamps(true, true);
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.boolean("is_admin").notNullable().defaultTo("false");
    table.string("phone").notNullable();
    table.string("name").notNullable();
    table.boolean("is_email_verified").defaultTo("false");
    table.string("profile_picture_key");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
