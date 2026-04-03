'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">关于 ImgArt</h1>
          <p className="text-white/90 text-lg">
            用AI让每个人都能轻松创作艺术
          </p>
        </div>

        {/* 简介 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🎨 我们是谁</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              ImgArt 是一款免费的在线AI图片风格转换工具。我们致力于让每个人都能轻松地将普通照片转换成各种艺术风格，无需任何设计技能。
            </p>
            <p>
              无论是吉卜力动画的温暖画风、皮克斯的3D效果、复古的像素风格，还是各种独特的艺术效果，ImgArt 都能一键帮你实现。
            </p>
          </div>
        </div>

        {/* 核心价值 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💡 我们的理念</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <p className="text-4xl mb-3">🚀</p>
              <h3 className="font-bold text-gray-800 mb-2">简单快捷</h3>
              <p className="text-gray-600 text-sm">
                上传照片，选择风格，几秒钟即可获得艺术作品
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <p className="text-4xl mb-3">🎯</p>
              <h3 className="font-bold text-gray-800 mb-2">高品质</h3>
              <p className="text-gray-600 text-sm">
                采用先进AI技术，确保生成图片的清晰度和艺术效果
              </p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <p className="text-4xl mb-3">🔒</p>
              <h3 className="font-bold text-gray-800 mb-2">隐私保护</h3>
              <p className="text-gray-600 text-sm">
                图片仅用于生成过程，处理后立即删除，不存储不分享
              </p>
            </div>
          </div>
        </div>

        {/* 功能特色 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">✨ 功能特色</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">🎨</span>
              <div>
                <h3 className="font-medium text-gray-800">50+ 艺术风格</h3>
                <p className="text-gray-600 text-sm">涵盖动漫、3D、像素、复古等多种风格</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">📱</span>
              <div>
                <h3 className="font-medium text-gray-800">支持多尺寸</h3>
                <p className="text-gray-600 text-sm">支持1:1、4:3、16:9等多种比例</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-medium text-gray-800">快速生成</h3>
                <p className="text-gray-600 text-sm">AI驱动，快速完成图片转换</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">💎</span>
              <div>
                <h3 className="font-medium text-gray-800">积分体系</h3>
                <p className="text-gray-600 text-sm">免费获取积分，VIP享受更多权益</p>
              </div>
            </div>
          </div>
        </div>

        {/* 技术说明 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 技术说明</h2>
          <div className="text-gray-600 space-y-4">
            <p>
              ImgArt 采用先进的AI图像生成技术，能够智能识别照片中的人物、背景，并将其转换为目标艺术风格。
            </p>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-800 mb-2">支持的图片格式</h3>
              <p className="text-sm">JPG、JPEG、PNG（最大5MB）</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-800 mb-2">隐私声明</h3>
              <p className="text-sm">
                所有上传的图片仅用于AI处理需要，处理完成后立即自动删除，我们不会将您的图片用于任何其他用途或提供给第三方。
              </p>
            </div>
          </div>
        </div>

        {/* 联系 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📧 联系我们</h2>
          <p className="text-gray-600 mb-4">
            如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们：
          </p>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-600">客服邮箱：support@imgart.shop</p>
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-8 text-center text-white/80 text-sm space-y-2">
          <div className="flex justify-center gap-4">
            <Link href="/pricing" className="hover:text-white">定价</Link>
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
