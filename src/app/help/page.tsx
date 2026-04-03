'use client'

import Link from 'next/link'

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">帮助中心</h1>
          <p className="text-white/90 text-lg">
            常见问题解答
          </p>
        </div>

        {/* 快速链接 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">🚀 快速开始</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
              <div>
                <h3 className="font-medium text-gray-800">注册/登录账号</h3>
                <p className="text-gray-600 text-sm mt-1">
                  点击首页「登录」按钮，使用Google账号授权登录即可。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
              <div>
                <h3 className="font-medium text-gray-800">选择艺术风格</h3>
                <p className="text-gray-600 text-sm mt-1">
                  在首页风格列表中选择您喜欢的风格，如吉卜力、皮克斯、日系手办等。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
              <div>
                <h3 className="font-medium text-gray-800">上传照片</h3>
                <p className="text-gray-600 text-sm mt-1">
                  点击上传按钮或拖拽照片到上传区域，支持JPG/PNG格式，最大5MB。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
              <div>
                <h3 className="font-medium text-gray-800">生成并下载</h3>
                <p className="text-gray-600 text-sm mt-1">
                  点击「开始生成」，等待AI处理完成后即可预览和下载您的艺术作品。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 常见问题 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">❓ 常见问题</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 rounded-xl p-4 group" open>
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                如何获取积分？
              </summary>
              <div className="mt-3 pl-6 text-gray-600 text-sm space-y-2">
                <p>• <strong>每日登录：</strong>每天登录可领取5积分</p>
                <p>• <strong>邀请好友：</strong>分享您的邀请码，好友注册双方各得20积分</p>
                <p>• <strong>购买积分：</strong>升级VIP会员可获得大量积分</p>
              </div>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                生成一张图片需要多少积分？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm">
                普通用户每次生成消耗 <strong>2积分</strong>，VIP会员享受8折优惠，仅需 <strong>1积分</strong>。
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                上传的照片会被保存吗？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm">
                <strong>不会。</strong>所有上传的图片仅用于AI处理需要，处理完成后立即自动删除。我们非常重视用户隐私，不会将您的照片用于任何其他用途。
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                支持哪些图片格式？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm">
                目前支持 JPG、JPEG、PNG 格式的图片。图片大小不能超过5MB。
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                如何升级VIP会员？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm">
                登录后进入「<Link href="/account" className="text-purple-600 hover:underline">账户中心</Link>」，点击「升级会员」即可选择套餐购买。VIP会员可享受8折生成优惠、专属风格、优先排队等权益。
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                VIP会员有什么专属权益？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm space-y-1">
                <p>• 生成图片 8 折优惠（每次仅需1积分）</p>
                <p>• VIP专属艺术风格</p>
                <p>• 优先排队，生成速度更快</p>
                <p>• 专属客服支持</p>
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                积分可以退款吗？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm">
                由于积分购买为虚拟商品，购买成功后无法退款。请在购买前仔细阅读套餐说明。
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                支付失败了怎么办？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm">
                如果支付过程中遇到问题，请稍后重试。如问题持续存在，请联系客服帮您处理。
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                可以自定义提示词吗？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm">
                可以的。在生成页面底部有「自定义提示词」输入框，您可以输入想要的效果描述来自定义生成结果。
              </p>
            </details>

            <details className="bg-gray-50 rounded-xl p-4 group">
              <summary className="font-medium text-gray-800 cursor-pointer flex items-center gap-2">
                <span className="text-purple-500">Q:</span>
                生成的图片可以商用吗？
              </summary>
              <p className="mt-3 pl-6 text-gray-600 text-sm">
                目前通过ImgArt生成的所有图片仅供个人学习、研究和娱乐使用。如需商用授权，请联系我们。
              </p>
            </details>
          </div>
        </div>

        {/* 联系客服 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📧 其他问题</h2>
          <p className="text-gray-600 mb-4">
            如果您的问题没有在上面的FAQ中找到答案，欢迎通过以下方式联系我们：
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <p className="text-gray-700">
              <strong>客服邮箱：</strong>support@imgart.shop
            </p>
            <p className="text-gray-500 text-sm mt-2">
              我们会在1-3个工作日内回复您的问题
            </p>
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-8 text-center text-white/80 text-sm space-y-2">
          <div className="flex justify-center gap-4">
            <Link href="/pricing" className="hover:text-white">定价</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white">关于我们</Link>
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
