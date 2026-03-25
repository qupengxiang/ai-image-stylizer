'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { VIP_PACKAGES } from '@/lib/utils'

interface UserInfo {
  isVIP: boolean
  vipExpireAt: string | null
  credits: number
}

export default function MembershipPage() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchUserInfo()

    // 检查 URL 参数（PayPal 支付返回）
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const canceled = searchParams.get('canceled')

    if (canceled === 'true') {
      setMessage({ type: 'error', text: '支付已取消' })
    } else if (success === 'true' && orderId) {
      // 调用后端完成支付
      completePayment(orderId)
    }
  }, [searchParams])

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

  const completePayment = async (orderId: string) => {
    setProcessing(true)
    try {
      // 先获取本地订单信息
      const orderRes = await fetch(`/api/payment/order/${orderId}`)
      const orderData = await orderRes.json()
      
      if (!orderRes.ok) {
        setMessage({ type: 'error', text: orderData.error || '获取订单失败' })
        return
      }

      // 调用 success API 完成支付
      const res = await fetch('/api/payment/success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paypalOrderId: orderData.paypalOrderId,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: '🎉 支付成功！积分已到账，VIP已激活！' })
        fetchUserInfo() // 刷新用户信息
      } else {
        setMessage({ type: 'error', text: data.error || '支付处理失败' })
      }
    } catch (error) {
      console.error('支付完成失败:', error)
      setMessage({ type: 'error', text: '支付处理异常' })
    } finally {
      setProcessing(false)
    }
  }

  const handlePurchase = async (packageType: string) => {
    if (processing) return
    setProcessing(true)

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageType }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || '创建订单失败' })
        return
      }

      // 跳转到 PayPal
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        setMessage({ type: 'error', text: '获取支付链接失败' })
      }
    } catch (error) {
      console.error('创建订单失败:', error)
      setMessage({ type: 'error', text: '支付服务异常' })
    } finally {
      setProcessing(false)
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
            <h1 className="text-2xl font-bold text-gray-800">👑 升级会员</h1>
            <div></div>
          </div>

          {/* 消息提示 */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <p className="font-bold text-center">{message.text}</p>
            </div>
          )}

          {/* 当前状态 */}
          {user?.isVIP && (
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">⭐ VIP会员</h2>
                  <p className="opacity-90">到期时间: {user.vipExpireAt ? new Date(user.vipExpireAt).toLocaleDateString() : '未知'}</p>
                </div>
                <span className="text-4xl">👑</span>
              </div>
            </div>
          )}

          {/* 支付中提示 */}
          {processing && (
            <div className="mb-6 p-4 rounded-xl bg-blue-100 text-blue-700 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="font-bold">处理中，请稍候...</p>
              </div>
            </div>
          )}

          {/* VIP权益 */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">🎁 VIP会员权益</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>生成图片 8折优惠</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>专属艺术风格</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>优先排队生成</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-green-500">✓</span>
                <span>专属客服支持</span>
              </div>
            </div>
          </div>

          {/* 套餐列表 */}
          <h3 className="font-bold text-gray-800 mb-4">💎 选择套餐</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(VIP_PACKAGES).map(([key, pkg]) => (
              <div
                key={key}
                className={`bg-white rounded-xl border-2 ${pkg.originalPrice > pkg.price ? 'border-yellow-400' : 'border-gray-200'} overflow-hidden hover:shadow-lg transition-all ${processing ? 'opacity-50' : ''}`}
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 text-center">
                  <h4 className="font-bold text-lg">{pkg.name}</h4>
                  <p className="text-sm opacity-90">{pkg.days}天</p>
                </div>
                <div className="p-4">
                  <div className="text-center mb-3">
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-gray-400 line-through text-sm">¥{pkg.originalPrice}</span>
                    )}
                    <span className="text-2xl font-bold text-purple-600">${pkg.priceUSD}</span>
                    <span className="text-gray-400 text-sm ml-1">(~¥{pkg.price})</span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600 mb-4">
                    <li>📦 {pkg.credits} 积分</li>
                    <li>⏰ {pkg.days} 天有效期</li>
                    {key === 'MONTHLY' && <li className="text-orange-500">🔥 最受欢迎</li>}
                    {key === 'YEARLY' && <li className="text-green-500">🎉 年度最佳</li>}
                  </ul>
                  <button
                    onClick={() => handlePurchase(key)}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white py-2 rounded-lg font-bold transition-all"
                  >
                    立即购买
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 支付说明 */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>💳 支持 PayPal 支付，安全便捷</p>
          </div>
        </div>
      </div>
    </div>
  )
}
