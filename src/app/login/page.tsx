import { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: '登录 - ImgArt',
  description: '登录ImgArt账户，保存您的AI图片创作，获取更多积分和VIP特权',
  keywords: ['ImgArt登录', 'AI图片登录', 'ImgArt账户'],
  robots: {
    index: false, // 登录页不需要被索引
    follow: false,
  },
}

export default function LoginPage() {
  return <LoginForm />
}
