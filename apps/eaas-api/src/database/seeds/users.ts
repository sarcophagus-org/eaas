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
        name: "admin",
        email: "admin@example.com",
        password: await hashPassword("admin"),
        phone: "8888888888",
        isAdmin: true,
      },
    ])
    .returning("id");
}
