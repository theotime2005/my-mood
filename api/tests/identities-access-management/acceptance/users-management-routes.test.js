import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import { knex } from "../../../db/knex-database-connection.js";
import server from "../../../server.js";
import { encodedToken } from "../../../src/identities-access-management/services/token-service.js";
import { AVAILABLE_SOURCES, USER_TYPE } from "../../../src/shared/constants.js";

describe("Acceptance | Identities Access Management | Routes | Users Management Routes", () => {
  describe("PUT /api/users/{userId}", () => {
    it("should return 200 status code and update user type", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({ userType: USER_TYPE.MANAGER });
      const adminUser = await databaseBuilder.factory.buildUser({ email: "admin@example.net", userType: USER_TYPE.ADMIN });
      const token = encodedToken({ userId: adminUser.id });
      const req = {
        headers: {
          from: AVAILABLE_SOURCES.MANAGEMENT,
          authorization: `Bearer ${token}`,
        },
        body: {
          userType: USER_TYPE.EMPLOYER,
        },
      };
      const { id } = createdUser;

      // when
      const response = await request(server).put(`/api/users/${id}/user-type`).send(req.body).set(req.headers);

      // then
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "User type updated successfully" });
      const updatedUser = await knex("users").where({ id }).first();
      expect(updatedUser.userType).toBe(USER_TYPE.EMPLOYER);
    });

    it("should return 403 if from is not management app", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({ userType: USER_TYPE.MANAGER });
      const token = encodedToken({ userId: createdUser.id });
      const req = {
        headers: {
          from: AVAILABLE_SOURCES.MYMOOD,
          authorization: `Bearer ${token}`,
        },
        body: {
          userType: USER_TYPE.EMPLOYER,
        },
      };
      const { id } = createdUser;

      // when
      const response = await request(server).put(`/api/users/${id}/user-type`).send(req.body).set(req.headers);

      // then
      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: "Forbidden" });
    });
  });
});
