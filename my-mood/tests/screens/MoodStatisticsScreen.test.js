import { render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

import MoodStatisticsScreen from "../../src/screens/MoodStatisticsScreen.js";
import * as apiAdapter from "../../src/adapters/api-adapter.js";
import * as storage from "../../src/utils/storage.js";

// Mock the API adapter
jest.mock("../../src/adapters/api-adapter.js", () => ({
  getMoodStatistics: jest.fn(),
}));

// Mock the storage utilities
jest.mock("../../src/utils/storage.js", () => ({
  getBaseUrl: jest.fn(),
  getToken: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, "alert");

describe("Unit | MoodStatisticsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getBaseUrl.mockResolvedValue("http://localhost:3000");
    storage.getToken.mockResolvedValue("fake-token");
  });

  it("should show loading indicator initially", () => {
    // given
    apiAdapter.getMoodStatistics.mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    // when
    const { getByTestId } = render(<MoodStatisticsScreen />);

    // then
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });

  it("should display statistics when data is loaded successfully", async () => {
    // given
    const mockStatistics = {
      HAPPY: { percentage: 50, averageMotivation: 8 },
      SAD: { percentage: 25, averageMotivation: 4 },
      ANGRY: { percentage: 10, averageMotivation: 3 },
      RELAXED: { percentage: 10, averageMotivation: 7 },
      EXCITED: { percentage: 5, averageMotivation: 9 },
    };
    apiAdapter.getMoodStatistics.mockResolvedValue({
      success: true,
      data: mockStatistics,
    });

    // when
    const { getByText } = render(<MoodStatisticsScreen />);

    // then
    await waitFor(() => {
      expect(getByText("Statistiques du jour")).toBeTruthy();
      expect(getByText("😊 Heureux")).toBeTruthy();
      expect(getByText("😢 Triste")).toBeTruthy();
    });
  });

  it("should show error message when data fails to load", async () => {
    // given
    apiAdapter.getMoodStatistics.mockResolvedValue({
      success: false,
      message: "Erreur de connexion",
    });

    // when
    render(<MoodStatisticsScreen />);

    // then
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Erreur", "Erreur de connexion");
    });
  });

  it("should show error message when no statistics are available", async () => {
    // given
    apiAdapter.getMoodStatistics.mockResolvedValue({
      success: true,
      data: null,
    });

    // when
    const { getByText } = render(<MoodStatisticsScreen />);

    // then
    await waitFor(() => {
      expect(getByText("Aucune statistique disponible")).toBeTruthy();
    });
  });
});
