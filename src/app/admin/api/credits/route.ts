import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkAdmin } from '@/middleware/admin'

export async function PATCH(request: Request) {
  const auth = await checkAdmin()
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { userId, amount, remark } = await request.json()

    if (!userId || amount === undefined) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const newBalance = user.credits + amount

    if (newBalance < 0) {
      return NextResponse.json({ error: '积分不足' }, { status: 400 })
    }

    // 更新用户积分和记录日志
    const [updatedUser, creditLog] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: newBalance,
          totalCredits: amount > 0 ? { increment: amount } : user.totalCredits,
        }
      }),
      prisma.creditLog.create({
        data: {
          userId,
          type: 'ADMIN_ADJUST',
          amount,
          balance: newBalance,
          remark: remark || `管理员调整: ${amount > 0 ? '+' : ''}${amount}`,
        }
      })
    ])

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        credits: updatedUser.credits,
      },
      log: {
        id: creditLog.id,
        amount: creditLog.amount,
        balance: creditLog.balance,
      }
    })
  } catch (error) {
    console.error('积分调整失败:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}
