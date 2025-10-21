import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import { checkApiIsOk, getUserInfo } from "@/adapters/api-adapter.js";
import App from "@/App.vue";

vi.mock("@/adapters/api-adapter.js", () => ({
  checkApiIsOk: vi.fn(),
  getUserInfo: vi.fn(),
}));

// Mock vue-router to provide useRoute/useRouter used in the component setup
vi.mock("vue-router", () => ({
  useRoute: vi.fn(() => ({ path: "/" })),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

describe("App", () => {
  it("renders RouterView when API is active", async () => {
    // given
    checkApiIsOk.mockResolvedValue(true);
    getUserInfo.mockResolvedValue({ username: "testuser" });
    // when
    const wrapper = mount(App, {
      global: {
        components: {
          RouterView: { template: "<div>RouterView content</div>" },
        },
      },
    });
    await new Promise(r => setTimeout(r));
    // then
    expect(wrapper.html()).toContain("RouterView content");
  });

  it("renders nothing when API is not active", async () => {
    // given
    checkApiIsOk.mockResolvedValue(false);
    // when
    const wrapper = mount(App, {
      global: {
        components: {
          RouterView: { template: "<div>RouterView content</div>" },
        },
      },
    });
    await new Promise(r => setTimeout(r));
    // then
    expect(wrapper.html()).not.toContain("RouterView content");
  });
});
