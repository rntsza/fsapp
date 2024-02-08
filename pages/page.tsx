"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AccountBalance() {
  const [transferAmount, setTransferAmount] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const response = await axios.get("/api/users/userData", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  };

  const {
    data: userData,
    isError,
    error,
  } = useQuery("userData", fetchUserData, {
    onSuccess: (data) => {
    },
    onError: (error) => {
      console.error("Failed to fetch user data", error);
      router.push("/");
    },
  });

  if (isError) {
    console.error(error);
    toast.error("Failed to fetch user data");
  }

  type UpdateBalanceArgs = {
    newCheckingAmount: number;
    newSavingsAmount: number;
  };
  const updateAccountBalances = useMutation(async (args: UpdateBalanceArgs) => {
    const { newCheckingAmount, newSavingsAmount } = args;
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.patch(
        "/api/users/patch",
        {
          id: userData?.id,
          checkingsBalance: newCheckingAmount,
          savingsBalance: newSavingsAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("userData");
        toast.success("🥳 Account balances updated successfully.");
      },
      onError: (error) => {
        console.error("Failed to update account balances", error);
        toast.error("Failed to update account balances. Please try again.");
      },
    }
  );

  const handleTransferToSavings = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast.error("🥺 Enter a valid amount");
      return;
    }
    if (amount > userData?.checkingsBalance) {
      toast.error("😖 Insufficient funds in checking account");
      return;
    }
    const newCheckingAmount = userData?.checkingsBalance - amount;
    const newSavingsAmount = userData?.savingsBalance + amount;

    updateAccountBalances.mutate({ newCheckingAmount, newSavingsAmount});

    setTransferAmount("");
  };

  const handleTransferToChecking = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast.error("🥺 Enter a valid amount");
      return;
    }
    if (amount > userData?.savingsBalance) {
      toast.error("😖 Insufficient funds in savings account");
      return;
    }
    const newSavingsAmount = userData?.savingsBalance - amount;
    const newCheckingAmount = userData?.checkingsBalance + amount;

    updateAccountBalances.mutate({ newCheckingAmount, newSavingsAmount });
    setTransferAmount("");
  };

  const handleLogoff = () => {
    localStorage.clear();
    return router.push("/");
  };

  return (
    <>
    <ToastContainer />
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundImage: "linear-gradient(to right, #000000, #0a0f0b, #003d33)" }}
      >
        <div className="absolute bottom-4 right-4">
          <button onClick={handleLogoff} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Logoff</button>
        </div>
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            {userData?.name}&apos;s Account Balances
          </h2>
          {(userData?.checkingsBalance !== undefined && userData?.savingsBalance !== undefined) && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 mt-6">Account Balances</h2>
              <p className="text-gray-600">Checking Account: ${userData.checkingsBalance.toFixed(2)}</p>
              <p className="text-gray-600">Savings Account: ${userData.savingsBalance.toFixed(2)}</p>
              <div className="mt-4">
                <label htmlFor="transferAmount" className="block text-gray-700">Transfer Amount</label>
                <input
                  type="number"
                  id="transferAmount"
                  name="transferAmount"
                  placeholder="0.00"
                  className="text-gray-400 mt-1 p-2 w-full border rounded-md"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                />
                <div className="flex justify-between mt-4">
                  <button onClick={handleTransferToSavings} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">To Savings</button>
                  <button onClick={handleTransferToChecking} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">To Checking</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
