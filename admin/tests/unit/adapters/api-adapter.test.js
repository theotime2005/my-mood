import { describe, expect, it, vi } from "vitest";

import { checkApiIsOk, loginUser } from "@/adapters/api-adapter.js";
import { ERRORS } from "@/constants.js";

describe("Unit | Adapters | API check", () => {
  describe("#loginUser", () => {
    it("should return data when request success", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        status: 200,
        json: vi.fn().mockResolvedValue({
          token: "someToken",
        }),
      });
      const loginData = { email: "email@example.net", password: "password123" };

      // when
      const result = await loginUser(loginData);

      // then
      expect(result).toEqual({ token: "someToken" });
      expect(global.fetch).toHaveBeenCalledWith("/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "from": "management",
        },
        body: JSON.stringify(loginData),
      });
    });

    it(`should return ${ERRORS.INVALID_CREDENTIALS} when credentials are invalid `, async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        status: 401,
      });
      const loginData = { email: "email@example.net", password: "password123" };

      // when
      const result = await loginUser(loginData);

      // then
      expect(result).toEqual({ error: ERRORS.INVALID_CREDENTIALS });
      expect(global.fetch).toHaveBeenCalledWith("/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "from": "management",
        },
        body: JSON.stringify(loginData),
      });
    });

    it(`should return ${ERRORS.API_ERROR} when fetch throws`, async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
      const loginData = { email: "email@example.net", password: "password123" };

      // when
      const result = await loginUser(loginData);

      // then
      expect(result).toEqual({ error: ERRORS.API_ERROR });
      expect(global.fetch).toHaveBeenCalledWith("/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "from": "management",
        },
        body: JSON.stringify(loginData),
      });
    });
  });

  describe("#checkApiIsOk", () => {
    it("should return true when API is healthy (status 200)", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ status: 200 });

      // when
      const result = await checkApiIsOk();

      // then
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith("/api/health");
    });

    it("should return false when API is not healthy (status != 200)", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ status: 500 });

      // when
      const result = await checkApiIsOk();

      // then
      expect(result).toBe(false);
      expect(global.fetch).toHaveBeenCalledWith("/api/health");
    });

    it("should return false when fetch throws", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await checkApiIsOk();

      // then
      expect(result).toBe(false);
      expect(global.fetch).toHaveBeenCalledWith("/api/health");
    });
  });
});
