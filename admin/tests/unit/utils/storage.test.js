import { beforeEach, describe, expect, it, vi } from "vitest";

import * as storage from "@/utils/storage.js";

const LOGIN_STORAGE = "my-mood-login";

describe("Unit | Utils | storage", () => {
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = (function() {
      let store = {};
      return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value + ""; }),
        removeItem: vi.fn((key) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; }),
      };
    })();
    global.localStorage = localStorageMock;
  });

  it("should store the token in localStorage when saveLogin is called", () => {
    // given
    const token = "token123";
    // when
    storage.saveLogin(token);
    // then
    expect(localStorage.setItem).toHaveBeenCalledWith(LOGIN_STORAGE, token);
  });

  it("should return the token from localStorage when getLogin is called", () => {
    // given
    localStorage.getItem.mockReturnValueOnce("token456");
    // when
    const token = storage.getLogin();
    // then
    expect(localStorage.getItem).toHaveBeenCalledWith(LOGIN_STORAGE);
    expect(token).toBe("token456");
  });

  it("should remove the token from localStorage when removeLogin is called", () => {
    // when
    storage.removeLogin();
    // then
    expect(localStorage.removeItem).toHaveBeenCalledWith(LOGIN_STORAGE);
  });
});
