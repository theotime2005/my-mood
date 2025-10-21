import { fireEvent, render } from "@testing-library/react-native";

import HomeScreen from "../../src/screens/HomeScreen.js";
import * as UserContext from "../../src/contexts/UserContext.js";

// Mock the useUser hook
jest.mock("../../src/contexts/UserContext.js", () => ({
  useUser: jest.fn(),
}));

describe("Unit | HomeScreen", () => {
  const mockNavigation = { navigate: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render home screen with hello world text when user is not admin or employer", () => {
    // given
    UserContext.useUser.mockReturnValue({
      user: { firstname: "John", userType: "manager" },
      loading: false,
    });

    // when
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Hello world")).toBeTruthy();
  });

  it("should render home screen with hello world text when user is null", () => {
    // given
    UserContext.useUser.mockReturnValue({ user: null, loading: false });

    // when
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByText("Hello world")).toBeTruthy();
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

  it("should show loading indicator while loading", () => {
    // given
    UserContext.useUser.mockReturnValue({ user: null, loading: true });

    // when
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);

    // then
    expect(getByTestId("loading-indicator")).toBeTruthy();
  });
});
