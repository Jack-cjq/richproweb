import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

interface Video {
  id: number
  title?: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  type: 'company' | 'business'
  sortOrder?: number
}

interface Props {
  videos: Video[]
  loading: boolean
}

export default function VideoSection({ videos, loading }: Props) {
  const { t } = useTranslation()
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  const getVideoUrl = (videoUrl: string) => {
    if (videoUrl.startsWith('http') || videoUrl.startsWith('data:')) {
      return videoUrl
    }
    if (videoUrl.startsWith('/')) {
      return videoUrl
    }
    return `/videos/${videoUrl.split('/').pop()}`
  }

  const getThumbnailUrl = (thumbnailUrl?: string) => {
    // 如果有缩略图URL，优先使用
    if (thumbnailUrl) {
      if (thumbnailUrl.startsWith('http') || thumbnailUrl.startsWith('data:')) {
        return thumbnailUrl
      }
      if (thumbnailUrl.startsWith('/')) {
        return thumbnailUrl
      }
      return `/images/videos/${thumbnailUrl.split('/').pop()}`
    }
    
    // 如果没有缩略图，返回 null，让组件显示默认的播放按钮
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl w-full" style={{ justifyItems: 'center' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-silver-200 dark-mode:bg-gold-500/20 rounded-lg aspect-video animate-pulse w-full max-w-md"></div>
          ))}
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark-mode:text-gold-500/70">{t('videos.noVideos') || '暂无视频'}</p>
      </div>
    )
  }

  // 按排序顺序排序，然后合并所有视频
  const sortedVideos = [...videos].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))

  return (
    <div className="flex justify-center w-full px-4">
      <div 
        className="flex flex-wrap justify-center gap-6 md:gap-8"
        style={{ 
          maxWidth: '1400px',
          width: '100%'
        }}
      >
        {sortedVideos.map((video) => (
          <div
            key={video.id}
            className="bg-surface dark-mode:bg-black rounded-lg overflow-hidden shadow-card border border-silver-200 dark-mode:border-gold-500/30 hover:shadow-dialog transition-all duration-300"
            style={{ 
              width: '100%', 
              maxWidth: 'calc((1400px - 2 * 4rem) / 3)',
              minWidth: '320px',
              flex: '0 1 auto'
            }}
          >
                <div className="relative aspect-video bg-silver-100 dark-mode:bg-black/30 group cursor-pointer overflow-hidden"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* 缩略图或视频预览 */}
                  {getThumbnailUrl(video.thumbnailUrl) ? (
                    <img
                      src={getThumbnailUrl(video.thumbnailUrl)!}
                      alt={video.title || '未命名视频'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // 如果缩略图加载失败，隐藏图片，显示视频预览
                        e.currentTarget.style.display = 'none'
                        // 显示视频元素
                        const videoElement = e.currentTarget.nextElementSibling as HTMLVideoElement
                        if (videoElement) {
                          videoElement.style.display = 'block'
                        }
                      }}
                    />
                  ) : null}
                  {/* 如果没有缩略图或缩略图加载失败，使用视频的第一帧作为预览 */}
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[video.id] = el
                    }}
                    src={getVideoUrl(video.videoUrl)}
                    className={`w-full h-full object-cover ${getThumbnailUrl(video.thumbnailUrl) ? 'hidden' : 'block'}`}
                    muted
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      // 设置视频到第一帧以显示封面
                      const videoEl = e.currentTarget
                      try {
                        // 设置到0.1秒以获取第一帧
                        videoEl.currentTime = 0.1
                      } catch (err) {
                        console.warn('无法设置视频时间:', err)
                      }
                    }}
                    onSeeked={(e) => {
                      // 当视频跳转到指定时间后，暂停以确保显示第一帧
                      const videoEl = e.currentTarget
                      videoEl.pause()
                    }}
                    onCanPlay={(e) => {
                      // 当视频可以播放时，确保显示第一帧
                      const videoEl = e.currentTarget
                      if (videoEl.readyState >= 2 && videoEl.currentTime === 0) {
                        videoEl.currentTime = 0.1
                      }
                    }}
                    onError={(e) => {
                      // 如果视频加载失败，显示默认背景
                      const videoEl = e.currentTarget
                      videoEl.style.display = 'none'
                      const fallback = videoEl.parentElement?.querySelector('.video-fallback-bg') as HTMLElement
                      if (fallback) {
                        fallback.style.opacity = '1'
                      }
                    }}
                  />
                  {/* 如果视频加载失败，显示默认背景 */}
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-green-500/20 dark-mode:from-gold-500/20 dark-mode:to-gold-400/20 pointer-events-none opacity-0 video-fallback-bg">
                    <div className="text-6xl text-white dark-mode:text-gold-500 opacity-30">▶</div>
                  </div>
                  {/* 播放按钮覆盖层 - 始终显示 */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 dark-mode:bg-gold-500/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 text-blue-600 dark-mode:text-black ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                {(video.title || video.description) && (
                  <div className="p-4 md:p-6">
                    {video.title && (
                      <h4 className="text-lg md:text-xl font-bold text-neutral-700 dark-mode:text-gold-500 mb-2">
                        {video.title}
                      </h4>
                    )}
                    {video.description && (
                      <p className="text-sm md:text-base text-neutral-600 dark-mode:text-gold-500/80 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
      </div>

      {/* 视频播放模态框 - 使用 Portal 渲染到 body */}
      {selectedVideo && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 bg-black/90 dark-mode:bg-black/95 flex items-center justify-center p-4"
          style={{ zIndex: 99999 }}
          onClick={() => setSelectedVideo(null)}
        >
          <button
            onClick={() => setSelectedVideo(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 dark-mode:bg-gold-500/20 dark-mode:hover:bg-gold-500/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            style={{ zIndex: 100000 }}
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7 text-white dark-mode:text-gold-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="relative max-w-5xl w-full mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center">
              <video
                src={getVideoUrl(selectedVideo.videoUrl)}
                controls
                autoPlay
                className="max-w-full rounded-lg shadow-2xl"
                style={{ maxHeight: '80vh' }}
              >
                您的浏览器不支持视频播放
              </video>
            </div>
            {(selectedVideo.title || selectedVideo.description) && (
              <div className="mt-4 text-center">
                {selectedVideo.title && (
                  <h3 className="text-xl md:text-2xl font-bold text-white dark-mode:text-gold-500 mb-2">
                    {selectedVideo.title}
                  </h3>
                )}
                {selectedVideo.description && (
                  <p className="text-neutral-300 dark-mode:text-gold-500/80">
                    {selectedVideo.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

