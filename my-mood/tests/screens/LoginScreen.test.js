import { render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import LoginScreen from "../../src/screens/LoginScreen.js";
import * as apiAdapter from "../../src/adapters/api-adapter.js";
import * as storage from "../../src/utils/storage.js";

jest.mock("../../src/adapters/api-adapter.js");
jest.mock("../../src/utils/storage.js");

describe("Unit | LoginScreen", () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert");
    storage.getBaseUrl.mockResolvedValue("https://example.com");
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
