'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function UserCenterRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to new SEO-friendly URL
    router.replace('/account')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">正在跳转到新地址...</p>
      </div>
    </div>
  )
}
