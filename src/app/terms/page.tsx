'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">服务条款</h1>
          <p className="text-white/90 text-lg">
            最后更新：2024年1月
          </p>
        </div>

        {/* 内容 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. 服务说明</h2>
              <div className="text-gray-600 space-y-4">
                <p>
                  ImgArt 是一个在线AI图片风格转换工具（以下简称"本服务"）。我们提供将用户上传的照片通过AI技术转换成各种艺术风格的服务。
                </p>
                <p>
                  使用本服务即表示您同意遵守本服务条款。如果您不同意本条款的任何部分，请勿使用本服务。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. 用户账户</h2>
              <div className="text-gray-600 space-y-4">
                <p><strong>2.1 账户注册：</strong>您可以使用Google账号登录来创建账户。</p>
                <p><strong>2.2 账户安全：</strong>您有责任保护您的账户安全，对在您账户下发生的所有活动负责。</p>
                <p><strong>2.3 账户终止：</strong>我们保留在任何时候终止或暂停您账户的权利，特别是如果您违反本条款。</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. 积分与付费服务</h2>
              <div className="text-gray-600 space-y-4">
                <p><strong>3.1 积分获取：</strong>用户可以通过每日登录、邀请好友或购买VIP会员来获取积分。</p>
                <p><strong>3.2 积分使用：</strong>积分用于支付图片生成服务，每次生成消耗相应积分。</p>
                <p><strong>3.3 积分退款：</strong>积分购买为虚拟商品，一经购买成功无法退款。</p>
                <p><strong>3.4 VIP会员：</strong>VIP会员权益包括专属风格、8折生成优惠等，具体权益以购买时说明为准。</p>
                <p><strong>3.5 价格调整：</strong>我们保留随时调整服务价格的权利，但会提前通知用户。</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. 使用规范</h2>
              <div className="text-gray-600 space-y-4">
                <p>您同意不会使用本服务：</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>上传或生成任何违法、有害、欺诈、淫秽或令人反感的内容</li>
                  <li>侵犯任何第三方的知识产权或其他权利</li>
                  <li>尝试获取未经授权的访问权限</li>
                  <li>进行任何可能损害、禁用或影响我们服务器的活动</li>
                  <li>将本服务用于任何商业目的（除非我们明确允许）</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. 知识产权</h2>
              <div className="text-gray-600 space-y-4">
                <p><strong>5.1 用户内容：</strong>您上传的图片版权归您所有。我们不会对用户上传的图片主张任何权利。</p>
                <p><strong>5.2 生成内容：</strong>通过本服务生成的图片版权归您所有，但仅限于个人学习、研究和娱乐使用。</p>
                <p><strong>5.3 商业使用：</strong>如需将生成图片用于商业目的，请联系我们获得授权。</p>
                <p><strong>5.4 我们的权利：</strong>本服务的名称、标识、设计和相关元素均是我们的财产或已获得授权。</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. 隐私与数据</h2>
              <div className="text-gray-600 space-y-4">
                <p><strong>6.1 图片处理：</strong>您上传的图片仅用于AI处理需要，处理完成后立即自动删除。</p>
                <p><strong>6.2 账户信息：</strong>我们收集和使用您账户的相关信息，详情请参阅我们的隐私政策。</p>
                <p><strong>6.3 Cookie：</strong>我们使用Cookie来改善用户体验，详情请参阅隐私政策。</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. 服务变更与中断</h2>
              <div className="text-gray-600 space-y-4">
                <p><strong>7.1 服务调整：</strong>我们保留随时修改、暂停或终止本服务的权利，恕不另行通知。</p>
                <p><strong>7.2 不可抗力：</strong>对于因不可抗力导致的服务中断，我们不承担责任。</p>
                <p><strong>7.3 维护：</strong>我们会尽量在合适的时间进行系统维护，以减少对用户的影响。</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. 免责声明</h2>
              <div className="text-gray-600 space-y-4">
                <p>
                  本服务按"原样"提供，我们不对服务的准确性、完整性、可靠性或特定用途适用性做任何明示或暗示的保证。
                </p>
                <p>
                  在任何情况下，我们都不对因使用本服务而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. 条款修改</h2>
              <div className="text-gray-600 space-y-4">
                <p>
                  我们保留随时修改本条款的权利。修改后的条款将在本页面公布。如您继续使用本服务，即表示您接受修改后的条款。
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. 联系我们</h2>
              <div className="text-gray-600 space-y-4">
                <p>如果您对本条款有任何疑问，请联系我们：</p>
                <p>邮箱：support@imgart.shop</p>
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
            <Link href="/privacy" className="hover:text-white">隐私政策</Link>
          </div>
          <p>© 2024 ImgArt. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
