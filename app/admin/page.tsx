import type { Metadata } from 'next'
import AdminDashboard from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Vault Admin — Vault of Arcana',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminDashboard />
}
