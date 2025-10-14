import { render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import WelcomeScreen from "../../src/screens/WelcomeScreen.js";
import * as apiAdapter from "../../src/adapters/api-adapter.js";
import * as storage from "../../src/utils/storage.js";

jest.mock("../../src/adapters/api-adapter.js");
jest.mock("../../src/utils/storage.js");

describe("Unit | WelcomeScreen", () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert");
  });

  it("should render welcome screen", () => {
    // when
    const { getByText, getByPlaceholderText } = render(<WelcomeScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Bienvenue sur My Mood")).toBeTruthy();
    expect(getByPlaceholderText("https://example.com")).toBeTruthy();
    expect(getByText("Continuer")).toBeTruthy();
  });
});
