import { EMOTIONAL_STATES } from "../../../src/moods/constants.js";
import { knex } from "../../knex-database-connection.js";

async function buildMood({ userId, emotionalState = EMOTIONAL_STATES.HAPPY, motivation = 5 } = {}) {
  await knex("moods").insert({ userId, emotionalState, motivation });

}

export { buildMood };
