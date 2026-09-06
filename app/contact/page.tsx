import { buildMetadata } from '@/lib/seo'
import ContactContent from './ContactContent'

export const metadata = buildMetadata(
  'Contact',
  'Contact the Vault of Arcana team about the mystery school, archives, essays, and digital study resources.',
  '/contact',
)

export default function ContactPage() {
  return <ContactContent />
}
