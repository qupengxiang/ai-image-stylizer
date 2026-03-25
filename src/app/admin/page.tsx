'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AdminStats {
  totalUsers: number
  vipUsers: number
  todayNew: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats()
    }
  }, [status])

  const fetchStats = async () => {
    try {
      const res = await fetch('/admin/api/users')
      const data = await res.json()
      setStats(data.stats)
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">请先登录</h2>
          <p className="mt-2 text-gray-600">需要登录后才能访问管理后台</p>
        </div>
      </div>
    )
  }

  // 简单检查是否为管理员（实际应该从session获取role）
  // 临时跳转到用户中心作为占位
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🖥️</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">imgart 管理后台</h1>
                <p className="text-gray-500 text-sm">欢迎, {session.user?.name || session.user?.email}</p>
              </div>
            </div>
            <Link
              href="/user-center"
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              返回用户中心
            </Link>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <p className="text-blue-100 text-sm">总用户数</p>
              <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
              <p className="text-yellow-100 text-sm">VIP会员</p>
              <p className="text-3xl font-bold">{stats?.vipUsers || 0}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
              <p className="text-green-100 text-sm">今日新增</p>
              <p className="text-3xl font-bold">{stats?.todayNew || 0}</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <p className="text-purple-100 text-sm">活跃用户</p>
              <p className="text-3xl font-bold">-</p>
            </div>
          </div>

          {/* 管理菜单 */}
          <div className="grid grid-cols-3 gap-4">
            <Link
              href="/admin/users"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white p-6 rounded-xl font-bold shadow-lg transition-all flex items-center gap-4"
            >
              <span className="text-3xl">👥</span>
              <div className="text-left">
                <p className="text-lg">用户管理</p>
                <p className="text-sm opacity-80">查看和编辑用户信息</p>
              </div>
            </Link>
            <Link
              href="/admin/orders"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white p-6 rounded-xl font-bold shadow-lg transition-all flex items-center gap-4"
            >
              <span className="text-3xl">📋</span>
              <div className="text-left">
                <p className="text-lg">订单管理</p>
                <p className="text-sm opacity-80">查看和处理订单</p>
              </div>
            </Link>
            <Link
              href="/admin/credits"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-6 rounded-xl font-bold shadow-lg transition-all flex items-center gap-4"
            >
              <span className="text-3xl">💰</span>
              <div className="text-left">
                <p className="text-lg">积分管理</p>
                <p className="text-sm opacity-80">调整用户积分</p>
              </div>
            </Link>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">⚡ 快捷操作</h3>
          <div className="grid grid-cols-4 gap-4">
            <Link
              href="/admin/users"
              className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-lg text-center transition-colors"
            >
              <p className="font-medium">用户列表</p>
            </Link>
            <Link
              href="/admin/orders"
              className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-lg text-center transition-colors"
            >
              <p className="font-medium">订单列表</p>
            </Link>
            <Link
              href="/"
              className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-lg text-center transition-colors"
            >
              <p className="font-medium">返回首页</p>
            </Link>
            <button
              onClick={() => signOut()}
              className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-lg text-center transition-colors"
            >
              <p className="font-medium">退出登录</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function signOut() {
  // 实现登出
}
