import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }

  const { id } = await params

  const order = await prisma.vIPOrder.findUnique({
    where: { id },
  })

  if (!order) {
    return NextResponse.json({ error: '订单不存在' }, { status: 404 })
  }

  return NextResponse.json({
    orderId: order.id,
    paypalOrderId: order.tradeNo,
    status: order.status,
  })
}
