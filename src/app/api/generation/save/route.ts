import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

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

  const { styleId, styleName, prompt, resultUrl } = await request.json()

  if (!resultUrl) {
    return NextResponse.json({ error: '缺少图片地址' }, { status: 400 })
  }

  // 保存生成记录
  const generation = await prisma.generation.create({
    data: {
      userId: user.id,
      style: styleId,
      prompt: prompt,
      resultUrl: resultUrl,
    }
  })

  return NextResponse.json({
    success: true,
    generationId: generation.id,
  })
}

// 获取用户的所有生成记录
export async function GET() {
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

  // 获取用户的生成记录，按时间倒序
  const generations = await prisma.generation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 100, // 最多返回100条
  })

  return NextResponse.json({ generations })
}
