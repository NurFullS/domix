'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const validate = () => {
    if (username.length < 3) return 'Имя должно содержать минимум 3 символа';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Некорректный email';
    if (password.length < 6) return 'Пароль должен быть минимум 6 символов';
    return '';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.post(
        `${apiUrl}/users/register`,
        {
          username,
          email,
          password,
        }
      );

      console.log('Успешно зарегистрирован', res.data);
      localStorage.setItem('token', res.data.token);
      navigate.replace('/');
    } catch (error: any) {
      let msg = 'Ошибка регистрации';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          msg = error.response.data;
        } else if (typeof error.response.data === 'object') {
          msg = JSON.stringify(error.response.data);
        }
      }
      setError(msg);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate.replace('/main');
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Регистрация</h2>

        <input
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Имя пользователя..."
          required
        />
        <input
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль..."
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Зарегистрироваться
        </button>
        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default Register;