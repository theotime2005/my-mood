import { render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import LoginScreen from "../../src/screens/LoginScreen.js";
import * as apiAdapter from "../../src/adapters/api-adapter.js";
import * as storage from "../../src/utils/storage.js";

jest.mock("../../src/adapters/api-adapter.js");
jest.mock("../../src/utils/storage.js");
// Mock the user context so LoginScreen can call useUser() in tests
jest.mock("../../src/contexts/UserContext.js", () => ({
  useUser: jest.fn(),
}));

describe("Unit | LoginScreen", () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert");
    storage.getBaseUrl.mockResolvedValue("https://example.com");
    // Provide a default implementation for useUser() mock
    const { useUser } = require("../../src/contexts/UserContext.js");
    useUser.mockReturnValue({ refreshUser: jest.fn() });
  });

  it("should render login screen", () => {
    // when
    const { getByText, getByPlaceholderText } = render(<LoginScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Connexion")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Mot de passe")).toBeTruthy();
    expect(getByText("Se connecter")).toBeTruthy();
  });
});
