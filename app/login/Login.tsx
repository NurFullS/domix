'use client'

import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

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
      const res = await axios.post('https://domix-server.onrender.com/users/login', {
        email,
        password,
      })
      localStorage.setItem('token', res.data.token)
      router.replace('/main')
    } catch (err) {
      setError('Неверный email или пароль')
    }
  }

  return (
    <form
      onSubmit={logIn}
      className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md font-sans"
    >
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-3 mb-4 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Пароль"
        required
        className="w-full p-3 mb-4 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition-colors duration-300"
      >
        Войти
      </button>
      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
    </form>
  )
}

export default Login
