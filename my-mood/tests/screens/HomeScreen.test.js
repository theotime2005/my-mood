import { render } from "@testing-library/react-native";

import HomeScreen from "../../src/screens/HomeScreen.js";

describe("Unit | HomeScreen", () => {
  it("should render home screen with hello world text", () => {
    // when
    const { getByText } = render(<HomeScreen />);

    // then
    expect(getByText("Hello world")).toBeTruthy();
  });
});
