import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export async function checkAdmin() {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return { error: '未登录', status: 401 }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user || user.role !== 'ADMIN') {
    return { error: '无权限访问', status: 403 }
  }

  return { user }
}
