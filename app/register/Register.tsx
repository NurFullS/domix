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
      const res = await axios.post(`${apiUrl}/users/register`, {
        username,
        email,
        password,
      });

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 transform transition duration-500"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Регистрация
        </h2>

        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Имя пользователя"
          required
          className="w-full p-4 mb-6 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
        />

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-4 mb-6 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль"
          required
          className="w-full p-4 mb-6 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white text-lg font-semibold py-4 rounded-xl shadow-lg hover:opacity-90 transition duration-300"
        >
          Зарегистрироваться
        </button>

        {error && (
          <p className="mt-6 text-center text-red-600 font-medium">{error}</p>
        )}

        <p className="mt-6 text-center text-gray-600 text-lg">
          Уже есть аккаунт?{' '}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Войти
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;