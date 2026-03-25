import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { VIP_PACKAGES } from '@/lib/utils'

// PayPal API helpers
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

  const { packageType } = await request.json()

  if (!packageType || !VIP_PACKAGES[packageType as keyof typeof VIP_PACKAGES]) {
    return NextResponse.json({ error: '无效的套餐' }, { status: 400 })
  }

  const pkg = VIP_PACKAGES[packageType as keyof typeof VIP_PACKAGES]
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  }

  // 创建本地订单记录
  const order = await prisma.vIPOrder.create({
    data: {
      userId: user.id,
      package: packageType as any,
      amount: Math.round(pkg.price * 100), // 转为分
      status: 'PENDING',
      expireAt: new Date(Date.now() + pkg.days * 24 * 60 * 60 * 1000),
    },
  })

  try {
    // 获取 PayPal Access Token
    const { accessToken, baseUrl } = await getPayPalAccessToken()

    console.log('PayPal credentials loaded, mode:', process.env.PAYPAL_MODE, 'baseUrl:', baseUrl)

    const usdPrice = Number((pkg.price / 7.2).toFixed(2))
    console.log('Creating order with USD price:', usdPrice, 'package:', pkg.name)

    // 创建 PayPal 订单
    const paypalResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: usdPrice,
          },
          description: `ImgArt ${pkg.name}`,
          custom_id: order.id,
        }],
      }),
    })

    console.log('PayPal response status:', paypalResponse.status)

    const paypalOrder = await paypalResponse.json()
    console.log('PayPal response:', JSON.stringify(paypalOrder))

    if (!paypalResponse.ok) {
      console.error('PayPal create order failed:', paypalOrder)
      await prisma.vIPOrder.update({
        where: { id: order.id },
        data: { status: 'CANCELLED' },
      })
      return NextResponse.json({ error: '支付创建失败: ' + (paypalOrder.message || paypalOrder.name || JSON.stringify(paypalOrder)) }, { status: 500 })
    }

    // 找到 approval URL
    const approvalUrl = paypalOrder.links?.find((link: any) => link.rel === 'approve')?.href

    // 更新本地订单的 tradeNo
    await prisma.vIPOrder.update({
      where: { id: order.id },
      data: { tradeNo: paypalOrder.id },
    })

    return NextResponse.json({
      orderId: order.id,
      paypalOrderId: paypalOrder.id,
      approvalUrl,
    })
  } catch (error) {
    console.error('PayPal error:', error)
    await prisma.vIPOrder.update({
      where: { id: order.id },
      data: { status: 'CANCELLED' },
    })
    return NextResponse.json({ error: '支付服务异常' }, { status: 500 })
  }
}
