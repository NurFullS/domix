'use client'

import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const validate = () => {
    if (!email.includes('@')) {
      setError('Введите корректный email')
      return false
    }
    if (password.length < 6) {
      setError('Пароль должен быть минимум 6 символов')
      return false
    }
    setError('')
    return true
  }

  const logIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      const res = await axios.post(`${apiUrl}/users/login`, { email, password })
      localStorage.setItem('token', res.data.token)
      router.replace('/main')
    } catch {
      setError('Неверный email или пароль')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-4">
      <form
        onSubmit={logIn}
        className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-10 transform transition duration-500"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Вход в аккаунт</h2>

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
          Войти
        </button>

        {error && <p className="mt-6 text-center text-red-600 font-medium">{error}</p>}

        <p className="mt-6 text-center text-gray-600 text-lg">
          Нет аккаунта?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Зарегистрироваться
          </a>
        </p>
      </form>
    </div>
  )
}

export default Login
