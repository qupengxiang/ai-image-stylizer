import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { VIP_PACKAGES } from '@/lib/utils'

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_SECRET!
  const mode = process.env.PAYPAL_MODE || 'sandbox'
  
  const baseUrl = mode === 'sandbox' 
    ? 'https://api-m.sandbox.paypal.com' 
    : 'https://api-m.paypal.com'

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${secret}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  })

  const data = await response.json()
  return { accessToken: data.access_token, baseUrl }
}

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const { orderId, paypalOrderId } = await request.json()

  if (!orderId) {
    return NextResponse.json({ error: '缺少订单ID' }, { status: 400 })
  }

  // 查找本地订单
  const order = await prisma.vIPOrder.findUnique({
    where: { id: orderId },
  })

  if (!order) {
    return NextResponse.json({ error: '订单不存在' }, { status: 404 })
  }

  if (order.status === 'PAID') {
    return NextResponse.json({ error: '订单已支付' }, { status: 400 })
  }

  try {
    // 捕获 PayPal 支付
    const { accessToken, baseUrl } = await getPayPalAccessToken()

    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    const captureData = await captureResponse.json()

    if (!captureResponse.ok) {
      console.error('PayPal capture failed:', captureData)
      return NextResponse.json({ error: '支付捕获失败' }, { status: 500 })
    }

    // 支付成功！更新订单状态
    await prisma.vIPOrder.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    })

    // 获取套餐信息，给用户加积分
    const pkg = VIP_PACKAGES[order.package as keyof typeof VIP_PACKAGES]
    if (pkg) {
      // 检查用户是否是 VIP 会员（累加 VIP 时间）
      const user = await prisma.user.findUnique({ where: { id: order.userId } })
      if (user) {
        let newVipExpireAt = new Date()
        
        if (user.vipExpireAt && user.vipExpireAt > new Date()) {
          // 累加VIP时间
          newVipExpireAt = new Date(user.vipExpireAt.getTime() + pkg.days * 24 * 60 * 60 * 1000)
        } else {
          // 新VIP或已过期，从现在开始
          newVipExpireAt = new Date(Date.now() + pkg.days * 24 * 60 * 60 * 1000)
        }

        await prisma.user.update({
          where: { id: order.userId },
          data: {
            credits: { increment: pkg.credits },
            totalCredits: { increment: pkg.credits },
            role: 'VIP',
            vipExpireAt: newVipExpireAt,
          },
        })

        // 记录积分变动
        await prisma.creditLog.create({
          data: {
            userId: order.userId,
            type: 'PURCHASE',
            amount: pkg.credits,
            balance: user.credits + pkg.credits,
            remark: `VIP${pkg.name}充值：${pkg.credits}积分`,
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: '支付成功！积分已到账。',
    })
  } catch (error) {
    console.error('Payment capture error:', error)
    return NextResponse.json({ error: '支付处理异常' }, { status: 500 })
  }
}
