export type BlogVideoEmbed = { videoId: string; title: string }

const BLOG_VIDEO_EMBEDS: Record<string, BlogVideoEmbed> = {
  'kabbalah-tree-of-life-sefirot-explained': {
    videoId: '_0SF7g2ljEE',
    title: "The Ten Sefirot Explained: A Beginner's Map of the Tree of Life",
  },
  'enochian-angelic-language-modern-occultism': {
    videoId: 'ajeYduMeONk',
    title: 'Enochian Explained: John Dee, Edward Kelley & the Angelic Language',
  },
  'dreamwalker-lucid-dreaming-astral-projection': {
    videoId: '-EpscQNIMcI',
    title: 'Lucid Dreaming vs Astral Projection: What Is the Difference?',
  },
  'how-to-read-the-tarot-beginners-guide': {
    videoId: 'Ik3RlJljE8Q',
    title: "How to Read the Tarot: A Beginner's Map of the 78 Cards",
  },
}

const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function getBlogVideoEmbed(slug: string): BlogVideoEmbed | null {
  return BLOG_VIDEO_EMBEDS[slug] ?? null
}

export function buildYouTubeEmbedUrl(videoId: string): string | null {
  if (!VIDEO_ID_PATTERN.test(videoId)) return null
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`
}
