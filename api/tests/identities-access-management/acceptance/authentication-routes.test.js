import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import server from "../../../server.js";
import { AVAILABLE_SOURCES, USER_TYPE } from "../../../src/shared/constants.js";

describe("Acceptance | Identities Access Management | Authentication routes", () => {
  describe("POST /api/authentication/login", () => {
    it("should return 200 http status code and token", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser();
      const req = {
        headers: {
          from: AVAILABLE_SOURCES.MYMOOD,
        },
        body: {
          email: createdUser.email,
          password: "password",
        },
      };

      // when
      const res = await request(server).post("/api/authentication/login").send(req.body).set(req.headers);

      // then
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return 401 if user not found", async () => {
      // given
      const req = {
        headers: {
          from: AVAILABLE_SOURCES.MYMOOD,
        },
        body: {
          email: "alex@example.net",
          password: "password",
        },
      };

      // when
      const res = await request(server).post("/api/authentication/login").send(req.body).set(req.headers);

      // then
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });

    it("should return 401 if password is incorrect", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser();
      const req = {
        headers: {
          from: AVAILABLE_SOURCES.MYMOOD,
        },
        body: {
          email: createdUser.email,
          password: "incorrect_password",
        },
      };

      // when
      const res = await request(server).post("/api/authentication/login").send(req.body).set(req.headers);

      // then
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message", "Invalid email or password");
    });

    it("should return 400 if user type is not an admin and from is management", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({ userType: USER_TYPE.EMPLOYER });
      const req = {
        headers: {
          from: AVAILABLE_SOURCES.MANAGEMENT,
        },
        body: {
          email: createdUser.email,
          password: "password",
        },
      };

      // when
      const res = await request(server).post("/api/authentication/login").send(req.body).set(req.headers);

      // then
      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message", "Forbidden");
    });

    it("should return 200 if user type is admin and source is management", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({ userType: USER_TYPE.ADMIN });
      const req = {
        headers: {
          from: AVAILABLE_SOURCES.MANAGEMENT,
        },
        body: {
          email: createdUser.email,
          password: "password",
        },
      };

      // when
      const res = await request(server).post("/api/authentication/login").send(req.body).set(req.headers);

      // then
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });
  });
});
