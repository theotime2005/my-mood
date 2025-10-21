import { describe, expect, it, vi } from "vitest";

import {
  checkApiIsOk,
  getAllUsers,
  getUserInfo,
  loginUser,
  updateUserType,
} from "@/adapters/api-adapter.js";
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

  describe("getAllUsers", () => {
    it("returns data array when status is 200", async () => {
      const data = [{ id: 1, name: "A" }];
      global.fetch.mockResolvedValueOnce({ status: 200, json: async () => ({ data }) });
      const res = await getAllUsers("token");
      expect(res).toEqual(data);
      expect(global.fetch).toHaveBeenCalledWith("/api/users", expect.objectContaining({ method: "GET" }));
    });

    it("returns null when status is not 200", async () => {
      global.fetch.mockResolvedValueOnce({ status: 404 });
      const res = await getAllUsers("token");
      expect(res).toBeNull();
    });

    it("returns null when fetch throws", async () => {
      global.fetch.mockRejectedValueOnce(new Error("network"));
      const res = await getAllUsers("token");
      expect(res).toBeNull();
    });
  });

  describe("#updateUserType", () => {
    it("returns true when request is successful (status 200)", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValueOnce({ status: 200 });

      // when
      const res = await updateUserType({ userId: 1, token: "token", userType: "admin" });

      // then
      expect(res).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith("/api/users/1/user-type", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          from: "management",
          Authorization: "Bearer token",
        },
        body: JSON.stringify({ userType: "admin" }),
      });
    });

    it("returns false when request status is not 200", async () => {
      // given
      global.fetch.mockResolvedValueOnce({ status: 400 });

      // when
      const res = await updateUserType({ userId: 2, token: "token", userType: "user" });

      // then
      expect(res).toBe(false);
    });

    it("returns false when fetch throws", async () => {
      // given
      global.fetch.mockRejectedValueOnce(new Error("network"));

      // when
      const res = await updateUserType({ userId: 3, token: "token", userType: "user" });

      // then
      expect(res).toBe(false);
    });
  });

  describe("#getUserInfo", () => {
    it("should return data", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        status: 200,
        json: vi.fn().mockResolvedValue({
          data: {
            firstname: "John",
            lastname: "Doe",
            email: "john@example.net",
            userType: "admin",
          },
        }),
      });

      // when
      const result = await getUserInfo("abcd");

      // then
      expect(global.fetch).toHaveBeenCalledWith("/api/user", {
        method: "GET",
        headers: { from: "management", Authorization: "Bearer abcd" },
      });
      expect(result).toEqual({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.net",
        userType: "admin",
      });

    });
  });
});
