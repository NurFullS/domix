'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
    Home,
    PhoneIcon,
    MailIcon,
    KeyIcon,
    LogOutIcon,
    Plus,
    PersonStanding
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import TopHeader from '../main/TopHeader'

type User = {
    username: string
    email: string
    id: number
    telefonNumber?: string | null
    avatarUrl?: string | null
}

const Profile = () => {
    const [userBase, setUserBase] = useState<User | null>(null)
    const [logoutPopUp, setLogoutPopUp] = useState(false)
    const navigate = useRouter()

    const fetchProfile = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
            const [prodRes, localRes] = await Promise.allSettled([
                axios.get('https://domix-server.onrender.com/users/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get('http://localhost:8080/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ])

            const working = prodRes.status === 'fulfilled' ? prodRes : localRes.status === 'fulfilled' ? localRes : null

            if (working) {
                setUserBase(working.value.data)
            } else {
                localStorage.removeItem('token')
                navigate.replace('/register')
            }
        } catch (error) {
            console.error('Ошибка при получении профиля', error)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)

        const token = localStorage.getItem('token')

        try {
            await axios.post('https://domix-server.onrender.com/users/upload-avatar', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            })
            fetchProfile()
        } catch (err) {
            console.error('Ошибка загрузки аватара', err)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate.replace('/register')
    }

    const settings = [
        { icon: <Home size={18} />, label: 'Главная', onClick: () => navigate.push('/main') },
        { icon: <Plus size={18} />, label: 'Создать объявление', onClick: () => navigate.push('/announcement') },
        { icon: <PhoneIcon size={18} />, label: 'Номер телефона', onClick: () => navigate.push('/profile/telephon') },
        { icon: <PersonStanding size={18} />, label: 'Изменить имя', onClick: () => navigate.push('/profile/rename') },
        { icon: <MailIcon size={18} />, label: 'Изменить email', onClick: () => navigate.push('/profile/email') },
        { icon: <KeyIcon size={18} />, label: 'Изменить пароль', onClick: () => navigate.push('/profile/respass') },
        { icon: <LogOutIcon size={18} />, label: 'Выйти из аккаунта', onClick: () => setLogoutPopUp(true) },
    ]

    return (
        <>
            <TopHeader />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-8 flex justify-center">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 w-full h-[430px] max-w-4xl flex flex-col md:flex-row gap-6 transition-colors">
                    <div className="flex flex-col items-center md:items-start md:w-1/2 space-y-4">
                        <img
                            className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
                            src={userBase?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/219/219983.png'}
                            alt="User avatar"
                        />
                        <div className="w-full max-w-md flex flex-col gap-2">
                            <label
                                htmlFor="avatarUpload"
                                className="block text-gray-700 dark:text-gray-300 font-semibold mb-1 cursor-pointer"
                            >
                                Фото профиля:
                            </label>
                            <input
                                id="avatarUpload"
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-gray-500
                                       file:mr-4 file:py-2 file:px-4
                                       file:rounded-md file:border-0
                                       file:text-sm file:font-semibold
                                       file:bg-blue-600 file:text-white
                                       hover:file:bg-blue-700
                                       cursor-pointer
                                       dark:text-gray-200"
                                onChange={handleFileChange}
                            />
                        </div>

                        {userBase ? (
                            <div className="text-left space-y-2 text-sm md:text-base text-gray-900 dark:text-gray-100">
                                <p>
                                    <span className="font-semibold">Имя: </span>
                                    {userBase.username}
                                </p>
                                <p className="break-words">
                                    <span className="font-semibold">Email: </span>
                                    {userBase.email}
                                </p>
                                <p>
                                    <span className="font-semibold">Номер: </span>
                                    {userBase.telefonNumber || '—'}
                                </p>
                                <p>
                                    <span className="font-semibold">ID: </span>
                                    {userBase.id}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
                        )}
                    </div>

                    <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Настройки</h3>
                        <div className="flex flex-col gap-2">
                            {settings.map(({ icon, label, onClick }, idx) => (
                                <SettingItem key={idx} icon={icon} label={label} onClick={onClick} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {logoutPopUp && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <p className="mb-4 text-gray-800 dark:text-white">Вы действительно хотите выйти?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    handleLogout()
                                    setLogoutPopUp(false)
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
                            >
                                Выйти
                            </button>
                            <button
                                onClick={() => setLogoutPopUp(false)}
                                className="cursor-pointer bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white px-4 py-2 rounded"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const SettingItem = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
    <div
        onClick={onClick}
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md px-3 py-2 transition"
    >
        <span className="text-blue-600 dark:text-blue-400">{icon}</span>
        <span className="text-gray-900 dark:text-gray-100">{label}</span>
    </div>
)

export default Profile
