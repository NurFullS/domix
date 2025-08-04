'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import TopHeader from '../main/TopHeader'

type UserProfile = {
  telefonNumber: string | null
}

const CreateAd = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Недвижимость')
  const [city, setCity] = useState('Город')
  const [phone, setPhone] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [cloudinaryUrls, setCloudinaryUrls] = useState<string[]>([])

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Пользователь не авторизован')
      return
    }

    axios
      .get<UserProfile>('https://domix-server.onrender.com/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.telefonNumber) {
          setPhone(res.data.telefonNumber)
        }
      })
      .catch(() => {
        setError('Ошибка при загрузке данных пользователя')
      })
  }, [])

  const isFormValid =
    description.trim() &&
    price.trim() &&
    category.trim() &&
    city.trim()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selectedFiles = Array.from(e.target.files)
    const combined = [...images, ...selectedFiles]

    if (combined.length > 5) {
      setError('Можно выбрать максимум 5 изображений')
      return
    }

    setImages(combined)

    previewUrls.forEach(url => URL.revokeObjectURL(url))

    const previews = combined.map((file) => URL.createObjectURL(file))
    setPreviewUrls(previews)
    setError('')
  }

  const uploadImages = async (): Promise<string[]> => {
    setUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (const image of images) {
        const formData = new FormData()
        formData.append('image', image)

        const res = await axios.post('https://domix-server.onrender.com/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        uploadedUrls.push(res.data.image_url)
      }
      setCloudinaryUrls(uploadedUrls)
      return uploadedUrls
    } catch (error) {
      setError('Ошибка загрузки изображений')
      return []
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!isFormValid) {
      setError('Пожалуйста, заполните все обязательные поля.')
      setMessage('')
      return
    }

    const priceNumber = Number(price)
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setError('Введите корректную цену больше 0')
      setMessage('')
      return
    }

    let urls = cloudinaryUrls
    if (images.length > 0 && cloudinaryUrls.length !== images.length) {
      urls = await uploadImages()
    }

    const token = localStorage.getItem('token')

    try {
      await axios.post(
        'https://domix-server.onrender.com/ads',
        {
          title,
          description,
          price: priceNumber,
          category,
          city,
          phone,
          image_url: urls,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      previewUrls.forEach(url => URL.revokeObjectURL(url))

      setMessage('Объявление успешно создано!')
      setError('')
      setTitle('')
      setDescription('')
      setPrice('')
      setCategory('Недвижимость')
      setCity('Город')
      setImages([])
      setPreviewUrls([])
      setCloudinaryUrls([])

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setError('Ошибка при создании объявления.')
      setMessage('')
      console.error(error)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)

    URL.revokeObjectURL(previewUrls[index])

    const newPreviews = previewUrls.filter((_, i) => i !== index)
    setPreviewUrls(newPreviews)

    const newCloudUrls = cloudinaryUrls.filter((_, i) => i !== index)
    setCloudinaryUrls(newCloudUrls)
  }

  return (
    <>
      <TopHeader />
      <div className="min-h-screen bg-gray-100 py-10 px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-10">
          <div className="col-span-7 bg-white rounded-xl shadow-lg p-10">
            <h1 className="text-3xl font-bold mb-8">Создать объявление</h1>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-4"
            />

            {previewUrls.length > 0 && (
              <div className="overflow-x-auto flex gap-4 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`preview-${index}`}
                      className="h-32 w-32 object-cover rounded border"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-5 h-5 text-center leading-3 cursor-pointer"
                      type="button"
                      aria-label="Удалить изображение"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание"
                className="w-full px-4 py-3 rounded border h-[300px] resize-none"
              />

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Цена"
                className="w-full px-4 py-3 rounded border"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded border"
              >
                <option>Недвижимость</option>
                <option>Транспорт</option>
                <option>Электроника</option>
                <option>Услуги</option>
                <option>Одежда</option>
              </select>

              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded border"
              >
                <option>Город</option>
                <option>Чуй</option>
                <option>Талас</option>
                <option>Ош</option>
                <option>Баткен</option>
                <option>Джалал-Абад</option>
                <option>Иссык-Кол</option>
                <option>Нарын</option>
                <option>Бишкек</option>
              </select>

              <p className="text-[16px]">Контактный номер: {phone || null}</p>
            </div>

            {message && (
              <div className="mt-6 p-4 bg-green-100 text-green-700 rounded">{message}</div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isFormValid || uploading}
              className={`mt-8 w-full py-4 rounded font-semibold text-white transition ${isFormValid && !uploading
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-300 cursor-not-allowed'
                }`}
            >
              {uploading ? 'Загрузка изображений...' : 'Опубликовать'}
            </button>
          </div>

          <div className="col-span-5 bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-4">Полезные советы</h2>
            <p className="text-gray-700 mb-2">• Добавляйте качественные фото для привлечения покупателей.</p>
            <p className="text-gray-700 mb-2">• Указывайте реальные цены, чтобы избежать лишних вопросов.</p>
            <p className="text-gray-700 mb-2">• Заполняйте все поля — это повысит доверие к объявлению.</p>
            <p className="text-gray-700">
              • Обязательно оставляйте контактный номер, по которому с вами смогут связаться.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateAd