import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import Login from "../../../pages/index";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
    route: "/",
    pathname: "",
    query: {},
    asPath: "",
  })),
}));

describe("Login Page", () => {
  it("renders login and create account inputs correctly", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    userEvent.click(screen.getByText("Create an account"));
  });
});
