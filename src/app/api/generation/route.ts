import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { isVIP, getGenerationCost } from '@/lib/utils'

export async function POST(request: Request) {
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

  // 计算积分消耗
  const isVIPUser = isVIP(user.vipExpireAt)
  const cost = getGenerationCost(isVIPUser)

  // 检查积分是否充足
  if (user.credits < cost) {
    return NextResponse.json({ error: '积分不足', code: 'INSUFFICIENT_CREDITS' }, { status: 400 })
  }

  // 扣减积分并记录
  const newBalance = user.credits - cost

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        credits: newBalance,
        totalUsage: { increment: 1 },
      }
    }),
    prisma.creditLog.create({
      data: {
        userId: user.id,
        type: 'GENERATE',
        amount: -cost,
        balance: newBalance,
        remark: `生成图片，消耗${cost}积分`,
      }
    })
  ])

  return NextResponse.json({
    success: true,
    cost,
    remainingCredits: newBalance,
  })
}
