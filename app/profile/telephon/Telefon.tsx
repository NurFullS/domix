'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TopHeader from '@/app/main/TopHeader'

type User = {
  id: number
  username: string
  telefonNumber: string | null
}

const Telefon = () => {
  const [phone, setPhone] = useState('')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isChanged, setIsChanged] = useState(false)
  const [message, setMessage] = useState('');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await axios.get<User>(`${apiUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCurrentUser(res.data)
      setPhone(res.data.telefonNumber || '')
      setIsChanged(false)
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error)
    }
  }

  const handleSavePhone = async () => {
    if (phone.trim().length < 5) {
      setMessage('Введите корректный номер')
      return
    }

    if (!isChanged) {
      setMessage('Номер не изменён')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Токен не найден')
      return
    }

    try {
      await axios.put(
        `${apiUrl}/users/phone`,
        { phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setMessage('Номер успешно обновлён')
      fetchCurrentUser()
    } catch (error) {
      console.error('Ошибка при обновлении номера:', error)
      setMessage('Ошибка при обновлении номера')
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      setIsChanged(phone !== (currentUser.telefonNumber || ''))
    }
  }, [phone, currentUser])

  return (
    <>
      <TopHeader />
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md font-sans">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          placeholder="996505123456"
          className="w-full p-3 mb-4 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSavePhone}
          disabled={!isChanged}
          className={`w-full text-white font-semibold py-3 rounded transition-colors duration-300 cursor-pointer ${isChanged
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {currentUser?.telefonNumber ? 'Изменить номер' : 'Добавить номер'}
        </button>

        {message && (
          <div className="mt-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded">
            {message}
          </div>
        )}

        {currentUser?.telefonNumber && (
          <p className="mt-6 text-gray-800 font-medium">
            Текущий номер: <span className="font-bold">{currentUser.telefonNumber}</span>
          </p>
        )}
      </div>
    </>
  )
}

export default Telefon
