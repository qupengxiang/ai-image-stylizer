// 生成6位随机邀请码
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// 判断VIP是否有效
export function isVIP(vipExpireAt: Date | null): boolean {
  if (!vipExpireAt) return false
  return new Date(vipExpireAt) > new Date()
}

// 计算生成图片消耗积分
export function getGenerationCost(isVIPUser: boolean): number {
  return isVIPUser ? 1 : 2
}

// VIP套餐配置（CNY价格 + USD价格）
export const VIP_PACKAGES = {
  TRIAL: {
    name: '体验版',
    days: 7,
    credits: 100,
    price: 9.9,
    priceUSD: 1.4,
    originalPrice: 9.9,
  },
  MONTHLY: {
    name: '月卡',
    days: 30,
    credits: 500,
    price: 29,
    priceUSD: 4.0,
    originalPrice: 29,
  },
  QUARTER: {
    name: '季卡',
    days: 90,
    credits: 1500,
    price: 79,
    priceUSD: 11.0,
    originalPrice: 99,
  },
  YEARLY: {
    name: '年卡',
    days: 365,
    credits: 8000,
    price: 299,
    priceUSD: 41.5,
    originalPrice: 499,
  },
} as const

export type VIPPackageType = keyof typeof VIP_PACKAGES
