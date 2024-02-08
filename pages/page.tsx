"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

  export default function AccountBalance() {
    const [checkingAmount, setCheckingAmount] = useState(0);
    const [savingsAmount, setSavingsAmount] = useState(0);
    const [transferAmount, setTransferAmount] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const [userData, setUserData] = useState({} as { name?: string, checkingsBalance?: number, savingsBalance?: number, id?: number, email?: string } | null);;

    useEffect(() => {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return router.push('/');;
        }
  
        try {
          const response = await axios.get('api/users/userData', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          if (response?.data) {
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
    
    const updateAccountBalances = async (newCheckingAmount: number, newSavingsAmount: number) => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setMessage('Authentication error. Please log in again.');
        return router.push('/');
      }
    
      try {
        console.log(userData)
        const response = await axios.patch('/api/users/patch', {
          id: userData?.id,
          name: userData?.name,
          email: userData?.email,
          checkingsBalance: newCheckingAmount,
          savingsBalance: newSavingsAmount
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        if (response.status === 200) {
          toast.success('🥳 Account balances updated successfully.');
        } else {
          toast.error('😭 Failed to update account balances. Please try again.');
        }
      } catch (error) {
        toast.error('😭 Failed to update account balances. Please try again.');
      }
    };

    const handleTransferToSavings = () => {
      const amount = parseFloat(transferAmount);
      if (!amount || amount <= 0) {
        toast.error('🥺 Enter a valid amount');
        return;
      }
      if (amount > checkingAmount) {
        toast.error('😖 Insufficient funds in checking account');
        return;
      }
      const newCheckingAmount = checkingAmount - amount;
      const newSavingsAmount = savingsAmount + amount;
    
      setCheckingAmount(newCheckingAmount);
      setSavingsAmount(newSavingsAmount);
      setMessage(`Successfully transferred $${amount} to savings`);
      setTransferAmount('');
    
      updateAccountBalances(newCheckingAmount, newSavingsAmount);
    };
  
    const handleTransferToChecking = () => {
      const amount = parseFloat(transferAmount);
      if (!amount || amount <= 0) {
        toast.error('🥺 Enter a valid amount');
        return;
      }
      if (amount > savingsAmount) {
        toast.error('Insufficient funds in savings account');
        return;
      }
      const newSavingsAmount = savingsAmount - amount;
      const newCheckingAmount = checkingAmount + amount;
    
      setSavingsAmount(newSavingsAmount);
      setCheckingAmount(newCheckingAmount);
      setMessage(`Successfully transferred $${amount} to checking`);
      setTransferAmount('');
    
      updateAccountBalances(newCheckingAmount, newSavingsAmount);
    };

    const handleLogoff = () => {
      localStorage.clear();
      return router.push('/');
    }

  return (
    <>
    <ToastContainer />
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to right, #000000, #0a0f0b, #003d33)' }}>
      <div className="absolute bottom-4 right-4">
        <button onClick={handleLogoff} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"> Logoff </button>
      </div>
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700">{userData?.name}&apos;s Account Balances</h2>
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
