'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Header from './Header'
import { useRouter } from 'next/navigation'
import TopHeader from './TopHeader'

type Ad = {
  id: number
  title: string
  description: string
  price: number
  category: string
  city: string
  phone: string
  createdAt: string
  imageUrls: string[]
}

const Main = () => {
  const [ads, setAds] = useState<Ad[]>([])
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    axios
      .get(`${apiUrl}/ads`)
      .then(res => setAds(res.data))
      .catch(err => console.error('Ошибка при получении объявлений:', err))
  }, [])

  const navAnnProduct = (adId: number) => {
    router.push(`/announcement/${adId}`)
  }

  return (
    <>
      <TopHeader />
      <Header onSearchResult={results => setAds(results)} />
      <main className="min-h-screen bg-gradient-to-b  py-10 px-6">
        {ads.length === 0 ? (
          <div className="text-center mt-24 text-gray-500 space-y-2 text-lg">
            <p>Объявления не найдены...</p>
            <p>Обновите страницу</p>
          </div>
        ) : (
          <div className="max-w-[1350px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {ads.map(ad => (
              <div
                key={ad.id}
                onClick={() => navAnnProduct(ad.id)}
                className="cursor-pointer rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden flex flex-col"
                style={{ width: 260 }}
                tabIndex={0}
                role="button"
                aria-pressed="false"
              >
                <div className="h-56 w-full bg-gray-100 relative overflow-hidden">
                  {ad.imageUrls?.[0] ? (
                    <img
                      src={ad.imageUrls[0]}
                      alt={ad.title}
                      className="w-full h-full object-cover object-center rounded-t-3xl"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 italic">
                      Нет изображения
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <p className="text-green-600 font-extrabold text-xl mb-1">{ad.price.toLocaleString()} KGS</p>
                  <h3 className="text-lg font-semibold text-gray-900 truncate" title={ad.category}>{ad.category}</h3>
                  <p className="text-sm text-gray-500 mt-1">{ad.city}</p>
                  <p className="text-gray-400 mt-auto text-xs italic">{new Date(ad.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default Main
