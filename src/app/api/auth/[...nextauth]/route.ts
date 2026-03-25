import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/db"
import { generateInviteCode } from "@/lib/utils"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user.email) {
        try {
          // 查询是否已存在用户
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })

          if (existingUser) {
            // 已存在用户，更新登录信息
            await prisma.user.update({
              where: { email: user.email },
              data: {
                name: user.name,
                image: user.image,
                lastLoginAt: new Date(),
              },
            })
          } else {
            // 新用户注册，生成邀请码
            let inviteCode = generateInviteCode()
            // 确保邀请码唯一
            while (await prisma.user.findUnique({ where: { inviteCode } })) {
              inviteCode = generateInviteCode()
            }

            // 查找邀请人
            const inviteParam = (account?.params as any)?.invite_code ||
                              (profile as any)?.invite_code ||
                              null

            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                inviteCode,
                invitedBy: null, // 暂时不处理邀请关系，后续可扩展
                lastLoginAt: new Date(),
                creditLogs: {
                  create: {
                    type: 'REGISTER',
                    amount: 100,
                    balance: 100,
                    remark: '新用户注册赠送',
                  },
                },
              },
            })
          }
        } catch (e) {
          console.error("Database error:", e)
        }
      }
      return true
    },
    async session({ session }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (dbUser) {
          session.user.id = dbUser.id
          session.user.role = dbUser.role
          session.user.credits = dbUser.credits
        }
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
