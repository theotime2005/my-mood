import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import { checkApiIsOk } from "@/adapters/api-adapter.js";
import App from "@/App.vue";

vi.mock("@/adapters/api-adapter.js", () => ({
  checkApiIsOk: vi.fn(),
}));
// Do not mock vue-router here; we'll stub the router-view when mounting the component.

describe("App", () => {
  it("renders RouterView when API is active", async () => {
    // given
    checkApiIsOk.mockResolvedValue(true);
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

describe("Sanity check", () => {
  it("should run this test", () => {
    expect(1).toBe(1);
  });
});
