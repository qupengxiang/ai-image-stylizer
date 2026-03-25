'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserStats {
  id: string
  email: string
  name: string
  image: string
  role: string
  credits: number
  totalCredits: number
  totalUsage: number
  vipExpireAt: string | null
  inviteCode: string
  isVIP: boolean
  stats: {
    todayUsage: number
    monthUsage: number
    totalGenerations: number
  }
}

export default function UserCenter() {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status])

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/me')
      const data = await res.json()
      setUser(data)
      // 检查今日是否已领取
      checkDailyClaim()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkDailyClaim = async () => {
    try {
      // 尝试领取，如果已领取会返回错误
      const res = await fetch('/api/user/daily-login', { method: 'POST' })
      if (res.ok) {
        setClaimed(true)
        fetchUserData() // 刷新用户数据
      }
    } catch {
      // 忽略
    }
  }

  const handleClaimDaily = async () => {
    setClaiming(true)
    try {
      const res = await fetch('/api/user/daily-login', { method: 'POST' })
      if (res.ok) {
        setClaimed(true)
        fetchUserData()
        alert('领取成功！+5积分')
      } else {
        const data = await res.json()
        if (data.alreadyClaimed) {
          setClaimed(true)
          alert('今日已领取')
        }
      }
    } catch (error) {
      console.error('领取失败:', error)
    } finally {
      setClaiming(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">请先登录</h2>
          <p className="mt-2 text-gray-600">需要登录后才能访问用户中心</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">👤 用户中心</h1>
            <button
              onClick={() => signOut()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              退出登录
            </button>
          </div>

          {/* 用户信息卡片 */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              {user?.image ? (
                <img src={user.image} alt={user.name || ''} className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-300 flex items-center justify-center text-2xl">👤</div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user?.name || '用户'}</h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${user?.isVIP ? 'bg-yellow-400 text-yellow-800' : 'bg-gray-200 text-gray-600'}`}>
                    {user?.isVIP ? '⭐ VIP会员' : '🆓 免费用户'}
                  </span>
                  {user?.vipExpireAt && user?.isVIP && (
                    <span className="text-xs text-gray-500">到期: {new Date(user.vipExpireAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 积分显示 */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">剩余积分</p>
                  <p className="text-3xl font-bold text-purple-600">{user?.credits}</p>
                </div>
                {!claimed && (
                  <button
                    onClick={handleClaimDaily}
                    disabled={claiming}
                    className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all disabled:opacity-50"
                  >
                    {claiming ? '领取中...' : '🎁 每日+5积分'}
                  </button>
                )}
                {claimed && (
                  <span className="text-green-500 font-bold">✅ 今日已领取</span>
                )}
              </div>
            </div>

            {/* 邀请码 */}
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-500 text-sm mb-1">我的邀请码</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-purple-600 tracking-wider">{user?.inviteCode}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(user?.inviteCode || '')}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                >
                  复制
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">邀请好友注册，双方各得20积分</p>
            </div>
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-blue-500 text-2xl mb-1">📅</p>
              <p className="text-gray-500 text-xs">今日使用</p>
              <p className="text-2xl font-bold text-blue-600">{user?.stats.todayUsage}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-green-500 text-2xl mb-1">📆</p>
              <p className="text-gray-500 text-xs">本月使用</p>
              <p className="text-2xl font-bold text-green-600">{user?.stats.monthUsage}</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-purple-500 text-2xl mb-1">📊</p>
              <p className="text-gray-500 text-xs">总使用量</p>
              <p className="text-2xl font-bold text-purple-600">{user?.stats.totalGenerations}</p>
            </div>
          </div>

          {/* 功能菜单 */}
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/user-center/credits"
              className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white p-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-3"
            >
              <span className="text-2xl">💰</span>
              <div className="text-left">
                <p className="text-lg">积分明细</p>
                <p className="text-xs opacity-80">查看积分记录</p>
              </div>
            </Link>
            <Link
              href="/user-center/invite"
              className="bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white p-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-3"
            >
              <span className="text-2xl">👥</span>
              <div className="text-left">
                <p className="text-lg">邀请好友</p>
                <p className="text-xs opacity-80">邀请得积分</p>
              </div>
            </Link>
            <Link
              href="/user-center/membership"
              className="bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white p-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-3"
            >
              <span className="text-2xl">👑</span>
              <div className="text-left">
                <p className="text-lg">升级会员</p>
                <p className="text-xs opacity-80">享受更多权益</p>
              </div>
            </Link>
            <Link
              href="/user-center/usage"
              className="bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white p-4 rounded-xl font-bold shadow-lg transition-all flex items-center gap-3"
            >
              <span className="text-2xl">📈</span>
              <div className="text-left">
                <p className="text-lg">使用记录</p>
                <p className="text-xs opacity-80">查看历史生成</p>
              </div>
            </Link>
          </div>
        </div>

        {/* 提示信息 */}
        <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center text-white">
          <p className="font-medium">💡 提示：生成图片每次消耗2积分，VIP用户仅消耗1积分</p>
        </div>
      </div>
    </div>
  )
}
