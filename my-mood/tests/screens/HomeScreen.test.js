import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import HomeScreen from "../../src/screens/HomeScreen.js";
import * as UserContext from "../../src/contexts/UserContext.js";
import * as storage from "../../src/utils/storage.js";

// Mock the useUser hook
jest.mock("../../src/contexts/UserContext.js", () => ({
  useUser: jest.fn(),
}));

// Mock the storage utilities
jest.mock("../../src/utils/storage.js", () => ({
  deleteToken: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, "alert");

describe("Unit | HomeScreen", () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render both mood entry and statistics buttons when user is manager", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "John", userType: "manager" },
      loading: false,
    });

    // when
    const { getByText, getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Bienvenue John !")).toBeTruthy();
    expect(getByTestId("mood-entry-button")).toBeTruthy();
    expect(getByTestId("mood-statistics-button")).toBeTruthy();
  });

  it("should render home screen with server error text when user is null", () => {
    // given
    UserContext.useUser.mockReturnValue({ user: null, loading: false });

    // when
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Impossible de joindre le serveur. Déconnectez-vous et réessayez.")).toBeTruthy();
  });

  it("should render mood entry button when user is admin", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Admin", userType: "admin" },
      loading: false,
    });

    // when
    const { getByText, getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Bienvenue Admin !")).toBeTruthy();
    expect(getByTestId("mood-entry-button")).toBeTruthy();
  });

  it("should render mood entry button when user is employer", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Employee", userType: "employer" },
      loading: false,
    });

    // when
    const { getByText, getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Bienvenue Employee !")).toBeTruthy();
    expect(getByTestId("mood-entry-button")).toBeTruthy();
  });

  it("should navigate to MoodEntry screen when button is pressed", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Admin", userType: "admin" },
      loading: false,
    });
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("mood-entry-button"));

    // then
    expect(mockNavigation.navigate).toHaveBeenCalledWith("MoodEntry");
  });

  it("should navigate to MoodStatistics screen when statistics button is pressed", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Manager", userType: "manager" },
      loading: false,
    });
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("mood-statistics-button"));

    // then
    expect(mockNavigation.navigate).toHaveBeenCalledWith("MoodStatistics");
  });

  it("should show loading indicator while loading", () => {
    // given
    UserContext.useUser.mockReturnValue({ user: null, loading: true });

    // when
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("should render user menu button", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Admin", userType: "admin" },
      loading: false,
    });

    // when
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByTestId("user-menu-button")).toBeTruthy();
  });

  it("should open user menu modal when user menu button is pressed", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Admin", userType: "admin" },
      loading: false,
    });
    const { getByTestId, getAllByText } = render(<HomeScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("user-menu-button"));

    // then
    expect(getAllByText("Menu utilisateur").length).toBeGreaterThan(0);
    expect(getByTestId("logout-button")).toBeTruthy();
    expect(getByTestId("close-menu-button")).toBeTruthy();
  });

  it("should close user menu modal when close button is pressed", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Admin", userType: "admin" },
      loading: false,
    });
    const { getByTestId, queryByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("user-menu-button"));
    expect(queryByTestId("logout-button")).toBeTruthy();
    fireEvent.press(getByTestId("close-menu-button"));

    // then - modal should be closed (buttons should not be accessible)
    expect(queryByTestId("logout-button")).toBeNull();
  });

  it("should show confirmation alert when logout button is pressed", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Admin", userType: "admin" },
      loading: false,
    });
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("user-menu-button"));
    fireEvent.press(getByTestId("logout-button"));

    // then
    expect(Alert.alert).toHaveBeenCalledWith(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      expect.arrayContaining([
        expect.objectContaining({ text: "Annuler", style: "cancel" }),
        expect.objectContaining({ text: "Déconnexion", style: "destructive" }),
      ]),
      expect.objectContaining({ cancelable: true })
    );
  });

  it("should delete token and navigate to Welcome screen when logout is confirmed", async () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "Admin", userType: "admin" },
      loading: false,
    });
    storage.deleteToken.mockResolvedValue();
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("user-menu-button"));
    fireEvent.press(getByTestId("logout-button"));

    // Get the logout confirmation handler and call it
    const alertCall = Alert.alert.mock.calls[0];
    const logoutButton = alertCall[2].find((button) => button.text === "Déconnexion");
    await logoutButton.onPress();

    // then
    await waitFor(() => {
      expect(storage.deleteToken).toHaveBeenCalled();
      expect(mockNavigation.navigate).toHaveBeenCalledWith("Welcome");
    });
  });
});
