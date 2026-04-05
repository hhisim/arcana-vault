'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()
  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace('/account')
    } else {
      router.replace('/signup?mode=login')
    }
  }, [router, auth.isAuthenticated])
  return null
}
