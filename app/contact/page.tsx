import { buildMetadata } from '@/lib/seo'
import ContactContent from './ContactContent'

export const metadata = buildMetadata(
  'Contact',
  'Get in touch with the Vault of Arcana team.',
  '/contact',
)

export default function ContactPage() {
  return <ContactContent />
}
