import { generatePassword } from "../../../src/identities-access-management/services/password-service.js";
import { USER_TYPE } from "../../../src/shared/constants.js";
import { knex } from "../../knex-database-connection.js";
async function buildUser({ firstname = "John", lastname = "Doe", email = "john.doe@example.net", created_at = new Date(), updated_at = new Date(), hashedPassword = null, userType = USER_TYPE.EMPLOYER, lastLoggedAt = null, isActive = true, shouldChangePassword = false } = {}) {
  if (!hashedPassword) {
    hashedPassword = await generatePassword("password");
  }
  const [values] = await knex("users").insert({
    firstname,
    lastname,
    email,
    created_at,
    updated_at,
    isActive,
    hashedPassword,
    userType,
    lastLoggedAt,
    shouldChangePassword,
  }).returning("*");
  return values;
}

export { buildUser };
