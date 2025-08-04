'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TopHeader from '@/app/main/TopHeader'

type User = {
  username: string
}

const Rename = () => {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await axios.get<User>('https://domix-server.onrender.com/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCurrentUser(res.data)
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error)
    }
  }

  const handleRename = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        setError('Вы не авторизованы')
        return
      }

      const res = await axios.put(
        'https://domix-server.onrender.com/users/username',
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage(res.data)
      setCurrentUser(prev => prev ? { ...prev, username } : null)
      setUsername('')
      setError('')
    } catch (err: any) {
      setError(err.response?.data || 'Ошибка при обновлении')
      setMessage('')
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  return (
    <>
      <TopHeader />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Изменить имя пользователя</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Новое имя"
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <button
          onClick={handleRename}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Сохранить
        </button>
        <p className="mt-4">
          <strong>Текущий имя:</strong> {currentUser?.username || 'Загрузка...'}
        </p>

        {message && <p className="text-green-600 mt-4">{message}</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </>
  )
}

export default Rename
