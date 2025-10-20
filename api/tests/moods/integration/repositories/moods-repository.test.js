import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import { EMOTIONAL_STATES } from "../../../../src/moods/constants.js";
import * as moodsRepository from "../../../../src/moods/repositories/moods-repository.js";

describe("Integration | Moods | Repositories | Moods Repository", () => {
  describe("#addMood", () => {
    it("should add entry to database", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser();

      // when
      await moodsRepository.addMood({
        userId: createdUser.id,
        emotionalState: EMOTIONAL_STATES.SAD,
        motivation: 5,
      });

      // then
      const createdMood = await knex("moods").where({ userId: createdUser.id }).first();
      expect(createdMood).toBeDefined();
      expect(createdMood.emotionalState).toBe(EMOTIONAL_STATES.SAD);
      expect(createdMood.motivation).toBe(5);
    });
  });

  describe("#getGlobalState", () => {
    it("should return array with entries", async () => {
      // given
      const user1 = await databaseBuilder.factory.buildUser({ email: "user1@example.net" });
      const user2 = await databaseBuilder.factory.buildUser({ email: "user2@example.net" });
      await databaseBuilder.factory.buildMood({ userId: user1.id, emotionalState: EMOTIONAL_STATES.SAD });
      await databaseBuilder.factory.buildMood({ userId: user2.id, emotionalState: EMOTIONAL_STATES.HAPPY });
      const actualDate = new Date().toISOString().split("T")[0];

      // when
      const globalState = await moodsRepository.getGlobalState(actualDate);

      // then
      expect(globalState).toHaveLength(2);
      const emotionalStates = globalState.map(entry => entry.emotionalState);
      expect(emotionalStates).toContain(EMOTIONAL_STATES.SAD);
      expect(emotionalStates).toContain(EMOTIONAL_STATES.HAPPY);
      globalState.map((state) => {
        expect(state.userId).toBeUndefined();
      });
    });
  });
});
