export interface Book {
  id: string;
  title: string;
  author: string;
  tradition: 'tao' | 'tarot' | 'tantra' | 'entheogens';
  description: string;
  free: boolean;
  source: 'archive' | 'external';
  embedUrl?: string;
  externalUrl?: string;
  coverColor: string;
}

export const traditionColors = {
  tao: '#4ECDC4',
  tarot: '#7B5EA7',
  tantra: '#C9A84C',
  entheogens: '#2D5A4A'
};

export const traditionLabels = {
  tao: 'Taoism',
  tarot: 'Tarot',
  tantra: 'Tantra',
  entheogens: 'Entheogens'
};

export const books: Book[] = [
  // Tao (free)
  {
    id: 'tao-te-ching',
    title: 'Tao Te Ching',
    author: 'Lao Tzu',
    tradition: 'tao',
    description: 'The foundational text of Taoism, exploring the nature of the Tao and the virtue of non-action.',
    free: true,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/taotechingtransl00laoz',
    coverColor: '#4ECDC4'
  },
  {
    id: 'zhuangzi',
    title: 'Zhuangzi',
    author: 'Chuang Tzu',
    tradition: 'tao',
    description: 'A compilation of writings attributed to Chuang Tzu, focusing on freedom and spontaneity.',
    free: true,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/chuangtzu00zhua',
    coverColor: '#4ECDC4'
  },
  {
    id: 'i-ching',
    title: 'I Ching',
    author: 'Anonymous',
    tradition: 'tao',
    description: 'The Book of Changes, an ancient divination manual and foundational philosophical text.',
    free: true,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/ichingorbookofch00wilh',
    coverColor: '#4ECDC4'
  },
  // Tarot (Adept+)
  {
    id: 'the-tarot',
    title: 'The Tarot',
    author: 'Paul Foster Case',
    tradition: 'tarot',
    description: 'A key to the wisdom of the ages, exploring the esoteric symbolism of the Tarot.',
    free: false,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/tarotkeytowisdom00case',
    coverColor: '#7B5EA7'
  },
  {
    id: 'book-of-thoth',
    title: 'The Book of Thoth',
    author: 'Aleister Crowley',
    tradition: 'tarot',
    description: 'A deep dive into the Thoth Tarot and the underlying qabalistic correspondences.',
    free: false,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/bookofthothshort00crow',
    coverColor: '#7B5EA7'
  },
  {
    id: '78-degrees',
    title: '78 Degrees of Wisdom',
    author: 'Rachel Pollack',
    tradition: 'tarot',
    description: 'A modern classic and comprehensive guide to the archetypal journey of the Tarot.',
    free: false,
    source: 'external',
    externalUrl: 'https://www.google.com/search?q=78+Degrees+of+Wisdom+Rachel+Pollack',
    coverColor: '#7B5EA7'
  },
  // Tantra (Adept+)
  {
    id: 'tantra-supreme',
    title: 'Tantra: The Supreme Understanding',
    author: 'Osho',
    tradition: 'tantra',
    description: 'Discourses on Tilopa’s Song of Mahamudra, exploring the path of non-dual consciousness.',
    free: false,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/tantrasupremeund00osho',
    coverColor: '#C9A84C'
  },
  {
    id: 'serpent-power',
    title: 'The Serpent Power',
    author: 'Arthur Avalon',
    tradition: 'tantra',
    description: 'A foundational work on the Shatchakra-nirupana and Padaka-panchaka (Kundalini Yoga).',
    free: false,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/serpentpowertatt00wooduoft',
    coverColor: '#C9A84C'
  },
  {
    id: 'kundalini-energy',
    title: 'Kundalini: The Arousal of Inner Energy',
    author: 'Ajit Mookerjee',
    tradition: 'tantra',
    description: 'An illustrated guide to the sacred science of Kundalini and human energy centres.',
    free: false,
    source: 'external',
    externalUrl: 'https://www.google.com/search?q=Kundalini+Ajit+Mookerjee',
    coverColor: '#C9A84C'
  },
  // Entheogens (Free/Adept+)
  {
    id: 'psychedelic-experience',
    title: 'The Psychedelic Experience',
    author: 'Leary/Metzner/Alpert',
    tradition: 'entheogens',
    description: 'A manual based on the Tibetan Book of the Dead for navigating psychedelic states.',
    free: true,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/psychedelicexper00lear',
    coverColor: '#2D5A4A'
  },
  {
    id: 'doors-perception',
    title: 'The Doors of Perception',
    author: 'Aldous Huxley',
    tradition: 'entheogens',
    description: 'Huxley’s account of his experiences with mescaline and thoughts on visual arts and science.',
    free: true,
    source: 'archive',
    embedUrl: 'https://archive.org/embed/doorsofperceptio00huxl_0',
    coverColor: '#2D5A4A'
  },
  {
    id: 'plants-of-gods',
    title: 'Plants of the Gods',
    author: 'Schultes/Hofmann',
    tradition: 'entheogens',
    description: 'A scientific and ethnobotanical survey of hallucinogenic plant use across cultures.',
    free: false,
    source: 'external',
    externalUrl: 'https://www.google.com/search?q=Plants+of+the+Gods+Schultes+Hofmann',
    coverColor: '#2D5A4A'
  }
];
