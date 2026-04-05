import type { Metadata } from 'next'
import ContactContent from './ContactContent'

export const metadata: Metadata = {
  title: 'Contact · Vault of Arcana',
  description: 'Get in touch with the Vault of Arcana team.',
}

export default function ContactPage() {
  return <ContactContent />
}
