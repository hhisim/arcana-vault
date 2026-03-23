import { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.vaultofarcana.com'

  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastMod: new Date(post.publishedAt || '2026-01-01'),
    changeFreq: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    { url: baseUrl, lastMod: new Date(), changeFreq: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastMod: new Date(), changeFreq: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/chat`, lastMod: new Date(), changeFreq: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/library`, lastMod: new Date(), changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/correspondence-engine`, lastMod: new Date(), changeFreq: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastMod: new Date(), changeFreq: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastMod: new Date(), changeFreq: 'monthly', priority: 0.6 },
    ...blogPosts,
  ]
}
