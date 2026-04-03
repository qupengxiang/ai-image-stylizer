'use client'

import Link from 'next/link'
import { VIP_PACKAGES } from '@/lib/utils'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">💎 积分 & 会员</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            选择适合您的方案，解锁更多创意可能
          </p>
        </div>

        {/* 免费用户说明 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🆓 免费用户</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl mb-2">📅</p>
              <p className="text-gray-600 text-sm">每日登录赠送 5 积分</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl mb-2">👥</p>
              <p className="text-gray-600 text-sm">邀请好友各得 20 积分</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl mb-2">🖼️</p>
              <p className="text-gray-600 text-sm">每次生成消耗 2 积分</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
            <p className="text-gray-600 text-sm">
              <strong>提示：</strong>注册即送积分，每日登录还可领取免费积分，轻松体验所有风格！
            </p>
          </div>
        </div>

        {/* VIP权益 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">⭐ VIP会员权益</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl p-5 text-white text-center">
              <p className="text-4xl mb-2">💰</p>
              <p className="font-bold">8折优惠</p>
              <p className="text-sm opacity-90">生成图片积分打折</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl p-5 text-white text-center">
              <p className="text-4xl mb-2">🎨</p>
              <p className="font-bold">专属风格</p>
              <p className="text-sm opacity-90">VIP专属艺术风格</p>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl p-5 text-white text-center">
              <p className="text-4xl mb-2">⚡</p>
              <p className="font-bold">优先排队</p>
              <p className="text-sm opacity-90">生成速度更快</p>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl p-5 text-white text-center">
              <p className="text-4xl mb-2">💁</p>
              <p className="font-bold">专属客服</p>
              <p className="text-sm opacity-90">优先获得支持</p>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-yellow-800 font-medium">
              💡 VIP用户每次生成仅消耗 1 积分（原价 2 积分）
            </p>
          </div>
        </div>

        {/* 套餐列表 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💎 选择套餐</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(VIP_PACKAGES).map(([key, pkg]) => (
              <div
                key={key}
                className={`rounded-2xl border-2 overflow-hidden transition-all hover:shadow-xl ${
                  pkg.originalPrice > pkg.price 
                    ? 'border-yellow-400 ring-4 ring-yellow-200' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {pkg.originalPrice > pkg.price && (
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-center py-1 text-sm font-bold">
                    🎉 特惠
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{pkg.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{pkg.days} 天有效期</p>
                  
                  <div className="text-center mb-4">
                    {pkg.originalPrice > pkg.price && (
                      <span className="text-gray-400 line-through text-sm block">
                        ¥{pkg.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-purple-600">¥{pkg.price}</span>
                    <span className="text-gray-400 text-sm ml-1">(${pkg.priceUSD})</span>
                  </div>

                  <ul className="space-y-2 text-sm text-gray-600 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{pkg.credits} 积分</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>VIP专属风格</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>8折生成优惠</span>
                    </li>
                    {key === 'MONTHLY' && (
                      <li className="flex items-center gap-2 text-orange-500">
                        <span>🔥</span>
                        <span className="font-medium">最受欢迎</span>
                      </li>
                    )}
                    {key === 'YEARLY' && (
                      <li className="flex items-center gap-2 text-green-500">
                        <span>🎉</span>
                        <span className="font-medium">年度最佳</span>
                      </li>
                    )}
                  </ul>

                  <Link
                    href={`/account/vip?package=${key}`}
                    className={`block w-full py-3 rounded-xl font-bold text-center transition-all ${
                      pkg.originalPrice > pkg.price
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                    }`}
                  >
                    立即购买
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>💳 支持 PayPal 支付，安全便捷</p>
            <p className="mt-2">如有疑问，请联系客服</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ 常见问题</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer">
                积分会过期吗？
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                VIP会员有效期内积分不会过期。会员到期后，剩余积分仍可正常使用。
              </p>
            </details>
            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer">
                如何成为VIP会员？
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                登录后进入「账户中心」，点击「升级会员」即可选择套餐购买。支持PayPal支付。
              </p>
            </details>
            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer">
                支付失败怎么办？
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                如果支付过程中遇到问题，请稍后重试或联系客服帮您处理。
              </p>
            </details>
            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer">
                可以开发票吗？
              </summary>
              <p className="mt-2 text-gray-600 text-sm">
                目前暂不支持开发票，如有特殊需求请联系客服。
              </p>
            </details>
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-8 text-center text-white/80 text-sm space-y-2">
          <div className="flex justify-center gap-4">
            <Link href="/about" className="hover:text-white">关于我们</Link>
            <span>•</span>
            <Link href="/help" className="hover:text-white">帮助中心</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white">服务条款</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white">隐私政策</Link>
          </div>
          <p>© 2024 ImgArt. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
