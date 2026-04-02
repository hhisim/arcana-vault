'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  useEffect(() => {
    // Redirect to the combined auth page in login mode
    router.replace('/signup?mode=login')
  }, [router])
  return null
}
