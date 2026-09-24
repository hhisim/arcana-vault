import test from 'node:test'
import assert from 'node:assert/strict'
const videoState = await import('../lib/blog-video-embed.ts').catch(() => ({}))

test('official VOA videos map to their matching editorial articles', () => {
  assert.equal(typeof videoState.getBlogVideoEmbed, 'function')
  assert.deepEqual(videoState.getBlogVideoEmbed('kabbalah-tree-of-life-sefirot-explained'), {
    videoId: '_0SF7g2ljEE',
    title: "The Ten Sefirot Explained: A Beginner's Map of the Tree of Life",
  })
  assert.deepEqual(videoState.getBlogVideoEmbed('enochian-angelic-language-modern-occultism'), {
    videoId: 'ajeYduMeONk',
    title: 'Enochian Explained: John Dee, Edward Kelley & the Angelic Language',
  })
  assert.deepEqual(videoState.getBlogVideoEmbed('dreamwalker-lucid-dreaming-astral-projection'), {
    videoId: '-EpscQNIMcI',
    title: 'Lucid Dreaming vs Astral Projection: What Is the Difference?',
  })
  assert.deepEqual(videoState.getBlogVideoEmbed('how-to-read-the-tarot-beginners-guide'), {
    videoId: 'Ik3RlJljE8Q',
    title: "How to Read the Tarot: A Beginner's Map of the 78 Cards",
  })
  assert.equal(videoState.getBlogVideoEmbed('unrelated-post'), null)
})

test('embed URL only accepts exact YouTube video IDs', () => {
  assert.equal(videoState.buildYouTubeEmbedUrl('_0SF7g2ljEE'), 'https://www.youtube-nocookie.com/embed/_0SF7g2ljEE?rel=0')
  assert.equal(videoState.buildYouTubeEmbedUrl('bad id'), null)
  assert.equal(videoState.buildYouTubeEmbedUrl('https://evil.test/embed/_0SF7g2ljEE'), null)
})
