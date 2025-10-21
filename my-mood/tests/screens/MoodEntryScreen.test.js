import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import MoodEntryScreen from "../../src/screens/MoodEntryScreen.js";

// Mock the adapters and storage
jest.mock("../../src/adapters/api-adapter.js");
jest.mock("../../src/utils/storage.js");

const mockSaveMood = jest.fn();
const mockGetBaseUrl = jest.fn();
const mockGetToken = jest.fn();

// Import the mocked modules
const apiAdapter = require("../../src/adapters/api-adapter.js");
const storage = require("../../src/utils/storage.js");

apiAdapter.saveMood = mockSaveMood;
storage.getBaseUrl = mockGetBaseUrl;
storage.getToken = mockGetToken;

describe("Unit | MoodEntryScreen", () => {
  const mockNavigation = { navigate: jest.fn(), goBack: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, "alert");
    mockGetBaseUrl.mockResolvedValue("https://example.com");
    mockGetToken.mockResolvedValue("test-token");
  });

  afterEach(() => {
    Alert.alert.mockRestore();
  });

  it("should render mood entry screen with emotions and motivation slider", () => {
    // when
    const { getByText, getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Comment vous sentez-vous aujourd'hui ?")).toBeTruthy();
    expect(getByText("Sélectionnez votre émotion :")).toBeTruthy();
    expect(getByText("😊 Heureux")).toBeTruthy();
    expect(getByText("😢 Triste")).toBeTruthy();
    expect(getByText("😠 En colère")).toBeTruthy();
    expect(getByText("😌 Détendu")).toBeTruthy();
    expect(getByText("😃 Excité")).toBeTruthy();
    expect(getByText("Niveau de motivation (1-10) :")).toBeTruthy();
    expect(getByTestId("motivation-slider")).toBeTruthy();
    expect(getByTestId("motivation-value")).toBeTruthy();
    expect(getByTestId("save-button")).toBeTruthy();
    expect(getByTestId("cancel-button")).toBeTruthy();
  });

  it("should allow selecting an emotion", () => {
    // given
    const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    const happyButton = getByTestId("emotion-happy");
    fireEvent.press(happyButton);

    // then
    expect(happyButton).toBeTruthy();
  });

  it("should allow selecting a motivation level using slider", () => {
    // given
    const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    const slider = getByTestId("motivation-slider");
    fireEvent(slider, "valueChange", 8);

    // then
    expect(slider).toBeTruthy();
    expect(getByTestId("motivation-value")).toHaveTextContent("8");
  });

  it("should show error alert when trying to save without selecting emotion", async () => {
    // given
    const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when - motivation has default value of 5, so only select save
    fireEvent.press(getByTestId("save-button"));

    // then
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Veuillez sélectionner une émotion");
    });
  });

  it("should save mood and navigate to Home on successful save", async () => {
    // given
    mockSaveMood.mockResolvedValue({ success: true });
    const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("emotion-happy"));
    fireEvent(getByTestId("motivation-slider"), "valueChange", 8);
    fireEvent.press(getByTestId("save-button"));

    // then
    await waitFor(() => {
      expect(mockSaveMood).toHaveBeenCalledWith({
        baseUrl: "https://example.com",
        token: "test-token",
        emotionalState: "happy",
        motivation: 8,
      });
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Succès",
        "Votre humeur a été enregistrée",
        [{ text: "OK", onPress: expect.any(Function) }],
      );
    });
  });

  it("should show error alert when save fails", async () => {
    // given
    mockSaveMood.mockResolvedValue({ success: false, message: "Server error" });
    const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("emotion-happy"));
    fireEvent(getByTestId("motivation-slider"), "valueChange", 8);
    fireEvent.press(getByTestId("save-button"));

    // then
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Server error");
    });
  });

  it("should navigate back when cancel button is pressed", () => {
    // given
    const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    fireEvent.press(getByTestId("cancel-button"));

    // then
    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it("should have proper accessibility attributes for emotion buttons", () => {
    // given
    const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    const emotionButton = getByTestId("emotion-happy");

    // then
    expect(emotionButton.props.accessible).toBe(true);
    expect(emotionButton.props.accessibilityRole).toBe("radio");
  });

  it("should have proper accessibility attributes for motivation slider", () => {
    // given
    const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);

    // when
    const slider = getByTestId("motivation-slider");

    // then
    expect(slider.props.accessible).toBe(true);
    expect(slider.props.accessibilityRole).toBe("adjustable");
    expect(slider.props.accessibilityLabel).toBe("Niveau de motivation");
  });
});
