import { beforeEach, describe, expect, it } from "vitest";

import * as storage from "@/utils/storage.js";

const LOGIN_STORAGE = "my-mood-login";

describe("Integration | Utils | storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should store and retrieve the token using saveLogin and getLogin", () => {
    // given
    const token = "integrationToken";
    // when
    storage.saveLogin(token);
    const result = storage.getLogin();
    // then
    expect(result).toBe(token);
    expect(localStorage.getItem(LOGIN_STORAGE)).toBe(token);
  });

  it("should remove the token after saveLogin and removeLogin", () => {
    // given
    const token = "integrationToken";
    storage.saveLogin(token);
    // when
    storage.removeLogin();
    // then
    expect(localStorage.getItem(LOGIN_STORAGE)).toBeNull();
    expect(storage.getLogin()).toBeNull();
  });
});
