'use client'

import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Button } from '@mui/material'

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
    <div className="min-h-screen flex items-center justify-center bg-[#e0d6c3] p-6">
      <form
        onSubmit={logIn}
        className="w-full max-w-lg p-10 rounded-2xl bg-[#cbbf9f]/90 backdrop-blur-md shadow-md flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-[#4b3f33] text-center mb-6">
          Вход в аккаунт
        </h2>

        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          sx={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1rem',
            backgroundColor: '#d6c7a1',
            color: '#4b3f33',
            '&:focus': { boxShadow: '0 0 0 3px rgba(184, 143, 92, 0.4)' }
          }}
        />

        <Input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Пароль"
          sx={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1rem',
            backgroundColor: '#d6c7a1',
            color: '#4b3f33',
            '&:focus': { boxShadow: '0 0 0 3px rgba(184, 143, 92, 0.4)' }
          }}
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            backgroundColor: '#b99f75',
            color: '#fff6e5',
            '&:hover': { backgroundColor: '#a88e64' },
          }}
        >
          Войти
        </Button>

        {error && <p className="text-center text-red-600">{error}</p>}

        <p className="text-center text-[#4b3f33] text-sm">
          Нет аккаунта?{' '}
          <a href="/register" className="underline font-medium">
            Зарегистрироваться
          </a>
        </p>
      </form>
    </div>
  )
}

export default Login
