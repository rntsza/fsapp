import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [savingsBalance, setSavingsBalance] = useState('');
  const [checkingsBalance, setCheckingsBalance] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const response = await axios.get('api/users/userData', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          console.log('User already authenticated', response.data.user.name)
          router.push('/page');
        }
      } catch (error) {
        console.log('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, [router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const url = isLogin ? '/api/login/auth' : '/api/users/create';

    const userData = isLogin 
    ? { email, password } 
    : { 
        name, 
        email, 
        password,
        savingsBalance: parseFloat(savingsBalance), 
        checkingsBalance: parseFloat(checkingsBalance) 
      };

    if (!userData.email || !userData.password) {
      toast.error(' Email and password are required.');
      return;
    };

    try {
      const response = await axios.post(url, userData);
      if(response.data && response.data.token){
        localStorage.setItem('token', response.data.token);
        router.push('/page');
      }
    } catch (error) {
      if (error.response) {
        const message = error.response.status === 404
          ? "🙁 User not found."
          : "🤔 An error occurred. Please try again.";
        toast.error(message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };
  

  return (
    <>
    <ToastContainer />
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundImage: 'linear-gradient(to right, #000000, #0a0f0b, #003d33)' }}>
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
          <h1 className="text-xl font-bold mb-8">{isLogin ? 'Login' : 'Create Account'}</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <input
                  className="w-full p-3 rounded bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-white"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="w-full p-3 rounded bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-white"
                  type="number"
                  placeholder="Savings Balance"
                  value={savingsBalance}
                  onChange={(e) => setSavingsBalance(e.target.value)}
                />
                <input
                  className="w-full p-3 rounded bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-white"
                  type="number"
                  placeholder="Checkings Balance"
                  value={checkingsBalance}
                  onChange={(e) => setCheckingsBalance(e.target.value)}
                />
              </>
            )}
            <input
              className="w-full p-3 rounded bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-white"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-3 rounded bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:bg-white"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              {isLogin ? 'Login' : 'Create'}
            </button>
          </form>
          <button className="mt-6 text-blue-500 hover:text-blue-700 text-sm font-bold" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create an account' : 'I already have an account'}
          </button>
        </div>
      </div>
    </>
  );
}
