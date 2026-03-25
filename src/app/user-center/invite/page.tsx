'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserInfo {
  inviteCode: string
  name: string
  email: string
}

export default function InvitePage() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const res = await fetch('/api/user/me')
      const data = await res.json()
      setUser(data)
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyInviteCode = () => {
    if (user?.inviteCode) {
      navigator.clipboard.writeText(user.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}?invite=${user?.inviteCode}` : ''

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            <h1 className="text-2xl font-bold text-gray-800">👥 邀请好友</h1>
            <div></div>
          </div>

          {/* 邀请码 */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
            <p className="text-gray-600 text-center mb-4">分享您的邀请码，好友注册后双方各得 <span className="text-purple-600 font-bold">20积分</span></p>
            
            <div className="bg-white rounded-lg p-6 text-center mb-4">
              <p className="text-gray-500 text-sm mb-2">您的邀请码</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-bold text-purple-600 tracking-wider">{user?.inviteCode}</span>
                <button
                  onClick={copyInviteCode}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {copied ? '已复制!' : '复制'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6">
              <p className="text-gray-500 text-sm mb-2">邀请链接</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-600"
                />
                <button
                  onClick={copyShareLink}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {copied ? '已复制!' : '复制链接'}
                </button>
              </div>
            </div>
          </div>

          {/* 邀请规则 */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">📜 邀请规则</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>1. 复制邀请码或邀请链接分享给好友</li>
              <li>2. 好友使用您的邀请码注册账号</li>
              <li>3. 好友注册成功后，您和好友各获得 <span className="text-green-600 font-bold">20积分</span></li>
              <li>4. 积分自动发放，可在我的用户中心查看</li>
              <li>5. 邀请无上限，邀请越多赚越多！</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
