import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/adapters/api-adapter.js", () => ({
  getAllUsers: vi.fn(),
  updateUserType: vi.fn(),
}));
vi.mock("@/utils/storage.js", () => ({
  getLogin: vi.fn(),
}));

import { getAllUsers, updateUserType } from "@/adapters/api-adapter.js";
import { USER_TYPE } from "@/constants";
import { getLogin } from "@/utils/storage.js";
import UsersView from "@/views/users/UsersView.vue";

describe("UsersView", () => {
  it("renders users table when users exist", async () => {
    // given
    getAllUsers.mockResolvedValueOnce([
      {
        id: "1",
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        userType: USER_TYPE.EMPLOYER,
      },
    ]);
    getLogin.mockReturnValue("token-123");

    // when
    const wrapper = mount(UsersView, {
      global: {
        stubs: ["router-link"],
      },
    });

    // wait for onMounted async
    await new Promise((r) => setTimeout(r, 0));

    // then
    expect(wrapper.find("h1").text()).toBe("Gestion des utilisateurs");
    expect(wrapper.find("table[aria-label=\"Liste des utilisateurs\"]").exists()).toBe(true);

    const row = wrapper.find("tbody tr");
    const tds = row.findAll("td");
    expect(tds[0].text()).toBe("John");
    expect(tds[1].text()).toBe("Doe");
    expect(tds[2].text()).toBe("john@example.com");
    expect(tds[3].text()).toBe(USER_TYPE.EMPLOYER);

    // select initial value
    const select = row.find("select");
    expect(select.element.value).toBe(USER_TYPE.EMPLOYER);
  });

  it("calls updateUserType and updates the UI when role is changed", async () => {
    // given
    getAllUsers.mockResolvedValueOnce([
      {
        id: "1",
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        userType: USER_TYPE.EMPLOYER,
      },
    ]);
    getLogin.mockReturnValue("token-123");
    updateUserType.mockResolvedValueOnce(true);

    const wrapper = mount(UsersView, {
      global: {
        stubs: ["router-link"],
      },
    });

    // wait for onMounted async
    await new Promise((r) => setTimeout(r, 0));

    const row = wrapper.find("tbody tr");

    // change select value
    const select = row.find("select");
    await select.setValue(USER_TYPE.MANAGER);

    // click update
    const button = row.find("button.update-button");
    await button.trigger("click");

    // wait for updateUserType to resolve and DOM to update
    await new Promise((r) => setTimeout(r, 0));

    expect(updateUserType).toHaveBeenCalledWith({ userId: "1", token: "token-123", userType: USER_TYPE.MANAGER });

    const tds = row.findAll("td");
    expect(tds[3].text()).toBe(USER_TYPE.MANAGER);
  });
});
