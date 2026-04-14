'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    // Wait for auth to resolve before redirecting
    if (auth.loading) return

    if (auth.isAuthenticated) {
      router.replace('/account')
    } else {
      // Redirect to the dedicated login form on the signup page
      router.replace('/signup?mode=login')
    }
  }, [router, auth.isAuthenticated, auth.loading])

  // Show nothing while auth resolves — prevents flash of wrong content
  return null
}
