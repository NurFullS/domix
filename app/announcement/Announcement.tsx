'use client'

import { useState, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import TopHeader from '../main/TopHeader'

export default function CreateAd() {
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Недвижимость')
  const [city, setCity] = useState('Город')
  const [phone, setPhone] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  // Недвижимость
  const [rooms, setRooms] = useState('')
  const [floor, setFloor] = useState('')
  const [buildingType, setBuildingType] = useState('')
  const [landSize, setLandSize] = useState('')
  const [houseArea, setHouseArea] = useState('')

  // Транспорт
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [fuel, setFuel] = useState('')
  const [transmission, setTransmission] = useState('')
  const [condition, setCondition] = useState('')

  // Одежда
  const [size, setSize] = useState('')
  const [gender, setGender] = useState('')
  const [material, setMaterial] = useState('')

  // Электроника
  const [deviceBrand, setDeviceBrand] = useState('')
  const [deviceModel, setDeviceModel] = useState('')
  const [warranty, setWarranty] = useState(false)

  // Услуги
  const [serviceType, setServiceType] = useState('')
  const [duration, setDuration] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const newFiles = Array.from(files)
    setImages((prev) => [...prev, ...newFiles])
    const newUrls = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prev) => [...prev, ...newUrls])
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    const newUrls = [...previewUrls]
    newImages.splice(index, 1)
    newUrls.splice(index, 1)
    setImages(newImages)
    setPreviewUrls(newUrls)
  }

  const isFormValid = description && price && category && city && images.length > 0

  const handleSubmit = async () => {
    if (!isFormValid) return
    setUploading(true)
    try {
      const formData = new FormData()
      images.forEach((img) => formData.append('images', img))
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('city', city)
      formData.append('phone', phone)

      if (category === 'Транспорт') {
        formData.append('brand', brand)
        formData.append('model', model)
        formData.append('year', year)
        formData.append('mileage', mileage)
        formData.append('fuel', fuel)
        formData.append('transmission', transmission)
        formData.append('condition', condition)
      } else if (category === 'Одежда') {
        formData.append('size', size)
        formData.append('gender', gender)
        formData.append('material', material)
      } else if (category === 'Недвижимость') {
        formData.append('rooms', rooms)
        formData.append('floor', floor)
        formData.append('buildingType', buildingType)
        formData.append('landSize', landSize)
        formData.append('houseArea', houseArea)
      } else if (category === 'Электроника') {
        formData.append('deviceBrand', deviceBrand)
        formData.append('deviceModel', deviceModel)
        formData.append('warranty', warranty.toString())
      } else if (category === 'Услуги') {
        formData.append('serviceType', serviceType)
        formData.append('duration', duration)
      }

      await axios.post(`${apiUrl}/api/ads`, formData)

      setMessage('Объявление успешно опубликовано!')
      setError('')
      setDescription('')
      setPrice('')
      setCategory('Недвижимость')
      setCity('Город')
      setPhone('')
      setImages([])
      setPreviewUrls([])
      setBrand('')
      setModel('')
      setYear('')
      setMileage('')
      setFuel('')
      setTransmission('')
      setCondition('')
      setSize('')
      setGender('')
      setMaterial('')
      setRooms('')
      setFloor('')
      setBuildingType('')
      setLandSize('')
      setHouseArea('')
      setDeviceBrand('')
      setDeviceModel('')
      setWarranty(false)
      setServiceType('')
      setDuration('')
    } catch (err) {
      setError('Произошла ошибка при отправке формы.')
    } finally {
      setUploading(false)
    }
  }

  const inputStyle = "w-full p-4 border-2 border-blue-600 rounded-2xl outline-0 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition"

  const renderCategoryFields = () => {
    switch (category) {
      case 'Транспорт':
        return (
          <div className="space-y-4">
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Марка" className={inputStyle} />
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Модель" className={inputStyle} />
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Год выпуска" className={inputStyle} />
            <input type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} placeholder="Пробег" className={inputStyle} />
            <input type="text" value={fuel} onChange={(e) => setFuel(e.target.value)} placeholder="Топливо" className={inputStyle} />
            <input type="text" value={transmission} onChange={(e) => setTransmission(e.target.value)} placeholder="Коробка передач" className={inputStyle} />
            <input type="text" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Состояние" className={inputStyle} />
          </div>
        )
      case 'Одежда':
        return (
          <div className="space-y-4">
            <input type="text" value={size} onChange={(e) => setSize(e.target.value)} placeholder="Размер" className={inputStyle} />
            <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Пол (мужской, женский)" className={inputStyle} />
            <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Материал" className={inputStyle} />
          </div>
        )
      case 'Недвижимость':
        return (
          <div className="space-y-4">
            <input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder="Количество комнат" className={inputStyle} />
            <input type="number" value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="Этаж" className={inputStyle} />
            <input type="text" value={buildingType} onChange={(e) => setBuildingType(e.target.value)} placeholder="Тип здания" className={inputStyle} />
            <input type="number" value={landSize} onChange={(e) => setLandSize(e.target.value)} placeholder="Площадь участка (м²)" className={inputStyle} />
            <input type="number" value={houseArea} onChange={(e) => setHouseArea(e.target.value)} placeholder="Площадь дома (м²)" className={inputStyle} />
          </div>
        )
      case 'Электроника':
        return (
          <div className="space-y-4">
            <input type="text" value={deviceBrand} onChange={(e) => setDeviceBrand(e.target.value)} placeholder="Бренд устройства" className={inputStyle} />
            <input type="text" value={deviceModel} onChange={(e) => setDeviceModel(e.target.value)} placeholder="Модель" className={inputStyle} />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={warranty} onChange={(e) => setWarranty(e.target.checked)} className="w-5 h-5 accent-blue-600" />
              Гарантия
            </label>
          </div>
        )
      case 'Услуги':
        return (
          <div className="space-y-4">
            <input type="text" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Тип услуги" className={inputStyle} />
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Длительность/Срок" className={inputStyle} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <TopHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-6 md:px-16 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 w-full">
          <div className="md:col-span-7 bg-white rounded-2xl shadow-2xl p-10 w-full">
            <h1 className="text-4xl font-extrabold mb-8 text-blue-600">Создать объявление</h1>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mb-6 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {previewUrls.length > 0 && (
              <div className="overflow-x-auto flex gap-4 mb-6">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`preview-${index}`} className="h-32 w-32 object-cover rounded-xl border shadow" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold hidden group-hover:flex justify-center items-center"
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6 w-full">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание" className={`${inputStyle} h-48 resize-none`} />
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Цена" className={inputStyle} />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputStyle}>
                <option>Недвижимость</option>
                <option>Транспорт</option>
                <option>Электроника</option>
                <option>Одежда</option>
                <option>Услуги</option>
              </select>
              {renderCategoryFields()}
              <select value={city} onChange={(e) => setCity(e.target.value)} className={inputStyle}>
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
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Контактный номер" className={inputStyle} />
            </div>

            {message && <div className="mt-6 p-4 rounded-lg bg-green-100 text-green-800 font-semibold">{message}</div>}
            {error && <div className="mt-6 p-4 rounded-lg bg-red-100 text-red-700 font-semibold">{error}</div>}

            <button
              onClick={handleSubmit}
              disabled={!isFormValid || uploading}
              className={`mt-8 w-full py-4 rounded-lg text-lg font-bold text-white transition duration-300 ${isFormValid && !uploading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
            >{uploading ? 'Загрузка изображений...' : 'Опубликовать'}</button>
          </div>

          <div className="md:col-span-5 bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Полезные советы</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Добавляйте качественные фото для привлечения покупателей.</li>
              <li>Указывайте реальные цены, чтобы избежать лишних вопросов.</li>
              <li>Заполняйте все поля — это повысит доверие к объявлению.</li>
              <li>Обязательно оставляйте контактный номер, по которому с вами смогут связаться.</li>
              <li>Добавьте картинку с размером 250px на 208px.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
