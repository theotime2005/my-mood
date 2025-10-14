import { checkHealth, createHeaders, login } from "../../src/adapters/api-adapter.js";

global.fetch = jest.fn();

describe("Unit | API Adapter", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("createHeaders", () => {
    it("should create headers with from source", () => {
      // when
      const headers = createHeaders();

      // then
      expect(headers).toEqual({ from: "mymood" });
    });

    it("should merge additional headers with from source", () => {
      // when
      const headers = createHeaders({ "Content-Type": "application/json" });

      // then
      expect(headers).toEqual({
        from: "mymood",
        "Content-Type": "application/json",
      });
    });
  });

  describe("checkHealth", () => {
    it("should return true when API is healthy", async () => {
      // given
      fetch.mockResolvedValue({ ok: true });

      // when
      const result = await checkHealth("https://example.com");

      // then
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith("https://example.com/api/health", {
        method: "GET",
        headers: { from: "mymood" },
      });
    });

    it("should return false when API is not healthy", async () => {
      // given
      fetch.mockResolvedValue({ ok: false });

      // when
      const result = await checkHealth("https://example.com");

      // then
      expect(result).toBe(false);
    });

    it("should return false when fetch fails", async () => {
      // given
      fetch.mockRejectedValue(new Error("Network error"));

      // when
      const result = await checkHealth("https://example.com");

      // then
      expect(result).toBe(false);
    });
  });

  describe("login", () => {
    it("should return success with token when credentials are valid", async () => {
      // given
      const mockToken = "mock-token-123";
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ token: mockToken }),
      });

      // when
      const result = await login({baseUrl: "https://example.com", email:  "user@example.com", password: "password123"});

      // then
      expect(result).toEqual({ success: true, token: mockToken });
      expect(fetch).toHaveBeenCalledWith(
        "https://example.com/api/authentication/login",
        {
          method: "POST",
          headers: {
            from: "mymood",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "user@example.com", password: "password123" }),
        },
      );
    });

    it("should return error message when credentials are invalid", async () => {
      // given
      fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Invalid email or password" }),
      });

      // when
      const result = await login({baseUrl: "https://example.com", email: "user@example.com", password: "wrongpassword"});

      // then
      expect(result).toEqual({ success: false, message: "Invalid email or password" });
    });

    it("should return error message when fetch fails", async () => {
      // given
      fetch.mockRejectedValue(new Error("Network error"));

      // when
      const result = await login({baseUrl: "https://example.com", email: "user@example.com", password: "password123"});

      // then
      expect(result).toEqual({ success: false, message: "Erreur de connexion au serveur" });
    });
  });
});
