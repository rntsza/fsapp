"use client"
import { FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

  export default function AccountBalance() {
    const [checkingAmount, setCheckingAmount] = useState(0);
    const [savingsAmount, setSavingsAmount] = useState(0);
    const [transferAmount, setTransferAmount] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const [userData, setUserData] = useState({} as { name?: string, checkingsBalance?: number, savingsBalance?: number } | null);;

    useEffect(() => {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return router.push('/login');;
        }
  
        try {
          const response = await axios.get('api/users/userData', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (response.data) {
            setUserData(response?.data?.user);
            setCheckingAmount(response?.data?.user?.checkingsBalance);
            setSavingsAmount(response?.data?.user?.savingsBalance);
          }
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      };
  
      fetchUserData();
    }, [router]);
  
    // const initializeAccounts = (event: FormEvent<HTMLFormElement>) => {
    //   event.preventDefault();
    //   const target = event.target as typeof event.target & {
    //     checkingInitial: { value: string };
    //     savingsInitial: { value: string };
    //   };
    //   const initialChecking = parseFloat(target.checkingInitial.value) || 0;
    //   const initialSavings = parseFloat(target.savingsInitial.value) || 0;
    //   setCheckingAmount(initialChecking);
    //   setSavingsAmount(initialSavings);
    //   setMessage('Accounts initialized successfully.');
    // };
  
    const handleTransferToSavings = () => {
      const amount = parseFloat(transferAmount);
      if (!amount || amount <= 0) {
        setMessage('Enter a valid amount');
        return;
      }
      if (amount > checkingAmount) {
        setMessage('Insufficient funds in checking account');
        return;
      }
      setCheckingAmount(prev => prev - amount);
      setSavingsAmount(prev => prev + amount);
      setMessage(`Successfully transferred $${amount} to savings`);
      setTransferAmount('');
    };
  
    const handleTransferToChecking = () => {
      const amount = parseFloat(transferAmount);
      if (!amount || amount <= 0) {
        setMessage('Enter a valid amount');
        return;
      }
      if (amount > savingsAmount) {
        setMessage('Insufficient funds in savings account');
        return;
      }
      setSavingsAmount(prev => prev - amount);
      setCheckingAmount(prev => prev + amount);
      setMessage(`Successfully transferred $${amount} to checking`);
      setTransferAmount('');
    };

    function handleLogoff() {
      localStorage.clear();
      return router.push('/login');
    }

  return (
    <>
      <div className="bg-gray-100 p-8 min-h-screen flex items-center justify-center">
      <div className="absolute top-4 right-4">
        <button onClick={handleLogoff} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"> Logoff </button>
      </div>
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden p-5">
          <h2 className="text-lg font-semibold text-gray-700">{userData?.name}&apos;s Account Balances</h2>
          {/* <form onSubmit={initializeAccounts} className="mt-4">
            <div className="mb-4">
              <label htmlFor="checkingInitial" className="block text-gray-700">Initial Checking Amount</label>
              <input type="number" id="checkingInitial" name="checkingInitial" placeholder="Enter initial amount" className="text-gray-400 mt-1 p-2 w-full border rounded-md"/>
            </div>
            <div className="mb-4">
              <label htmlFor="savingsInitial" className="block text-gray-700">Initial Savings Amount</label>
              <input type="number" id="savingsInitial" name="savingsInitial" placeholder="Enter initial amount" className="text-gray-400 mt-1 p-2 w-full border rounded-md"/>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Initialize</button>
          </form> */}
          {message && <p className="mt-4 text-center text-red-500">{message}</p>}
          {(checkingAmount !== null && savingsAmount !== null) && (
            <>
              <h2 className="text-lg font-semibold text-gray-700 mt-6">Account Balances</h2>
              <p className="text-gray-600">Checking Account: ${checkingAmount.toFixed(2)}</p>
              <p className="text-gray-600">Savings Account: ${savingsAmount.toFixed(2)}</p>
              <div className="mt-4">
                <label htmlFor="transferAmount" className="block text-gray-700">Transfer Amount</label>
                <input type="number" id="transferAmount" name="transferAmount" placeholder="0.00" className="text-gray-400 mt-1 p-2 w-full border rounded-md" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)}/>
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
