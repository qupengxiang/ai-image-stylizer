import { Metadata } from 'next'
import VipContent from './VipContent'

export const metadata: Metadata = {
  title: '升级VIP会员 - ImgArt账户中心',
  description: '升级ImgArt VIP会员，享受生成图片8折优惠、专属艺术风格、优先排队等特权',
  keywords: ['ImgArt VIP', 'VIP会员', 'ImgArt会员升级', 'AI图片生成会员'],
  openGraph: {
    title: '升级VIP会员 | ImgArt账户中心',
    description: '升级ImgArt VIP会员，享受专属权益',
    type: 'website',
  },
}

export default function VipPage() {
  return <VipContent />
}
