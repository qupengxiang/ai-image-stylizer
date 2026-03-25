import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { isVIP } from '@/lib/utils'

export async function GET() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      _count: {
        select: { generations: true, creditLogs: true }
      }
    }
  })

  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  }

  // 获取今日使用次数
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayUsage = await prisma.generation.count({
    where: {
      userId: user.id,
      createdAt: { gte: todayStart }
    }
  })

  // 获取本月使用次数
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthUsage = await prisma.generation.count({
    where: {
      userId: user.id,
      createdAt: { gte: monthStart }
    }
  })

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    credits: user.credits,
    totalCredits: user.totalCredits,
    totalUsage: user.totalUsage,
    vipExpireAt: user.vipExpireAt,
    inviteCode: user.inviteCode,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    isVIP: isVIP(user.vipExpireAt),
    stats: {
      todayUsage,
      monthUsage,
      totalGenerations: user._count.generations,
    }
  })
}
