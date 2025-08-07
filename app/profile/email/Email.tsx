'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TopHeader from '@/app/main/TopHeader'

type User = {
  id: number
  username: string
  email: string
}

const Email = () => {
  const [email, setEmail] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isChanged, setIsChanged] = useState(false)
  const [message, setMessage] = useState('')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await axios.get<User>(`${apiUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCurrentUser(res.data)
      setEmail(res.data.email || '')
      setIsChanged(false)
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error)
    }
  }

  const handleSaveEmail = async () => {
    if (!email.includes('@')) {
      setMessage('Введите корректный email')
      return
    }

    if (!isChanged) {
      setMessage('Email не изменён')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Токен не найден')
      return
    }

    try {
      const res = await axios.put(
        `${apiUrl}/users/email`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
      }

      setMessage('✅ Email успешно обновлён')
      fetchCurrentUser()
    } catch (error) {
      console.error('Ошибка при обновлении email:', error)
      alert('Ошибка при обновлении email')
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      setIsChanged(email !== (currentUser.email || ''))
    }
  }, [email, currentUser])

  return (
    <>
      <TopHeader />
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-xl font-sans">
        <h2 className="text-2xl font-bold mb-4 text-center">Изменение Email</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Введите новый email"
          className="w-full p-3 mb-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSaveEmail}
          disabled={!isChanged}
          className={`w-full cursor-pointer text-white font-semibold py-3 rounded-lg transition-colors duration-300 ${isChanged ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed '
            }`}
        >
          Изменить Email
        </button>

        {message && (
          <div className="mt-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
            {message}
          </div>
        )}

        {currentUser?.email && (
          <p className="mt-6 text-gray-700 font-medium text-center">
            Текущий email: <span className="font-semibold">{currentUser.email}</span>
          </p>
        )}
      </div>
    </>
  )
}

export default Email;