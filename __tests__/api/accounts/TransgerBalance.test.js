import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountBalance from "../../../pages/page";
import "../../../__mocks__/localStorageMock";

jest.mock("axios", () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

beforeAll(() => {
  window.localStorage.setItem("token", "fake-token");
});

describe("AccountBalance Component", () => {
  beforeEach(async () => {
    render(<AccountBalance />);
  });

  it("transfers 10 amounts to savings and verifies the final balance", async () => {
    const transferAmountInput = screen.getByPlaceholderText("0.00");
    const toSavingsButton = screen.getByRole("button", { name: /To Savings/i });

    for (let i = 0; i < 10; i++) {
      await userEvent.type(transferAmountInput, "10");
      await userEvent.click(toSavingsButton);
      await userEvent.clear(transferAmountInput);
    }

    expect(screen.getByText(/Savings Account: \$/i)).toBeInTheDocument();
  });

  it("transfers 10 amounts to checking and verifies the final balance", async () => {
    const transferAmountInput = screen.getByPlaceholderText("0.00");
    const toCheckingButton = screen.getByRole("button", {
      name: /To Checking/i,
    });

    for (let i = 0; i < 10; i++) {
      await userEvent.type(transferAmountInput, "10");
      await userEvent.click(toCheckingButton);
      await userEvent.clear(transferAmountInput);
    }

    expect(screen.getByText(/Checking Account: \$/i)).toBeInTheDocument();
  });
});

afterAll(() => {
  window.localStorage.clear();
});
