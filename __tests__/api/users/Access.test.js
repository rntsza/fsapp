import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Login from "../../../pages/index";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockImplementation(() => ({ push: jest.fn() })),
}));

jest.mock("axios");

describe("Login Page", () => {
  it("allows the user to log in", async () => {
    axios.post.mockResolvedValue({ data: { token: "fake-token" } });

    render(<Login />);

    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "jesttest@jesttest.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Password"), "jesttest");

    userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/login/auth", {
        email: "jesttest@jesttest.com",
        password: "jesttest",
      });
    });
  });

  it("displays an error message for user not found", async () => {
    axios.post.mockRejectedValue({
      response: {
        status: 404,
        data: { message: "User not found" },
      },
    });

    render(<Login />);

    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "wronguser@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Password"),
      "wrongpassword"
    );
    userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/🙁 User not found./i)).toBeInTheDocument();
    });
  });

  it("displays an error message when the API is down or unreachable", async () => {
    axios.post.mockRejectedValue(new Error("Network error or API is down"));

    render(<Login />);

    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "user@example.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Password"), "password");
    userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred. please try again later./i)
      ).toBeInTheDocument();
    });
  });

  it("prevents login attempt without filling required fields", async () => {
    render(<Login />);

    userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Email and password are required/i)
      ).toBeInTheDocument();
    });
  });
});
