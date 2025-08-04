'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Main from './main/Main'

const ProtectedPage = () => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('useEffect: токен из localStorage:', token)

    if (!token) {
      console.log('Токен отсутствует, редирект на /register')
      router.replace('/register')
      return
    }

    axios
      .get('https://domix-server.onrender.com/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        console.log('Пользователь:', res.data)
      })
      .catch(err => {
        console.log('Ошибка при запросе профиля:', err.response?.status || err.message)

        if (err.response?.status === 401) {
          console.log('Ошибка 401: удаляем токен и редиректим')
          localStorage.removeItem('token')
          router.replace('/register')
        } else {
          console.error('Ошибка сервера или сети:', err)
        }
      })
  }, [router])

  return (
    <div>
      <Main />
    </div>
  )
}

export default ProtectedPage
