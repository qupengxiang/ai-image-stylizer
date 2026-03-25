import { NextResponse } from 'next/server'
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
  const body = await request.text()
  const headers = Object.fromEntries(request.headers)

  // PayPal Webhook 签名验证
  const transmissionId = headers['paypal-transmission-id']
  const transmissionTime = headers['paypal-transmission-time']
  const certUrl = headers['paypal-cert-url']
  const transmissionSig = headers['paypal-transmission-sig']
  const authAlgo = headers['paypal-auth-algo']

  if (!transmissionId || !transmissionSig) {
    return NextResponse.json({ error: 'Missing headers' }, { status: 400 })
  }

  try {
    // 验证 Webhook 签名
    const { accessToken, baseUrl } = await getPayPalAccessToken()

    const verifyResponse = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: authAlgo || 'SHA256withRSA',
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
        webhook_event: JSON.parse(body),
      }),
    })

    const verifyData = await verifyResponse.json()

    if (verifyData.verification_status !== 'SUCCESS') {
      console.error('Webhook signature verification failed:', verifyData)
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    }

    // 解析事件
    const event = JSON.parse(body)
    const eventType = event.event_type
    const resource = event.resource

    console.log('Received webhook event:', eventType)

    // 处理支付完成事件
    if (eventType === 'PAYMENT.CAPTURE.COMPLETED' || eventType === 'CHECKOUT.ORDER.COMPLETED') {
      // 获取本地订单ID（custom_id）
      const localOrderId = resource.custom_id || resource.purchase_units?.[0]?.custom_id
      
      if (!localOrderId) {
        console.error('No local order ID in webhook')
        return NextResponse.json({ received: true })
      }

      // 查找订单
      const order = await prisma.vIPOrder.findUnique({
        where: { id: localOrderId },
      })

      if (!order) {
        console.error('Order not found:', localOrderId)
        return NextResponse.json({ received: true })
      }

      // 检查是否已处理
      if (order.status === 'PAID') {
        console.log('Order already processed:', localOrderId)
        return NextResponse.json({ received: true })
      }

      // 处理支付
      const pkg = VIP_PACKAGES[order.package as keyof typeof VIP_PACKAGES]
      if (pkg) {
        // 更新订单状态
        await prisma.vIPOrder.update({
          where: { id: localOrderId },
          data: { status: 'PAID' },
        })

        // 获取用户
        const user = await prisma.user.findUnique({ where: { id: order.userId } })
        if (user) {
          // 计算新的VIP到期时间
          let newVipExpireAt = new Date()
          if (user.vipExpireAt && user.vipExpireAt > new Date()) {
            newVipExpireAt = new Date(user.vipExpireAt.getTime() + pkg.days * 24 * 60 * 60 * 1000)
          } else {
            newVipExpireAt = new Date(Date.now() + pkg.days * 24 * 60 * 60 * 1000)
          }

          // 更新用户
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
              remark: `VIP${pkg.name}充值（Webhook）：${pkg.credits}积分`,
            },
          })

          console.log('VIP activated for user:', order.userId, 'package:', order.package)
        }
      }
    }

    // 处理退款
    if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      console.log('Refund event received:', resource)
      // 可以在这里添加退款处理逻辑
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}
