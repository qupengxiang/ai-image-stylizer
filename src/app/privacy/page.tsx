'use client'

import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">隐私政策</h1>
          <p className="text-white/90 text-lg">
            最后更新：2024年1月
          </p>
        </div>

        {/* 内容 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">简介</h2>
              <div className="text-gray-600 space-y-4">
                <p>
                  ImgArt（以下简称"我们"）非常重视您的隐私和个人信息保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的信息。
                </p>
                <p>
                  使用我们的服务即表示您同意我们按照本隐私政策收集和使用您的信息。如果您不同意本政策，请勿使用我们的服务。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">我们收集的信息</h2>
              <div className="text-gray-600 space-y-4">
                <p><strong>1. 您主动提供的信息：</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>账户信息：当您使用Google账号登录时，我们会获取您的基本个人信息，包括姓名、邮箱地址和头像</li>
                  <li>积分信息：您的积分余额、积分获取和消费记录</li>
                  <li>VIP信息：您的会员状态、订阅期限</li>
                </ul>

                <p className="mt-4"><strong>2. 您上传的内容：</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>您上传的照片和图片</li>
                  <li>您输入的自定义提示词</li>
                </ul>

                <p className="mt-4"><strong>3. 自动收集的信息：</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>设备信息：设备类型、操作系统、浏览器类型</li>
                  <li>使用数据：访问时间、浏览页面、功能使用情况</li>
                  <li>Cookie：用于记住您的偏好和登录状态</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">我们如何使用您的信息</h2>
              <div className="text-gray-600 space-y-4">
                <p>我们使用收集的信息用于：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>提供和改进我们的服务</li>
                  <li>处理您的图片生成请求</li>
                  <li>管理您的账户和积分</li>
                  <li>向您发送服务相关的通知</li>
                  <li>分析和优化服务性能</li>
                  <li>防止欺诈和滥用</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">图片处理与存储</h2>
              <div className="text-gray-600 space-y-4">
                <p className="font-medium text-red-600">
                  🔒 这是我们隐私保护的核心原则：
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>即时处理：</strong>您上传的图片仅用于AI处理需要</li>
                  <li><strong>自动删除：</strong>处理完成后，图片立即自动删除，不会永久存储</li>
                  <li><strong>不用于训练：</strong>您的图片绝不会用于AI模型训练</li>
                  <li><strong>不分享：</strong>我们不会将您的图片分享、出售或提供给任何第三方</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookie使用</h2>
              <div className="text-gray-600 space-y-4">
                <p>我们使用Cookie来：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>记住您的登录状态</li>
                  <li>保存您的偏好设置</li>
                  <li>分析网站流量和使用情况</li>
                </ul>
                <p className="mt-4">
                  您可以通过浏览器设置拒绝Cookie，但这可能影响某些功能的使用。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">第三方服务</h2>
              <div className="text-gray-600 space-y-4">
                <p>我们可能使用以下第三方服务：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google登录：</strong>用于用户身份验证</li>
                  <li><strong>PayPal：</strong>处理支付交易</li>
                  <li><strong>AI图像生成API：</strong>提供图像风格转换功能</li>
                  <li><strong>Google Analytics：</strong>分析网站使用情况</li>
                </ul>
                <p className="mt-4">
                  这些第三方服务有其自身的隐私政策，我们建议您了解其隐私条款。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">信息安全</h2>
              <div className="text-gray-600 space-y-4">
                <p>我们采取多种安全措施来保护您的信息：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>数据传输使用加密（SSL/HTTPS）</li>
                  <li>数据库存储加密处理</li>
                  <li>严格的访问控制</li>
                  <li>定期安全审计</li>
                </ul>
                <p className="mt-4">
                  虽然我们会尽力保护您的信息安全，但没有任何系统是完全安全的。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">您的权利</h2>
              <div className="text-gray-600 space-y-4">
                <p>您有权：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>访问您的个人信息和账户数据</li>
                  <li>更正不准确的信息</li>
                  <li>删除您的账户和数据（联系我们）</li>
                  <li>撤回同意（但这不影响之前处理的合法性）</li>
                  <li>投诉权：向相关监管机构投诉</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">儿童隐私</h2>
              <div className="text-gray-600 space-y-4">
                <p>
                  我们的服务不面向13岁以下的儿童。我们不会故意收集儿童的个人信息。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">政策变更</h2>
              <div className="text-gray-600 space-y-4">
                <p>
                  我们可能会不时更新本隐私政策。修改后的政策将在本页面公布。
                </p>
                <p>
                  重大变更我们会通过网站公告或邮件通知您。继续使用我们的服务即表示您接受更新后的政策。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">联系我们</h2>
              <div className="text-gray-600 space-y-4">
                <p>如果您对本隐私政策有任何疑问或建议，请联系我们：</p>
                <div className="bg-gray-50 rounded-xl p-4 mt-4">
                  <p><strong>邮箱：</strong>support@imgart.shop</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 页脚 */}
        <div className="mt-8 text-center text-white/80 text-sm space-y-2">
          <div className="flex justify-center gap-4">
            <Link href="/pricing" className="hover:text-white">定价</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white">关于我们</Link>
            <span>•</span>
            <Link href="/help" className="hover:text-white">帮助中心</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white">服务条款</Link>
          </div>
          <p>© 2024 ImgArt. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
