import { render, waitFor } from "@testing-library/react-native";

import HomeScreen from "../../src/screens/HomeScreen.js";
import * as storage from "../../src/utils/storage.js";

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

// Mock storage module
jest.mock("../../src/utils/storage.js");

describe("Unit | HomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render hello world text when user is not admin or employer", async () => {
    // given - manager user token
    const managerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJUeXBlIjoibWFuYWdlciJ9.test";
    storage.getToken.mockResolvedValue(managerToken);

    // when
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    await waitFor(() => {
      expect(getByText("Hello world")).toBeTruthy();
      expect(queryByText("Enregistrer mon humeur")).toBeNull();
    });
  });

  it("should render mood entry button when user is admin", async () => {
    // given - admin user token
    const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJUeXBlIjoiYWRtaW4ifQ.test";
    storage.getToken.mockResolvedValue(adminToken);

    // when
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    await waitFor(() => {
      expect(getByText("Enregistrer mon humeur")).toBeTruthy();
      expect(queryByText("Hello world")).toBeNull();
    });
  });

  it("should render mood entry button when user is employer", async () => {
    // given - employer user token
    const employerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJUeXBlIjoiZW1wbG95ZXIifQ.test";
    storage.getToken.mockResolvedValue(employerToken);

    // when
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    await waitFor(() => {
      expect(getByText("Enregistrer mon humeur")).toBeTruthy();
      expect(queryByText("Hello world")).toBeNull();
    });
  });

  it("should render hello world when no token is available", async () => {
    // given
    storage.getToken.mockResolvedValue(null);

    // when
    const { getByText, queryByText } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    await waitFor(() => {
      expect(getByText("Hello world")).toBeTruthy();
      expect(queryByText("Enregistrer mon humeur")).toBeNull();
    });
  });
});
