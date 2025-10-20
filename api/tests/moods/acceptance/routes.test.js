import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import { knex } from "../../../db/knex-database-connection.js";
import server from "../../../server.js";
import { encodedToken } from "../../../src/identities-access-management/services/token-service.js";
import { EMOTIONAL_STATES } from "../../../src/moods/constatns.js";
import { AVAILABLE_SOURCES } from "../../../src/shared/constants.js";

describe("Acceptance | Moods | Routes", () => {
  describe("POST /api/moods", () => {
    it("should return 201 status code and post data", async () => {
      // given
      const employer1 = await databaseBuilder.factory.buildUser({ email: "employer1@example.net" });
      const token = encodedToken({ userId: employer1.id });
      const req = {
        headers: {
          Authorization: `Bearer ${token}`,
          from: AVAILABLE_SOURCES.MYMOOD,
        },
        body: {
          emotionalState: EMOTIONAL_STATES.HAPPY,
          motivation: 5,
        },
      };

      // when
      const response = await request(server).post("/api/moods").send(req.body).set(req.headers);

      // then
      expect(response.status).toBe(201);
      const foundMood = await knex("moods").where({ userId: employer1.id });
      expect(foundMood).toHaveLength(1);
      expect(foundMood[0].emotionalState).toBe(EMOTIONAL_STATES.HAPPY);
    });
  });
});
