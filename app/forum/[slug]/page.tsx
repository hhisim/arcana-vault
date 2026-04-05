import { redirect } from 'next/navigation'
export default function ForumCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  redirect('/agora')
}
