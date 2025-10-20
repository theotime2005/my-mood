import { generatePassword } from "../../src/identities-access-management/services/password-service.js";
import databaseBuilder from "../database-builder/index.js";
import { moods } from "./data/moods.js";
import { users } from "./data/users.js";

const PASSWORD = generatePassword("mymood123");

async function seed() {
  console.log("Seeding users");
  await users(databaseBuilder);

  console.log("seeding moods");
  await moods(databaseBuilder, PASSWORD);
}

export { seed };
