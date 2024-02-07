// pages/login.js ou pages/auth.js
import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true); // Alternar entre login e criação
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Apenas para simular, substitua conforme sua lógica de autenticação
  const [name, setName] = useState('');
  const [savingsBalance, setSavingsBalance] = useState('');
  const [checkingsBalance, setCheckingsBalance] = useState('');

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const url = isLogin ? '/api/login' : '/api/users/create'; // Substitua '/api/login' pelo seu endpoint de login real

    const userData = isLogin 
    ? { email, password } 
    : { 
        name, 
        email, 
        savingsBalance: parseFloat(savingsBalance), 
        checkingsBalance: parseFloat(checkingsBalance) 
      };

    try {
      const response = await axios.post(url, userData);
      console.log(response.data);
      // Tratar resposta - redirecionar o usuário, mostrar mensagem de sucesso, etc.
    } catch (error) {
      console.error(error);
      // Tratar erro - mostrar mensagem de erro, etc.
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
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
