import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "moods";

async function addMood({ userId, emotionalState, motivation }) {
  return await knex(TABLE_NAME).insert({
    userId,
    emotionalState,
    motivation,
  });
}

async function getGlobalState(date) {
  const query = knex(TABLE_NAME).select("emotionalState", "motivation");

  if (date) {
    query.whereRaw("DATE(created_at) = ?", [date]);
  }

  const moods = await query;
  return moods;
}

export { addMood, getGlobalState };
