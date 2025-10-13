import { knex } from "../../../db/knex-database-connection.js";
const TABLE_NAME = "users";

async function findUserByEmail(email) {
  return await knex(TABLE_NAME).where({ email }).first() || null;
}

async function updateLastLoggedAtByUserId(userId) {
  return await knex(TABLE_NAME).where({ id: userId }).update({ lastLoggedAt: knex.fn.now(), updated_at: knex.fn.now() });
}

export { findUserByEmail, updateLastLoggedAtByUserId };
