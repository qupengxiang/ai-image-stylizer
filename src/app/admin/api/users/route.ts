import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkAdmin } from '@/middleware/admin'

export async function GET(request: Request) {
  const auth = await checkAdmin()
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const role = searchParams.get('role')
  const search = searchParams.get('search') || ''
  const skip = (page - 1) * limit

  const where: any = {}
  if (role && role !== 'ALL') {
    where.role = role
  }
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [users, total, stats] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: {
          select: { generations: true, creditLogs: true }
        }
      }
    }),
    prisma.user.count({ where }),
    prisma.user.count({
      where: { role: 'VIP' },
    }),
  ])

  // 今日新增用户
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayNew = await prisma.user.count({
    where: { createdAt: { gte: todayStart } }
  })

  return NextResponse.json({
    users: users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      image: u.image,
      role: u.role,
      credits: u.credits,
      totalCredits: u.totalCredits,
      totalUsage: u.totalUsage,
      vipExpireAt: u.vipExpireAt,
      inviteCode: u.inviteCode,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      stats: {
        generations: u._count.generations,
        creditLogs: u._count.creditLogs,
      }
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
    stats: {
      totalUsers: total,
      vipUsers: stats,
      todayNew,
    }
  })
}
