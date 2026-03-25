'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface User {
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
  createdAt: string
  lastLoginAt: string | null
  stats: {
    generations: number
    creditLogs: number
  }
}

interface UserListResponse {
  users: User[]
  total: number
  page: number
  totalPages: number
  stats: {
    totalUsers: number
    vipUsers: number
    todayNew: number
  }
}

export default function AdminUsersPage() {
  const [data, setData] = useState<UserListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [adjustingCredits, setAdjustingCredits] = useState({ amount: '', remark: '' })
  const [adjusting, setAdjusting] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [page, roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        role: roleFilter,
        search,
      })
      const res = await fetch(`/admin/api/users?${params}`)
      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const handleAdjustCredits = async () => {
    if (!selectedUser || !adjustingCredits.amount) return

    setAdjusting(true)
    try {
      const res = await fetch('/admin/api/credits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseInt(adjustingCredits.amount),
          remark: adjustingCredits.remark,
        }),
      })

      if (res.ok) {
        alert('积分调整成功!')
        setSelectedUser(null)
        setAdjustingCredits({ amount: '', remark: '' })
        fetchUsers()
      } else {
        const error = await res.json()
        alert(error.error || '调整失败')
      }
    } catch (error) {
      console.error('调整积分失败:', error)
      alert('调整失败')
    } finally {
      setAdjusting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/admin" className="text-purple-600 hover:text-purple-700 font-medium">
              ← 返回管理后台
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">👥 用户管理</h1>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">共 {data?.total || 0} 用户</span>
            </div>
          </div>

          {/* 筛选和搜索 */}
          <div className="flex items-center gap-4 mb-6">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="bg-gray-100 border-0 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">全部用户</option>
              <option value="FREE">免费用户</option>
              <option value="VIP">VIP会员</option>
              <option value="ADMIN">管理员</option>
            </select>

            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索邮箱或昵称..."
                className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                搜索
              </button>
            </form>
          </div>

          {/* 用户列表 */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">积分</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data?.users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img src={user.image} alt={user.name || ''} className="w-10 h-10 rounded-full" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">👤</div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{user.name || '未设置昵称'}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'VIP' ? 'bg-yellow-400 text-yellow-800' : user.role === 'ADMIN' ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {user.role === 'VIP' ? '⭐ VIP' : user.role === 'ADMIN' ? '👑 Admin' : '🆓 Free'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-purple-600">{user.credits}</p>
                          <p className="text-xs text-gray-400">使用 {user.stats.generations} 次</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-600 px-4 py-1 rounded-lg text-sm font-medium transition-colors"
                          >
                            管理
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-gray-500 text-sm">
                  第 {page} 页，共 {data?.totalPages || 1} 页
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= (data?.totalPages || 1)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 用户详情弹窗 */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">👤 用户详情</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* 用户信息 */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  {selectedUser.image ? (
                    <img src={selectedUser.image} alt={selectedUser.name || ''} className="w-16 h-16 rounded-full" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-2xl">👤</div>
                  )}
                  <div>
                    <p className="font-bold text-lg">{selectedUser.name || '未设置昵称'}</p>
                    <p className="text-gray-500 text-sm">{selectedUser.email}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedUser.role === 'VIP' ? 'bg-yellow-400 text-yellow-800' : 'bg-gray-200 text-gray-600'}`}>
                      {selectedUser.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-xs">当前积分</p>
                    <p className="font-bold text-xl text-purple-600">{selectedUser.credits}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">历史获得</p>
                    <p className="font-bold text-xl text-green-600">{selectedUser.totalCredits}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">总使用次数</p>
                    <p className="font-bold text-xl text-orange-600">{selectedUser.stats.generations}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">邀请码</p>
                    <p className="font-bold text-sm">{selectedUser.inviteCode}</p>
                  </div>
                </div>

                {selectedUser.vipExpireAt && (
                  <div className="mt-4 bg-yellow-50 rounded-lg p-3">
                    <p className="text-yellow-700 text-sm">
                      ⭐ VIP到期: {new Date(selectedUser.vipExpireAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* 积分调整 */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-4">⚡ 积分调整</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={adjustingCredits.amount}
                      onChange={(e) => setAdjustingCredits(c => ({ ...c, amount: e.target.value }))}
                      placeholder="输入积分数量（正数增加，负数减少）"
                      className="flex-1 bg-white rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={adjustingCredits.remark}
                    onChange={(e) => setAdjustingCredits(c => ({ ...c, remark: e.target.value }))}
                    placeholder="调整备注（可选）"
                    className="w-full bg-white rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAdjustCredits}
                      disabled={adjusting || !adjustingCredits.amount}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
                    >
                      {adjusting ? '调整中...' : '确认调整'}
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      关闭
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
