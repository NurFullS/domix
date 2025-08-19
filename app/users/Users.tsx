'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

type User = {
  id: number
  email: string
  username: string
  password?: string
  telefonNumber?: string | number
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`${apiUrl}/users`)
        setUsers(res.data)
      } catch (err) {
        setError('Ошибка загрузки пользователей')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/users/${id}`)
      setUsers((prev) => prev.filter((user) => user.id !== id))
      localStorage.removeItem('token')
    } catch (err) {
      alert('Ошибка при удалении пользователя')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 text-gray-600 text-lg">
        Загрузка пользователей...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-6 font-semibold">{error}</div>
    )
  }

  return (
    <div className="max-w-auto mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg ">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Список пользователей
      </h2>
      <ul className="space-y-4 w-4xl flex gap-3">
        {users.length === 0 && (
          <li className="text-center text-gray-500">Пользователи не найдены</li>
        )}
        {users.map((user) => (
          <li
            key={user.id}
            className="flex sm:flex-row sm:justify-between sm:items-center p-4 border border-gray-200 rounded-md hover:shadow-md transition-shadow"
          >
            <div>
              <p className="font-semibold text-lg text-gray-800">{user.username}</p>
              <p className="text-gray-600 truncate max-w-xs">{user.email}</p>
              <p className="text-gray-600 mt-1">
                {user.telefonNumber ?? 'Телефон не указан'}
              </p>
            </div>
            <button
              onClick={() => deleteUser(user.id)}
              className="mt-5 flex  sm:mt-0 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
              aria-label={`Удалить пользователя ${user.username}`}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users;