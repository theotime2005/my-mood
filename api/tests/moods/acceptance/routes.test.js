import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import { knex } from "../../../db/knex-database-connection.js";
import server from "../../../server.js";
import { encodedToken } from "../../../src/identities-access-management/services/token-service.js";
import { EMOTIONAL_STATES } from "../../../src/moods/constants.js";
import { AVAILABLE_SOURCES, USER_TYPE } from "../../../src/shared/constants.js";

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

  describe("GET /api/moods", () => {
    it("should return 200 status code and data", async () => {
      // given
      const employer1 = await databaseBuilder.factory.buildUser({ email: "employer1@example.net" });
      const employer2 = await databaseBuilder.factory.buildUser({ email: "employer2@example.net" });
      await databaseBuilder.factory.buildMood({ userId: employer1.id, emotionalState: EMOTIONAL_STATES.SAD });
      await databaseBuilder.factory.buildMood({ userId: employer2.id, emotionalState: EMOTIONAL_STATES.HAPPY });
      const manager = await databaseBuilder.factory.buildUser({ email: "manager@example.net", userType: USER_TYPE.MANAGER });
      const token = encodedToken({ userId: manager.id });
      const headers = { Authorization: `Bearer ${token}`, from: AVAILABLE_SOURCES.MYMOOD };

      // when
      const response = await request(server).get("/api/moods").set(headers);

      // then
      expect(response.status).toBe(200);
      const { data } = response.body;
      expect(data).not.toBeNull();
    });
  });
});
