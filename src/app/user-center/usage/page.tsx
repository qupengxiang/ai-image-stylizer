'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Generation {
  id: string
  style: string
  prompt: string
  resultUrl: string | null
  createdAt: string
}

export default function UsagePage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/user/usage')
      const data = await res.json()
      setGenerations(data.generations || [])
    } catch (error) {
      console.error('获取使用记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const styleNames: Record<string, string> = {
    'cute-cartoon': '可爱卡通',
    'anime-manga': '动漫漫画',
    'pixel-art': '像素艺术',
    'chibi': 'Q版人物',
    'comic-book': '漫画书',
    'disney': '迪士尼',
    'studio-ghibli': '吉卜力',
    'pop-art': '波普艺术',
    'cartoon-network': '卡通网络',
    'stop-motion': '定格动画',
    'retro-cartoon': '复古卡通',
    'digital-painting': '数字绘画',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/user-center" className="text-purple-600 hover:text-purple-700 font-medium">
              ← 返回用户中心
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">📈 使用记录</h1>
            <div></div>
          </div>

          {generations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">暂无使用记录</p>
              <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
                前往生成图片 →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {generations.map((gen) => (
                <div key={gen.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                  {gen.resultUrl && (
                    <img src={gen.resultUrl} alt="生成结果" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{styleNames[gen.style] || gen.style}</p>
                    <p className="text-sm text-gray-500 truncate">{gen.prompt}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(gen.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
