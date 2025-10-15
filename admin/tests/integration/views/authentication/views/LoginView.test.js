import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import { loginUser } from "@/adapters/api-adapter.js";
import { ERRORS } from "@/constants.js";
import LoginView from "@/views/authentication/LoginView.vue";

vi.mock("@/adapters/api-adapter.js", () => ({
  loginUser: vi.fn(),
}));
vi.mock("@/utils/storage.js", () => ({
  saveLogin: vi.fn(),
}));



describe("LoginView", () => {
  it("renders login form", () => {
    // when
    const wrapper = mount(LoginView, {
      global: {
        stubs: ["router-link"],
      },
    });

    // then
    expect(wrapper.find("h1").text()).toBe("Connexion");
    expect(wrapper.find("input[type=\"email\"]").exists()).toBe(true);
    expect(wrapper.find("input[type=\"password\"]").exists()).toBe(true);
    expect(wrapper.find("button[type=\"submit\"]").text()).toBe("Se connecter");
  });

  it("shows error message on failed login", async () => {
    // given
    loginUser.mockResolvedValueOnce({ error: ERRORS.INVALID_CREDENTIALS });

    // when
    const wrapper = mount(LoginView, {
      global: {
        stubs: ["router-link"],
      },
    });
    await wrapper.find("input[type=\"email\"]").setValue("test@example.com");
    await wrapper.find("input[type=\"password\"]").setValue("wrongpass");
    await wrapper.find("form").trigger("submit.prevent");
    await wrapper.vm.$nextTick();
    // then
    expect(wrapper.find(".error-message").text()).toBe("Invalid credentials");
  });
});

