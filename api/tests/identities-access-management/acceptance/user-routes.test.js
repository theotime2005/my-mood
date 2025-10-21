import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import server from "../../../server.js";
import { encodedToken } from "../../../src/identities-access-management/services/token-service.js";
import { AVAILABLE_SOURCES } from "../../../src/shared/constants.js";

describe("Acceptance | Identities Access Management | Routes | User routes", () => {
  describe("GET /api/user", () => {
    it("should return 200 status code and user info", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const token = encodedToken({ userId: user.id });
      const headers = { from: AVAILABLE_SOURCES.MYMOOD, Authorization: `Bearer ${token}` };

      // when
      const response = await request(server)
        .get("/api/user")
        .set(headers);

      // then
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        userType: user.userType,
      });
    });

    it("should return 404 if user does not exist", async () => {
      // given
      const token = encodedToken({ userId: 123456789 });
      const headers = { from: AVAILABLE_SOURCES.MYMOOD, Authorization: `Bearer ${token}` };

      // when
      const response = await request(server)
        .get("/api/user")
        .set(headers);

      // then
      expect(response.status).toBe(404);
    });
  });
});
