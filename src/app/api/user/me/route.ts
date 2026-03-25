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
        select: { creditLogs: true }
      }
    }
  })

  if (!user) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 })
  }

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
      todayUsage: 0,
      monthUsage: 0,
      totalGenerations: user.totalUsage,
    }
  })
}
