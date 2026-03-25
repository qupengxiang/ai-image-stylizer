'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CreditLog {
  id: string
  type: string
  amount: number
  balance: number
  remark: string | null
  createdAt: string
}

interface CreditLogResponse {
  logs: CreditLog[]
  total: number
  page: number
  totalPages: number
}

const typeLabels: Record<string, { label: string; color: string }> = {
  REGISTER: { label: '注册赠送', color: 'bg-green-100 text-green-700' },
  INVITE: { label: '邀请好友', color: 'bg-blue-100 text-blue-700' },
  LOGIN_DAILY: { label: '每日登录', color: 'bg-cyan-100 text-cyan-700' },
  PURCHASE: { label: '充值购买', color: 'bg-purple-100 text-purple-700' },
  GENERATE: { label: '生成图片', color: 'bg-orange-100 text-orange-700' },
  VIP_GIFT: { label: 'VIP赠送', color: 'bg-yellow-100 text-yellow-700' },
  ADMIN_ADJUST: { label: '管理员调整', color: 'bg-gray-100 text-gray-700' },
}

export default function CreditsPage() {
  const [data, setData] = useState<CreditLogResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCredits()
  }, [])

  const fetchCredits = async () => {
    try {
      const res = await fetch('/api/user/credits')
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('获取积分记录失败:', error)
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-2xl font-bold text-gray-800">💰 积分明细</h1>
            <div></div>
          </div>

          {data?.logs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无积分记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.logs.map((log) => (
                <div key={log.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${typeLabels[log.type]?.color || 'bg-gray-100 text-gray-700'}`}>
                      {typeLabels[log.type]?.label || log.type}
                    </span>
                    {log.remark && <span className="text-gray-500 text-sm">{log.remark}</span>}
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${log.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {log.amount > 0 ? '+' : ''}{log.amount}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
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
