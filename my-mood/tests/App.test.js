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
  it("should render without crashing", async () => {
    // given
    storage.getBaseUrl.mockResolvedValue(null);
    storage.getToken.mockResolvedValue(null);

    // when
    const component = render(<App/>);

    // then
    expect(component).toBeTruthy();
  });
});
