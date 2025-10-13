import request from "supertest";
import { describe, expect, it } from "vitest";

import server from "../../../../server.js";

describe("Acceptance | Shared | Routes | Health route", () => {
  describe("GET /api/health", () => {
    it("should return 200 http status code and message", async () => {
      // given
      const message = "api is ok!";

      // when
      const response = await request(server).get("/api/health");

      // then
      expect(response.status).toBe(200);
      expect(response.text).toBe(message);
    });
  });
});
