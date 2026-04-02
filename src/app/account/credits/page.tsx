import { Metadata } from 'next'
import CreditsContent from './CreditsContent'

export const metadata: Metadata = {
  title: '积分明细 - 账户中心',
  description: '查看您的ImgArt账户积分获取和使用记录，了解积分余额变化历史',
  keywords: ['ImgArt积分明细', '账户积分', '积分记录', 'ImgArt账户'],
  openGraph: {
    title: '积分明细 | ImgArt账户中心',
    description: '查看您的ImgArt账户积分获取和使用记录',
    type: 'website',
  },
}

export default function CreditsPage() {
  return <CreditsContent />
}
