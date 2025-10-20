import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import MoodEntryScreen from "../../src/screens/MoodEntryScreen.js";
import * as apiAdapter from "../../src/adapters/api-adapter.js";
import * as storage from "../../src/utils/storage.js";

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

// Mock Alert
jest.spyOn(Alert, "alert");

// Mock modules
jest.mock("../../src/adapters/api-adapter.js");
jest.mock("../../src/utils/storage.js");

describe("Unit | MoodEntryScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getBaseUrl.mockResolvedValue("http://localhost:3000");
    storage.getToken.mockResolvedValue("fake-token");
  });

  it("should render mood entry form", () => {
    // when
    const { getByText } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Comment vous sentez-vous ?")).toBeTruthy();
    expect(getByText("Sélectionnez votre émotion :")).toBeTruthy();
    expect(getByText("Joyeux")).toBeTruthy();
    expect(getByText("Triste")).toBeTruthy();
    expect(getByText("En colère")).toBeTruthy();
    expect(getByText("Détendu")).toBeTruthy();
    expect(getByText("Excité")).toBeTruthy();
    expect(getByText("Niveau de motivation (1-10) :")).toBeTruthy();
    expect(getByText("Enregistrer")).toBeTruthy();
  });

  it("should show error when saving without selecting emotion", async () => {
    // given
    const { getByText } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByText("Enregistrer"));

    // then
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Veuillez sélectionner une émotion");
    });
  });

  it("should submit mood successfully and navigate to home", async () => {
    // given
    apiAdapter.submitMood.mockResolvedValue({ success: true });
    const { getByText } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByText("Joyeux"));
    fireEvent.press(getByText("7"));
    fireEvent.press(getByText("Enregistrer"));

    // then
    await waitFor(() => {
      expect(apiAdapter.submitMood).toHaveBeenCalledWith({
        baseUrl: "http://localhost:3000",
        token: "fake-token",
        emotionalState: "happy",
        motivation: 7,
      });
    });

    // Simulate pressing OK on success alert
    const alertCall = Alert.alert.mock.calls.find(call => call[0] === "Succès");
    expect(alertCall).toBeTruthy();
    const okButton = alertCall[2].find(button => button.text === "OK");
    okButton.onPress();

    expect(mockNavigate).toHaveBeenCalledWith("Home");
  });

  it("should show error when mood submission fails", async () => {
    // given
    apiAdapter.submitMood.mockResolvedValue({ 
      success: false, 
      message: "Erreur serveur" 
    });
    const { getByText } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByText("Triste"));
    fireEvent.press(getByText("Enregistrer"));

    // then
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Erreur serveur");
    });
  });

  it("should allow selecting different emotions and motivation levels", () => {
    // given
    const { getByText } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when - select an emotion
    fireEvent.press(getByText("En colère"));
    
    // when - select a motivation level
    fireEvent.press(getByText("10"));

    // then - no errors should occur
    expect(getByText("En colère")).toBeTruthy();
    expect(getByText("10")).toBeTruthy();
  });
});
