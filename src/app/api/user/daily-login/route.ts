import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function POST() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  }

  // 检查今日是否已领取
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayLogin = await prisma.creditLog.findFirst({
    where: {
      userId: user.id,
      type: 'LOGIN_DAILY',
      createdAt: { gte: todayStart }
    }
  })

  if (todayLogin) {
    return NextResponse.json({ error: '今日已领取', alreadyClaimed: true }, { status: 400 })
  }

  // 发放每日积分
  const newBalance = user.credits + 5

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        credits: newBalance,
        totalCredits: { increment: 5 },
      }
    }),
    prisma.creditLog.create({
      data: {
        userId: user.id,
        type: 'LOGIN_DAILY',
        amount: 5,
        balance: newBalance,
        remark: '每日登录赠送',
      }
    })
  ])

  return NextResponse.json({
    success: true,
    amount: 5,
    balance: newBalance
  })
}
