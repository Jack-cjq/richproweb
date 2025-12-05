import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

interface Carousel {
  id: number
  title: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
}

interface Props {
  carousels: Carousel[]
  loading: boolean
}

export default function Carousel({ carousels, loading }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (carousels.length === 0) return

    // 自动轮播
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carousels.length)
    }, 5000) // 每5秒切换

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [carousels.length])

  useEffect(() => {
    // GSAP 切换动画
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.to(carouselRef.current, {
            opacity: 1,
            duration: 0.5,
          })
        },
      })
    }
  }, [currentIndex])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carousels.length)
    }, 5000)
  }

  if (loading) {
    return (
      <div className="relative w-full carousel-container carousel-aspect-ratio bg-silver-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-neutral-500">加载中...</div>
        </div>
      </div>
    )
  }

  if (carousels.length === 0) {
    return null
  }

  const currentCarousel = carousels[currentIndex]

  const getImageUrl = () => {
    const url = currentCarousel.imageUrl
    // 如果是完整 URL（http/https），直接使用
    if (url.startsWith('http')) {
      return url
    }
    // 如果是 base64 数据 URL，直接使用
    if (url.startsWith('data:image/')) {
      return url
    }
    // 如果以 / 开头，直接使用（相对路径）
    if (url.startsWith('/')) {
      return url
    }
    // 否则，假设是文件名，拼接默认路径
    return `/images/carousels/${url.split('/').pop()}`
  }

  return (
    <div className="relative w-full overflow-hidden carousel-container">
      {/* 轮播图片 */}
      <div
        ref={carouselRef}
        className="relative w-full carousel-image carousel-with-gradient"
      >
        <img
          src={getImageUrl()}
          alt={currentCarousel.title || 'Carousel'}
          className="w-full h-auto block carousel-img"
        />
        {/* 遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 pointer-events-none"></div>
        {/* 底部渐变遮罩 - 用于自然过渡到下方区域 */}
        <div className="carousel-bottom-gradient"></div>

        {/* 内容 */}
        {(currentCarousel.title || currentCarousel.subtitle) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div className="text-center px-4 max-w-4xl">
              {currentCarousel.title && (
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                  {currentCarousel.title}
                </h1>
              )}
              {currentCarousel.subtitle && (
                <p className="text-xl md:text-2xl text-white/90 font-medium drop-shadow-md">
                  {currentCarousel.subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp 按钮 - 相对定位，位于轮播图右侧中间偏下位置 */}
        <div className="absolute right-6 md:right-12 bottom-1/3 md:bottom-1/3 z-20 pointer-events-auto">
          <a
            href="https://wa.me/8617764065981"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 carousel-whatsapp-btn"
            aria-label="联系 WhatsApp"
          >
            {/* WhatsApp 图标 */}
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="text-sm md:text-base font-semibold">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* 指示器 */}
      {carousels.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {carousels.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`切换到第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}

      {/* 左右箭头 */}
      {carousels.length > 1 && (
        <>
          <button
            onClick={() => goToSlide((currentIndex - 1 + carousels.length) % carousels.length)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="上一张"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => goToSlide((currentIndex + 1) % carousels.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="下一张"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

