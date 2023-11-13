import { Knex } from "knex";
import bcrypt from "bcrypt";

export async function seed(knex: Knex): Promise<void> {
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };

  await knex("users").del();

  await knex("users")
    .insert([
      {
        email: "admin@example.com",
        password: await hashPassword("admin"),
        is_embalmer: true,
      },
    ])
    .returning("id");
}
