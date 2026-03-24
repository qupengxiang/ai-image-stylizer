import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 })
  }

  const { style, prompt, resultUrl } = await request.json()

  const generation = await prisma.generation.create({
    data: {
      userId: session.user.id,
      style,
      prompt,
      resultUrl,
    },
  })

  return NextResponse.json(generation)
}

export async function GET() {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 })
  }

  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json(generations)
}
