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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await axios.get(`${apiUrl}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserBase(res.data);
        } catch (error) {
            console.error('Ошибка при получении профиля', error);
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
            await axios.post(`${apiUrl}/users/upload-avatar`, formData, {
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
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 flex justify-center">
                <div className="bg-white shadow-2xl rounded-3xl p-8 w-full h-[530px] max-w-5xl flex flex-col md:flex-row gap-8 animate-fade-in">
                    <div className="flex flex-col items-center md:items-start md:w-1/2 space-y-5">
                        <img
                            className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover shadow-lg"
                            src={userBase?.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/219/219983.png'}
                            alt="User avatar"
                        />
                        <div className="w-full max-w-md flex flex-col gap-3 text-gray-600">
                            <label
                                htmlFor="avatarUpload"
                                className="block text-blue-600 font-semibold cursor-pointer"
                            >
                                Фото профиля:
                            </label>
                            <input
                                id="avatarUpload"
                                type="file"
                                accept="image/*"
                                className="block w-full text-sm text-gray-700
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                  transition-all duration-300 ease-in-out
                  cursor-pointer"
                                onChange={handleFileChange}
                            />
                        </div>

                        {userBase ? (
                            <div className="text-left space-y-2 text-base text-blue-600">
                                <p><span className="font-semibold">Имя: </span>{userBase.username}</p>
                                <p className="break-words"><span className="font-semibold">Email: </span>{userBase.email}</p>
                                <p><span className="font-semibold">Номер: </span>{userBase.telefonNumber || '—'}</p>
                                <p><span className="font-semibold">ID: </span>{userBase.id}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
                        )}
                    </div>

                    <div className="flex-1 space-y-5">
                        <h3 className="text-2xl font-bold text-blue-600 mb-2">Настройки</h3>
                        <div className="flex flex-col gap-3 bg-gradient-to-b">
                            {settings.map(({ icon, label, onClick }, idx) => (
                                <SettingItem key={idx} icon={icon} label={label} onClick={onClick} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {logoutPopUp && (
                <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b bg-opacity-50 z-50">
                    <div className="bg-gradient-to-b p-8 rounded-xl shadow-2xl text-center w-[300px]">
                        <p className="mb-5 text-gray-800 dark:text-white text-lg font-medium">Вы действительно хотите выйти?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => {
                                    handleLogout()
                                    setLogoutPopUp(false)
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-sm transition"
                            >
                                Выйти
                            </button>
                            <button
                                onClick={() => setLogoutPopUp(false)}
                                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-5 py-2 rounded-lg transition"
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
        className="flex items-center gap-4 cursor-pointer bg-gradient-to-b hover:bg-blue-100 rounded-xl px-4 py-3 transition-all shadow-md hover:shadow-xl"
    >
        <span className="text-blue-600 dark:text-blue-300">{icon}</span>
        <span className="text-gray-900 dark:text-blue-600 font-medium">{label}</span>
    </div>
)

export default Profile
