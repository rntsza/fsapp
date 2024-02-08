import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountBalance from "../../../pages/page";
import "../../../__mocks__/localStorageMock";

jest.mock("axios");

beforeAll(() => {
  window.localStorage.setItem("token", "fake-token");
});

describe("AccountBalance Component", () => {
  it("displays error when transfer Savings amount is invalid", async () => {
    render(<AccountBalance />);

    const transferButtonSavings = screen.getByRole("button", {
      name: /To Savings/i,
    });
    userEvent.click(transferButtonSavings);

    await waitFor(() => {
      expect(screen.getByText(/🥺 Enter a valid amount/i)).toBeInTheDocument();
    });
  });

  it("displays error when transfer Checkings amount is invalid", async () => {
    render(<AccountBalance />);

    const transferButtonChecking = screen.getByRole("button", {
      name: /To Checking/i,
    });
    userEvent.click(transferButtonChecking);

    await waitFor(() => {
      expect(screen.getByText(/🥺 Enter a valid amount/i)).toBeInTheDocument();
    });
  });
});

afterAll(() => {
  window.localStorage.clear();
});
