export interface PostMeta {
  slug: string;
  title: string;
  tradition: string; // Flexible string to support 20+ traditions (e.g., 'hermetics', 'human-design')
  publishedAt: string;
  excerpt: string;
  readTime: string;
  author: string;
}

export const posts: PostMeta[] = [
  {
    slug: 'dmt-hyperbolic-mind',
    title: 'DMT and the Hyperbolic Mind: A Treatise on the Geometry of Hyperspace and Altered States',
    tradition: 'entheogens',
    publishedAt: '2026-03-19',
    excerpt: 'An exhaustive algorithmic and geometric analysis of DMT-induced states of consciousness.',
    readTime: '18 min',
    author: 'Prime + Hakan'
  },
  {
    slug: 'sexual-alchemy-taoist-tradition-nei-dan',
    title: 'Sexual Alchemy in Taoist Tradition: A Guide to Nei Dan',
    tradition: 'tao',
    publishedAt: '2026-03-18',
    excerpt: 'In the esoteric tradition of Taoism, sexual energy is not merely a biological impulse.',
    readTime: '12 min',
    author: 'Prime + Hakan'
  },
  {
    slug: 'taoism-quantum-physics-real-parallels',
    title: 'Taoism and Quantum Physics: The Real Parallels',
    tradition: 'science',
    publishedAt: '2026-03-18',
    excerpt: 'Fritjof Capra suggested quantum physics merely validated ancient Taoist worldviews.',
    readTime: '10 min',
    author: 'Prime + Hakan'
  },
  {
    slug: 'what-tao-te-ching-says-about-uncertainty',
    title: 'The Uncarved Block: Applying Wu Wei to Modern Decision Fatigue',
    tradition: 'tao',
    publishedAt: '2025-03-15',
    excerpt: 'In an era of relentless optimization, the ancient Taoist concept of non-action offers a radical strategy.',
    readTime: '8 min',
    author: 'The Tao Oracle'
  }
];
