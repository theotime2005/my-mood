import { render } from "@testing-library/react-native";

import App from "../App.js";
import * as storage from "../src/utils/storage.js";

jest.mock("../src/utils/storage.js");
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    NavigationContainer: ({ children }) => children,
  };
});

describe("Unit | App", () => {
  it("should render loading indicator initially", () => {
    // given
    storage.getBaseUrl.mockResolvedValue(null);
    storage.getToken.mockResolvedValue(null);

    // when
    const { getByTestId } = render(<App/>);

    // then
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("should handle storage errors gracefully", async () => {
    // given
    storage.getBaseUrl.mockRejectedValue(new Error("Storage error"));
    storage.getToken.mockRejectedValue(new Error("Storage error"));

    // when - the app should not crash
    const { getByTestId } = render(<App/>);

    // then
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
});
