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

  useEffect(() => {
    axios
      .get('https://domix-server.onrender.com/ads')
      .then((res) => setAds(res.data))
      .catch((err) => console.error('Ошибка при получении объявлений:', err))
  }, [])

  

  if (ads.length === 0) {
    return (
      <>
        <Header onSearchResult={(results) => setAds(results)} />

        <div className="text-center mt-10 text-gray-500">Объявления не найдены...</div>
        <div className="text-center mt-10 text-gray-500">Обновите страницу🔁</div>
      </>
    );
  }

  const navAnnProduct = (adId: number) => {
    router.push(`/announcement/${adId}`)
  }
  return (
    <>
      <TopHeader />
      <Header onSearchResult={(results) => setAds(results)} />
      <div className="min-h-screen px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-[1350px] mx-auto px-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="w-[250px] cursor-pointer"
              onClick={() => navAnnProduct(ad.id)}
            >
              <div className="w-[250px] h-52">
                {ad.imageUrls?.[0] && (
                  <img
                    src={ad.imageUrls[0]}
                    alt={ad.title}
                    className="w-[350px] h-full rounded-2xl bg-gray-100 "
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-green-600 font-bold mt-1">{ad.price} KGS</p>
                <p className="text-[18px] font-semibold text-gray-900 truncate">{ad.category}</p>
                <p className="text-[16px] text-gray-500 mt-1">{ad.city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Main;