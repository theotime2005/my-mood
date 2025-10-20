import { decodeToken } from "../../src/utils/token.js";

describe("Unit | Token Utility", () => {
  it("should decode a valid JWT token", () => {
    // given
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJUeXBlIjoiYWRtaW4ifQ.test";

    // when
    const decoded = decodeToken(token);

    // then
    expect(decoded).toEqual({
      userId: 1,
      userType: "admin",
    });
  });

  it("should return null for invalid token", () => {
    // given
    const invalidToken = "invalid.token";

    // when
    const decoded = decodeToken(invalidToken);

    // then
    expect(decoded).toBeNull();
  });

  it("should return null for null token", () => {
    // when
    const decoded = decodeToken(null);

    // then
    expect(decoded).toBeNull();
  });

  it("should return null for undefined token", () => {
    // when
    const decoded = decodeToken(undefined);

    // then
    expect(decoded).toBeNull();
  });
});
