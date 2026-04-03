'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { styles } from '@/lib/styles'

interface GenerationRecord {
  id: string
  style: string
  prompt: string
  resultUrl: string | null
  createdAt: string
}

// 计算7天过期时间
const EXPIRATION_DAYS = 7

function getExpirationDate(createdAt: string): { date: Date; isExpiringSoon: boolean; isExpired: boolean } {
  const created = new Date(createdAt)
  const expirationDate = new Date(created.getTime() + EXPIRATION_DAYS * 24 * 60 * 60 * 1000)
  const now = new Date()
  const daysLeft = Math.ceil((expirationDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
  return {
    date: expirationDate,
    isExpiringSoon: daysLeft <= 2 && daysLeft > 0,
    isExpired: daysLeft <= 0,
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MyImagesPage() {
  const { data: session, status } = useSession()
  const [generations, setGenerations] = useState<GenerationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGenerations()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status])

  const fetchGenerations = async () => {
    try {
      const res = await fetch('/api/generation/save')
      const data = await res.json()
      if (data.generations) {
        setGenerations(data.generations)
      }
    } catch (error) {
      console.error('获取生成记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (url: string, styleName: string, id: string) => {
    if (downloadingId) return;
    
    setDownloadingId(id);
    const filename = `imgart-${styleName}-${Date.now()}.jpg`;
    
    // 通过 API 代理下载，确保浏览器原生下载且文件名正确
    const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setDownloadingId(null), 1000);
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这张图片吗？')) return
    
    setDeletingId(id)
    try {
      // 直接从前端移除，不调用后端删除（后端可以定期清理过期记录）
      setGenerations(prev => prev.filter(g => g.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  // 获取风格名称
  const getStyleName = (styleId: string): string => {
    const style = styles.find(s => s.id === styleId)
    return style?.name || styleId
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">请先登录</h2>
          <p className="text-gray-600 mb-6">登录后才能查看您的生成记录</p>
          <Link
            href="/"
            className="inline-block bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-pink-500 transition-colors">
              ← 返回
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">📷 我的图片</h1>
          </div>
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-gray-600 text-sm">{session?.user?.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 过期提示 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-bold text-amber-800">图片保存期限提示</p>
              <p className="text-amber-700 text-sm">
                您的生成记录将在 <strong>7 天后自动过期删除</strong>，请及时下载保存重要图片！
              </p>
            </div>
          </div>
        </div>

        {/* 加载状态 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : generations.length === 0 ? (
          /* 空状态 */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🖼️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">暂无生成记录</h2>
            <p className="text-gray-600 mb-6">开始创作你的第一张AI艺术图片吧！</p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              🚀 开始创作
            </Link>
          </div>
        ) : (
          /* 生成记录网格 */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {generations.map((gen) => {
              const { date: expireDate, isExpiringSoon, isExpired } = getExpirationDate(gen.createdAt)
              
              return (
                <div
                  key={gen.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                    isExpiringSoon ? 'ring-2 ring-amber-400' : ''
                  } ${isExpired ? 'opacity-50' : ''}`}
                >
                  {/* 图片 */}
                  <div className="relative aspect-square bg-gray-100">
                    {gen.resultUrl ? (
                      <img
                        src={gen.resultUrl}
                        alt={getStyleName(gen.style)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        图片已过期
                      </div>
                    )}
                    
                    {/* 过期标签 */}
                    {isExpired && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          已过期
                        </span>
                      </div>
                    )}
                    {isExpiringSoon && !isExpired && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          即将过期
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* 信息 */}
                  <div className="p-3">
                    <h3 className="font-bold text-gray-800 truncate">{getStyleName(gen.style)}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(gen.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                    
                    {/* 过期时间 */}
                    {!isExpired && (
                      <p className={`text-xs mt-1 ${isExpiringSoon ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                        {isExpiringSoon ? '⚠️' : '📅'} {formatDate(expireDate)} 到期
                      </p>
                    )}
                    
                    {/* 操作按钮 */}
                    {gen.resultUrl && !isExpired && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleDownload(gen.resultUrl!, getStyleName(gen.style), gen.id)}
                          disabled={downloadingId === gen.id}
                          className={`flex-1 text-white text-xs py-2 rounded-lg font-medium transition-colors ${
                            downloadingId === gen.id 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-pink-500 hover:bg-pink-600'
                          }`}
                        >
                          {downloadingId === gen.id ? '⏳ 下载中' : '💾 下载'}
                        </button>
                        <button
                          onClick={() => handleDelete(gen.id)}
                          disabled={deletingId === gen.id}
                          className="bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 text-xs py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === gen.id ? '...' : '🗑️'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 底部提示 */}
        {!loading && generations.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>共 {generations.length} 条生成记录</p>
            <p className="mt-1">如有疑问请联系客服</p>
          </div>
        )}
      </main>
    </div>
  )
}
