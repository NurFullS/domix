'use client'

import React, { useState } from 'react'
import axios from 'axios'
import TopHeader from '@/app/main/TopHeader'

const ResPass = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Вы не авторизованы')
      return
    }

    try {
      const response = await axios.put(
        'https://domix-server.onrender.com/users/reset-password',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setMessage(typeof response.data === 'string' ? response.data : JSON.stringify(response.data))
      setError('')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err: any) {
      const data = err.response?.data
      const errorMsg = typeof data === 'string' ? data : data?.error || 'Ошибка при смене пароля'
      setError(errorMsg)
      setMessage('')
    }
  }

  return (
    <>
      <TopHeader />
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md font-sans">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Смена пароля</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текущий пароль
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Новый пароль
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 cursor-pointer"
          >
            Сменить пароль
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600 text-center font-medium">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">{error}</p>
        )}
      </div>
    </>
  )
}

export default ResPass
