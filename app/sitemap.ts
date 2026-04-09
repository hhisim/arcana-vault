import { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'

const BASE = 'https://www.vaultofarcana.com'

// Static pages
const staticPages: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
  { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  { url: `${BASE}/features`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  { url: `${BASE}/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  { url: `${BASE}/account`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/membership`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  { url: `${BASE}/redeem`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
]

// Main oracle & community sections
const sections: MetadataRoute.Sitemap = [
  { url: `${BASE}/oracle`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE}/traditions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${BASE}/chat`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE}/agora`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE}/journal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE}/correspondences`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/correspondence-engine`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE}/inquiry`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/library`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/forum`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
]

// Traditions
const traditions = [
  'tao', 'tarot', 'tantra', 'entheogens', 'sufi',
  'dreamwalker', 'chaos-magick', 'kabbalah',
]
const traditionSubPaths = ['tao-te-ching', 'zhuangzi', 'i-ching']

const traditionPages: MetadataRoute.Sitemap = traditions.flatMap((slug) => [
  { url: `${BASE}/traditions/${slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ...(slug === 'tao'
    ? traditionSubPaths.map((sub) => ({
        url: `${BASE}/traditions/${slug}/${sub}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    : []),
])

// Blog posts
const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
  url: `${BASE}/blog/${post.slug}`,
  lastModified: new Date(post.publishedAt || Date.now()),
  changeFrequency: 'monthly' as const,
  priority: 0.7,
}))

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages,
    ...sections,
    ...traditionPages,
    ...blogPages,
  ]
}
