import { render } from "@testing-library/react-native";

import App from "../App.js";

describe("Unit | App", () => {
  it("should display text", () => {
    // when
    const { getByText } = render(<App/>);

    // then
    expect(getByText("Hello world")).toBeTruthy();
  });
});
