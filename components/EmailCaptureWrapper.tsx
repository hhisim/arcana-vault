'use client'

import EmailCapture from '@/components/EmailCapture'

type Props = {
  variant?: 'full' | 'compact'
  className?: string
}

export default function EmailCaptureWrapper({ variant = 'compact', className = '' }: Props) {
  return <EmailCapture variant={variant} className={className} />
}
