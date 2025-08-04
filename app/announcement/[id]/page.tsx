'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Header from '@/app/main/Header'
import TopHeader from '@/app/main/TopHeader'

type Ad = {
    id: number
    title: string
    description: string
    price: number
    category: string
    city: string
    phone: string
    createdAt: string
    imageUrl: string[]
}

const AnnouncementPage = () => {
    const params = useParams()
    const { id } = params // id из URL
    const [ad, setAd] = useState<Ad | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return

        axios
            .get(`https://domix-server.onrender.com/ads/${id}`)
            .then((res) => {
                setAd(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setError('Ошибка при загрузке объявления')
                setLoading(false)
            })
    }, [id])

    if (loading) return <div>Загрузка...</div>
    if (error) return <div className="text-red-500">{error}</div>
    if (!ad) return <div>Объявление не найдено</div>

    return (
        <>
            <TopHeader />
            <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 mb-10">
                <h1 className="text-3xl font-bold mb-6 border-b pb-2">{ad.title}</h1>

                <div className="mb-6 flex flex-wrap gap-4 justify-center">
                    {ad.imageUrl.map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt={`${ad.title} - изображение ${i + 1}`}
                            className="rounded-lg max-w-[279px] max-h-[181px] object-contain border"
                        />
                    ))}
                </div>

                <div className="mb-6 space-y-3 text-gray-700">
                    <p className="text-xl font-semibold text-green-600">{ad.price} KGS</p>
                    <p><span className="font-semibold">Категория:</span> {ad.category}</p>
                    <p><span className="font-semibold">Город:</span> {ad.city}</p>
                    <p><span className="font-semibold">Телефон:</span> {ad.phone}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 border-b pb-1">Описание</h2>
                    <p className="text-gray-800 whitespace-pre-line">{ad.description}</p>
                </div>

                <p className="text-gray-500 text-sm text-right">
                    Дата создания: {new Date(ad.createdAt).toLocaleDateString()}
                </p>
            </div>
        </>

    )
}

export default AnnouncementPage;