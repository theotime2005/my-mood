import databaseBuilder from "../database-builder/index.js";
import { users } from "./data/users.js";

async function seed() {
  console.log("Seeding users");
  await users(databaseBuilder);
}

export { seed };
