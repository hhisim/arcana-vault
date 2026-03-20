
import type { OracleMode, OraclePack, UiLang } from '@/lib/oracle-ui'
import { DHARANA_GROUPS, ALL_DHARANAS, TANTRA_PRACTICES, CHAKRAS } from '@/lib/tantra-data'

type Localized = Record<UiLang, string>
export type MenuActionKind = 'submenu' | 'prompt' | 'back' | 'invite' | 'gift'

export interface MenuAction {
  id: string
  label: Localized
  kind: MenuActionKind
  nextMenu?: string
  prompt?: string
  mode?: OracleMode
  displayText?: Localized
  afterMenu?: string
  description?: Localized
}
export interface MenuScreen { title: Localized; buttons: MenuAction[][] }

const L = (en: string, tr?: string, ru?: string): Localized => ({ en, tr: tr ?? en, ru: ru ?? en })
const action = (id: string, label: Localized, kind: MenuActionKind, extra: Partial<MenuAction> = {}): MenuAction => ({ id, label, kind, ...extra })
const back = (nextMenu: string) => [action(`back:${nextMenu}`, L('« Back', '« Geri', '« Назад'), 'back', { nextMenu })]

export const TAROT_MAJORS = [
  ['0', 'The Fool'],['I', 'The Magician'],['II', 'The High Priestess'],['III', 'The Empress'],['IV', 'The Emperor'],['V', 'The Hierophant'],
  ['VI', 'The Lovers'],['VII', 'The Chariot'],['VIII', 'Strength'],['IX', 'The Hermit'],['X', 'Wheel of Fortune'],['XI', 'Justice'],
  ['XII', 'The Hanged Man'],['XIII', 'Death'],['XIV', 'Temperance'],['XV', 'The Devil'],['XVI', 'The Tower'],['XVII', 'The Star'],
  ['XVIII', 'The Moon'],['XIX', 'The Sun'],['XX', 'Judgement'],['XXI', 'The World'],
] as const

export const TAROT_SUITS = {
  Cups: ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'].map(r => `${r} of Cups`),
  Pentacles: ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'].map(r => `${r} of Pentacles`),
  Swords: ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'].map(r => `${r} of Swords`),
  Wands: ['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'].map(r => `${r} of Wands`),
} as const

export const TAROT_ALL_CARDS = [...TAROT_MAJORS.map(([,n]) => n), ...Object.values(TAROT_SUITS).flat()] as const

const learnPaths = {
  beginner: { label: '🌱 Absolute Beginner', prompt: 'Give the Absolute Beginner Tarot study path as a guided curriculum. Include the 78 cards, imagery, simple spreads, and Pollack as anchors. End with next steps and three concrete exercises.', mode: 'teacher' as OracleMode },
  intermediate: { label: '🔥 Intermediate Practitioner', prompt: 'Give the Intermediate Tarot study path as a guided curriculum. Include Greer 21 Ways, reversals, court cards, Celtic Cross, and spread mastery. End with practical exercises.', mode: 'teacher' as OracleMode },
  esoteric: { label: '⚗️ Esoteric & Initiatic', prompt: 'Give the Esoteric Tarot study path as a guided curriculum. Include Book T, Paul Foster Case, Wang, Thoth, and astrological layers. End with an initiatic study plan.', mode: 'teacher' as OracleMode },
  shadow: { label: '🌑 Shadow & Psychology', prompt: 'Give the Shadow & Psychology Tarot learning path. Include Greer, Jette, constellations, journaling, and professional ethics. End with shadow exercises.', mode: 'teacher' as OracleMode },
  magical: { label: '🔮 Magical & Ritual Arts', prompt: 'Give the Magical & Ritual Arts Tarot learning path. Include Tyson, Ciceros, talismans, ritual applications, and careful magical practice. End with a progressive training sequence.', mode: 'teacher' as OracleMode },
  historical: { label: '🏺 Historical Research', prompt: 'Give a historical Tarot research path from Visconti-Sforza through Marseille, Golden Dawn, Waite, Crowley, and modern scholarship. Include key controversies and primary sources.', mode: 'historian' as OracleMode },
} as const

function majorsRows() {
  const rows: MenuAction[][] = []
  for (let i = 0; i < TAROT_MAJORS.length; i += 2) {
    const pair = TAROT_MAJORS.slice(i, i + 2)
    rows.push(pair.map(([,name]) => action(`tarot:card:${name}`, L(name), 'submenu', { nextMenu: `tarot:card:${name}` })))
  }
  rows.push(back('tarot:browse'))
  return rows
}

function suitRows(suit: keyof typeof TAROT_SUITS) {
  const cards = TAROT_SUITS[suit]
  const rows: MenuAction[][] = []
  for (let i = 0; i < cards.length; i += 2) {
    const pair = cards.slice(i, i + 2)
    rows.push(pair.map((card) => action(`tarot:card:${card}`, L(card), 'submenu', { nextMenu: `tarot:card:${card}` })))
  }
  rows.push(back('tarot:browse'))
  return rows
}

function learnRows() {
  const rows = Object.entries(learnPaths).map(([key, value]) => [action(`tarot:learn:${key}`, L(value.label), 'prompt', { prompt: value.prompt, mode: value.mode, afterMenu: `tarot:learn:${key}:follow`, description: L(value.label) })])
  rows.push(back('tarot:root'))
  return rows
}

function makeMenu(pack: OraclePack, key: string): MenuScreen {
  if (key.startsWith('tarot:card:')) {
    const card = key.replace('tarot:card:', '')
    return {
      title: L(`🎴 ${card}`),
      buttons: [
        [action(`tarot-meaning:${card}`, L('📖 Card Meaning'), 'prompt', { prompt: `Complete practical meaning of ${card} for Tarot readings. Upright meaning, reversed meaning, what it indicates in love, career, and spiritual growth. Clear and useful for a working reader.`, mode: 'teacher', afterMenu: `tarot:card:${card}`, description: L('Upright, reversed, love, career, spirit') })],
        [action(`tarot-decks:${card}`, L('🗃 RWS · Thoth · Marseille'), 'prompt', { prompt: `Compare ${card} across Rider-Waite-Smith, Thoth, and Marseille. Give clear practical differences for a working reader.`, mode: 'deck_compare', afterMenu: `tarot:card:${card}`, description: L('Cross-system comparison for deeper card literacy') })],
        [action(`tarot-qabalah:${card}`, L('⚗️ Qabalistic Analysis'), 'prompt', { prompt: `Give a full Qabalistic analysis of ${card}: Hebrew letter, Tree of Life path, Sephiroth, rulers, and initiatic meaning.`, mode: 'qabalah', afterMenu: `tarot:card:${card}`, description: L('Hebrew letter, path on the Tree, initiatic meaning') }), action(`tarot-astro:${card}`, L('🌟 Astrology of this Card'), 'prompt', { prompt: `Give the astrological correspondences of ${card}, including ruler, decan if relevant, and how it reads in practice.`, mode: 'astro', afterMenu: `tarot:card:${card}`, description: L('Planet, sign, decan - and how it reads') })],
        [action(`tarot-shadow:${card}`, L('🌑 Shadow Work'), 'prompt', { prompt: `Do shadow work with ${card}: the hidden wound, the protective pattern, the invitation, and one journal exercise.`, mode: 'shadow', afterMenu: `tarot:card:${card}`, description: L('Wound, defence, invitation, journal prompt') }), action(`tarot-pathwork:${card}`, L('🧘 Pathworking'), 'prompt', { prompt: `Guide a pathworking for ${card}: threshold, landscape, encounter, gift, return. Use second person and keep it grounded.`, mode: 'pathwork', afterMenu: `tarot:card:${card}`, description: L('Guided meditation into the card\'s landscape') })],
        [action(`tarot-talisman:${card}`, L('🔮 Talisman & Magic'), 'prompt', { prompt: `Explain practical magical and talismanic uses of ${card}. Include correspondences, cautions, and simple ritual applications.`, mode: 'talisman', afterMenu: `tarot:card:${card}`, description: L('Correspondences, cautions, ritual uses') }), action(`tarot-teach:${card}`, L('👩‍🏫 Teach Me This Card'), 'prompt', { prompt: `Teach ${card} as if I am a serious practitioner. Include symbolism, upright vs reversed, practical reading use, and one spread example.`, mode: 'teacher', afterMenu: `tarot:card:${card}`, description: L('Full card education for a serious reader') })],
        back('tarot:browse'),
      ],
    }
  }
    return MENUS[key] || MENUS[`${pack}:root`] || { title: L('Menu'), buttons: [] }
}

const MENUS: Record<string, MenuScreen> = {
  'tao:root': {
    title: L('☯ Tao Oracle Menu'),
    buttons: [
      [action('tao-patience', L('What does the Tao say about patience?'), 'prompt', { prompt: 'What does the Tao say about patience?', mode: 'oracle', description: L('Flow, yielding, and the rhythm of natural timing') }), action('tao-obstacles', L('Why do obstacles appear?'), 'prompt', { prompt: 'Why do obstacles appear?', mode: 'oracle', description: L('The Taoist view on resistance, softness, and the teaching of barriers') })],
      [action('tao-decision', L('How should I approach a difficult decision?'), 'prompt', { prompt: 'How should I approach a difficult decision?', mode: 'seeker', description: L('Wu wei, non-attachment, and the path of least resistance') }), action('tao-daily', L('Share wisdom for today.'), 'prompt', { prompt: 'Share one concise Taoist teaching for today with one practical application.', mode: 'quote', description: L('A single teaching distilled for today\'s living') })],
    ],
  },
  'tarot:root': {
    title: L('🎴 The Cartomancer'),
    buttons: [
      [action('tarot-daily', L('🃏 Daily Card'), 'prompt', { prompt: '__SPECIAL_DAILY_CARD__', mode: 'reading', afterMenu: 'tarot:reading-followups', description: L('One card, one day - a focused lens for today') }), action('tarot-spreads', L('🔮 Readings'), 'submenu', { nextMenu: 'tarot:spreads', description: L('Single card to full Celtic Cross - choose your depth') })],
      [action('tarot-study', L('📚 Deep Study'), 'submenu', { nextMenu: 'tarot:study', description: L('Qabalah, astrology, numerology, history, and more') }), action('tarot-shadow-menu', L('🌑 Shadow Work'), 'submenu', { nextMenu: 'tarot:shadow', description: L('Work with the cards that mirror what is hidden') })],
      [action('tarot-browse', L('✨ Browse Arcana'), 'submenu', { nextMenu: 'tarot:browse', description: L('Explore any card in the deck') }), action('tarot-learn', L('🎓 Learning Paths'), 'submenu', { nextMenu: 'tarot:learn', description: L('Structured curricula from beginner to initiate') })],
      [action('tarot-commands', L('🧰 Command Deck'), 'submenu', { nextMenu: 'tarot:commands', description: L('Specialist modes: pathworking, geomancy, history') })],
    ],
  },
  'tarot:spreads': {
    title: L('🔮 Readings'),
    buttons: [
      [action('spread:single', L('🃏 Single Card'), 'prompt', { prompt: '__SPECIAL_SPREAD_single__', mode: 'reading', afterMenu: 'tarot:reading-followups', description: L('One focused card - a direct answer') }), action('spread:three', L('🔮 Past · Present · Future'), 'prompt', { prompt: '__SPECIAL_SPREAD_three__', mode: 'reading', afterMenu: 'tarot:reading-followups', description: L('Three-card timeline for clarity and direction') })],
      [action('spread:shadow', L('🌗 Shadow & Light'), 'prompt', { prompt: '__SPECIAL_SPREAD_shadow__', mode: 'shadow', afterMenu: 'tarot:reading-followups', description: L('What illuminates and what hides - integration path') }), action('spread:crossroads', L('⚔️ Crossroads'), 'prompt', { prompt: '__SPECIAL_SPREAD_crossroads__', mode: 'reading', afterMenu: 'tarot:reading-followups', description: L('Four-card decision matrix: situation, challenge, hidden, advice') })],
      [action('spread:horseshoe', L('🌙 Horseshoe (7)'), 'prompt', { prompt: '__SPECIAL_SPREAD_horseshoe__', mode: 'reading', afterMenu: 'tarot:reading-followups', description: L('Seven-card deep reading with hidden influences') }), action('spread:celtic', L('✡️ Celtic Cross (10)'), 'prompt', { prompt: '__SPECIAL_SPREAD_celtic__', mode: 'reading', afterMenu: 'tarot:reading-followups', description: L('The full ten-card reading - no stone left unturned') })],
      back('tarot:root'),
    ],
  },
  'tarot:reading-followups': {
    title: L('🔁 Go deeper'),
    buttons: [
      [action('rf-clarify', L('🃏 Pull a clarifier'), 'prompt', { prompt: 'Pull one clarifier card for the last Tarot spread and explain what it resolves or intensifies.', mode: 'reading', description: L('Add precision to any vague area of the reading') }), action('rf-positions', L('📍 Explain the positions'), 'prompt', { prompt: 'Explain the spread positions and how they interact in the last Tarot reading.', mode: 'teacher', description: L('Understand the architecture of the spread') })],
      [action('rf-symbols', L('🔍 Clarify the symbolism'), 'prompt', { prompt: 'Clarify the symbolism and repeated motifs in the last Tarot reading.', mode: 'teacher', description: L('Read between the lines of card imagery') }), action('rf-shadow', L('🌑 Read it in shadow mode'), 'prompt', { prompt: 'Re-read the last Tarot spread in shadow mode. What hidden dynamic is present?', mode: 'shadow', description: L('Surface what is operating beneath awareness') })],
      [action('rf-practical', L('🧭 Practical next step'), 'prompt', { prompt: 'Give a practical next step and one ritual or journaling action from the last Tarot reading.', mode: 'seeker', description: L('Ground the reading into action') }), action('rf-lovecareer', L('💞 Love / Career / Spiritual'), 'prompt', { prompt: 'Translate the last Tarot reading into love, career, and spiritual-development meanings.', mode: 'teacher', description: L('Map the reading across life domains') })],
      back('tarot:spreads'),
    ],
  },
  'tarot:browse': {
    title: L('✨ Browse the Arcana'),
    buttons: [
      [action('tarot-majors', L('✨ Major Arcana (22)'), 'submenu', { nextMenu: 'tarot:majors', description: L('The 22 archetypal keys - Major Arcana cards') })],
      [action('tarot-cups', L('🌊 Cups (14)'), 'submenu', { nextMenu: 'tarot:suit:Cups', description: L('Water suit - emotions, relationships, soul') }), action('tarot-pents', L('🌿 Pentacles (14)'), 'submenu', { nextMenu: 'tarot:suit:Pentacles', description: L('Earth suit - work, money, manifestation') })],
      [action('tarot-swords', L('💨 Swords (14)'), 'submenu', { nextMenu: 'tarot:suit:Swords', description: L('Air suit - mind, conflict, truth') }), action('tarot-wands', L('🔥 Wands (14)'), 'submenu', { nextMenu: 'tarot:suit:Wands', description: L('Fire suit - passion, creativity, action') })],
      back('tarot:root'),
    ],
  },
  'tarot:majors': { title: L('✨ The 22 Major Arcana'), buttons: majorsRows() },
  'tarot:study': {
    title: L('📚 Deep Study'),
    buttons: [
      [action('tarot-qabalah-study', L('⚗️ Qabalah & Tree of Life'), 'submenu', { nextMenu: 'tarot:study:qabalah', description: L('Tree of Life paths, sephiroth, Hebrew letters, initiatic layers') }), action('tarot-astro-study', L('🌟 Astrology Correspondences'), 'submenu', { nextMenu: 'tarot:study:astro', description: L('Signs, planets, decans, and how they map to the cards') })],
      [action('tarot-num-study', L('🔢 Numerology & Number Keys'), 'submenu', { nextMenu: 'tarot:study:numerology', description: L('Number symbolism from Ace to 10 across all suits') }), action('tarot-deck-study', L('🗃️ Deck Comparison'), 'submenu', { nextMenu: 'tarot:study:decks', description: L('Three major lineages and what each brings to a reading') })],
      [action('tarot-school-study', L('🏛️ Reading Schools'), 'submenu', { nextMenu: 'tarot:study:schools', description: L('Different traditions and how they shape interpretation') }), action('tarot-history-study', L('📜 History & Origins'), 'submenu', { nextMenu: 'tarot:study:history', description: L('Visconti-Sforza to modern decks — what is known vs speculated') })],
      [action('tarot-talisman-study', L('🔮 Magic & Talismans'), 'submenu', { nextMenu: 'tarot:study:talisman', description: L('Ritual use, sigils, timing, correspondences, and cautions') }), action('tarot-geomancy-study', L('🌿 Geomancy & Tarot'), 'submenu', { nextMenu: 'tarot:study:geomancy', description: L('Earth-based figures, planetary attributions, combined divination') })],
      [action('tarot-pathwork-study', L('🧘 Pathworking'), 'submenu', { nextMenu: 'tarot:study:pathwork', description: L('Guided visionary practice using the Major Arcana') }), action('tarot-practitioner', L('🧭 Practitioner Meaning'), 'submenu', { nextMenu: 'tarot:study:practitioner', description: L('How working readers actually read — not textbook definitions') })],
      back('tarot:root'),
    ],
  },
  'tarot:shadow': {
    title: L('🌑 Shadow Work'),
    buttons: [
      [action('shadow-devil', L('XV · The Devil'), 'prompt', { prompt: 'Do a shadow-work session with The Devil.', mode: 'shadow', description: L('Bondage, addiction, shadow self — the chains you keep') }), action('shadow-tower', L('XVI · The Tower'), 'prompt', { prompt: 'Do a shadow-work session with The Tower.', mode: 'shadow', description: L('Sudden upheaval — revelation or destruction?') })],
      [action('shadow-moon', L('XVIII · The Moon'), 'prompt', { prompt: 'Do a shadow-work session with The Moon.', mode: 'shadow', description: L('Illusion, fear, the unseen — what hides in darkness') }), action('shadow-nine', L('IX · Nine of Swords'), 'prompt', { prompt: 'Do a shadow-work session with Nine of Swords.', mode: 'shadow', description: L('Anxiety, nightmare, mental anguish — the 3am spiral') })],
      [action('shadow-random', L('🎲 Random Shadow Card'), 'prompt', { prompt: 'Pick a strong shadow-work Tarot card and do a full session with wound, defensive pattern, and integration path.', mode: 'shadow', description: L('Let the deck choose — confront what you avoid') })],
      back('tarot:root'),
    ],
  },
  'tarot:study:qabalah': {
    title: L('⚗️ Qabalah & Tree of Life'),
    buttons: [
      [action('qabalah-overview', L('📖 Tree of Life Overview'), 'prompt', { prompt: 'Give a complete overview of the Tree of Life for a Tarot practitioner: the sephiroth, paths, and how they map to the 78 cards.', mode: 'qabalah' }), action('qabalah-paths', L('🛤️ The 22 Paths'), 'prompt', { prompt: 'Teach the 22 paths of the Tree of Life and how each Major Arcana card corresponds to a path.', mode: 'qabalah' })],
      [action('qabalah-sephiroth', L('⚡ Sephiroth Deep Dive'), 'prompt', { prompt: 'Teach the 10 sephiroth in depth: their names, symbolism, associated cards, and what each means as a spiritual archetype.', mode: 'qabalah' }), action('qabalah-hebrew', L('🔤 Hebrew Letters'), 'prompt', { prompt: 'Teach the Hebrew letters assigned to the Major Arcana paths: their sound, meaning, and how they deepen card interpretation.', mode: 'qabalah' })],
      [action('qabalah-four-worlds', L('🌍 Four Worlds'), 'prompt', { prompt: 'Teach the four Kabbalistic worlds (Atziluth, Briah, Yetzirah, Assiah) and how Tarot cards operate differently in each.', mode: 'qabalah' }), action('qabalah-reading', L('🧭 Qabalistic Reading'), 'prompt', { prompt: 'Teach how to do a Qabalistic Tarot reading: spreads, tetragrammaton analysis, and how to interpret the four worlds.', mode: 'qabalah' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:astro': {
    title: L('🌟 Astrology & Tarot'),
    buttons: [
      [action('astro-signs', L('♈♉♊♋♌♍♐♑♒♓ Planet & Signs'), 'prompt', { prompt: 'Teach planetary and zodiac correspondences for all 78 Tarot cards with practical reading examples.', mode: 'astro' }), action('astro-decans', L('🎯 The 36 Decans'), 'prompt', { prompt: 'Teach the 36 tarot decans across three zodiac signs each, including the minor arcana connections.', mode: 'astro' })],
      [action('astro-planets', L('🪐 Planetary Rulerships'), 'prompt', { prompt: 'Teach which planets rule which cards, including traditional and modern rulerships, and how to use planetary timing in readings.', mode: 'astro' }), action('astro-elements', L('🔥�🌊🪶 Elements & Modalities'), 'prompt', { prompt: 'Teach elements (fire earth air water) and modalities (cardinal fixed mutable) across the four suits and how they shape card meaning.', mode: 'astro' })],
      [action('astro-houses', L('🏠 Astrological Houses'), 'prompt', { prompt: 'Teach the 12 astrological houses and how to map them to Tarot cards in a horoscope-style reading.', mode: 'astro' }), action('astro-reading', L('🧭 Astrological Reading'), 'prompt', { prompt: 'Teach how to do an astrologically-informed Tarot reading: sign placement, house mapping, aspect thinking.', mode: 'astro' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:numerology': {
    title: L('🔢 Numerology & Tarot'),
    buttons: [
      [action('num-one-ten', L('🔢 Numbers 1–10'), 'prompt', { prompt: 'Teach numerology 1 through 10 across all four suits with card examples: what each number means and how it shapes the card.', mode: 'numerology' }), action('num-majors', L('✨ Number Archetypes'), 'prompt', { prompt: 'Teach the number archetypes in the Major Arcana: how 0 through 21 express themselves symbolically.', mode: 'numerology' })],
      [action('num-gematria', L('📐 Gematria'), 'prompt', { prompt: 'Teach Hebrew gematria and how it applies to Tarot card names and keywords for deeper symbolic analysis.', mode: 'numerology' }), action('num-sequences', L('🔗 Number Sequences'), 'prompt', { prompt: 'Teach how number sequences and numerical patterns appear in spreads and what they indicate in readings.', mode: 'numerology' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:decks': {
    title: L('🗃️ Deck Comparison'),
    buttons: [
      [action('deck-rws', L('🎨 Rider-Waite-Smith'), 'prompt', { prompt: 'Deep dive into the Rider-Waite-Smith tradition: Pamela Colman Smith, A.E. Waite, symbolism, and why it became the standard.', mode: 'deck_compare' }), action('deck-thoth', L('🌙 Aleister Crowley Thoth'), 'prompt', { prompt: 'Deep dive into the Thoth deck: Crowley, Harris, Egyptian alchemy, and how it differs from RWS in symbolism and reading style.', mode: 'deck_compare' })],
      [action('deck-marseille', L('🌊 Marseille Tarot'), 'prompt', { prompt: 'Deep dive into the Marseille tradition: Conver, Jean Noblet, Dodal, and how it differs from Waite-based decks in both imagery and reading method.', mode: 'deck_compare' }), action('deck-other', L('🎴 Other Notable Decks'), 'prompt', { prompt: 'Survey other important decks: Visconti-Sforza, Golden Dawn, Lenormand, and what makes each lineage distinct.', mode: 'deck_compare' })],
      [action('deck-combining', L('🧭 Combining Decks in Reading'), 'prompt', { prompt: 'Teach how to use multiple decks in a single reading or practice: when each deck serves best, how to blend their perspectives.', mode: 'deck_compare' }), action('deck-reading', L('📖 Reading Style by Deck'), 'prompt', { prompt: 'Teach how reading style changes depending on the deck: Marseille card-counting, RWS imagery focus, Thoth intuition, Lenormand grid.', mode: 'deck_compare' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:schools': {
    title: L('🏛️ Reading Schools'),
    buttons: [
      [action('school-traditional', L('📜 Traditional/Divinatory'), 'prompt', { prompt: 'Teach the traditional divinatory schools: keywords, sentence structure, how to read without intuition, and the heritage of cartomancy.', mode: 'school_compare' }), action('school-esoteric', L('⚗️ Esoteric/Initatic'), 'prompt', { prompt: 'Teach the esoteric and initiatic schools: Golden Dawn, Crowley, Waite, and how symbolic layers work beneath surface meanings.', mode: 'school_compare' })],
      [action('school-psychological', L('🧠 Psychological/Jungian'), 'prompt', { prompt: 'Teach the psychological and Jungian approach to Tarot: archetypes, shadow, collective unconscious, and how to read without projecting.', mode: 'school_compare' }), action('school-marseille', L('🌊 Marseille School'), 'prompt', { prompt: 'Teach the Marseille reading school: card values, number spreads, pip divination, and how French cartomancers actually read.', mode: 'school_compare' })],
      [action('school-combining', L('🧭 Combining Schools'), 'prompt', { prompt: 'Teach how to blend multiple schools fluidly: when to use keywords, when to follow symbolism, when to go psychological.', mode: 'school_compare' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:history': {
    title: L('📜 History & Origins'),
    buttons: [
      [action('history-visconti', L('🗺️ Visconti-Sforza'), 'prompt', { prompt: 'Trace the Visconti-Sforza deck: when it was made, who for, what we know vs speculate, and why it matters.', mode: 'historian' }), action('history-marseille', L('🌊 Origins of Marseille'), 'prompt', { prompt: 'Trace the Marseille deck lineage from early woodblock prints through the 1760 Conver print — what is documented.', mode: 'historian' })],
      [action('history-goldendown', L('🔮 Golden Dawn'), 'prompt', { prompt: 'Trace the Golden Dawn\'s role in transforming Tarot from game to occult tool, including the emergence of the Major Arcana naming we use today.', mode: 'historian' }), action('history-waite', L('📖 Waite & Rider'), 'prompt', { prompt: 'Trace the creation of the Rider-Waite deck: Waite\'s goals, Smith\'s illustrations, and how it reshaped Tarot\'s visual language.', mode: 'historian' })],
      [action('history-crowley', L('🌙 Crowley & Thoth'), 'prompt', { prompt: 'Trace the creation of the Thoth deck: Crowley\'s role, Frieda Harris\'s art, and how Crowley\'s occult system differs from Waite\'s.', mode: 'historian' }), action('history-modern', L('⚡ Modern Tarot'), 'prompt', { prompt: 'Trace modern Tarot from 1960s counterculture through today\'s explosion: what drove its growth and what the landscape looks like.', mode: 'historian' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:talisman': {
    title: L('🔮 Magic & Talismans'),
    buttons: [
      [action('talisman-corre', L('🔗 Correspondences'), 'prompt', { prompt: 'Teach complete Tarot correspondences for magical work: planets, signs, elements, Hebrew letters, and how to build a correspondence grid.', mode: 'talisman' }), action('talisman-timing', L('⏱️ Electional Timing'), 'prompt', { prompt: 'Teach astrological timing for Tarot rituals: how to pick electional moments when a card\'s energy is strongest.', mode: 'talisman' })],
      [action('talisman-ritual', L('🕯️ Ritual Use'), 'prompt', { prompt: 'Teach how to use Tarot cards in ritual: altar布置, candlelight, card selection as focal point, and how to frame the reading as ritual act.', mode: 'talisman' }), action('talisman-sigils', L('✍️ Sigil & Seal Making'), 'prompt', { prompt: 'Teach how to extract sigils and seals from Tarot cards for talismanic work, including encoding and charging.', mode: 'talisman' })],
      [action('talisman-cautions', L('⚠️ Cautions & Ethics'), 'prompt', { prompt: 'Teach magical cautions specific to Tarot work: what can go wrong, ethical boundaries, and how to work responsibly.', mode: 'talisman' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:geomancy': {
    title: L('🌿 Geomancy & Tarot'),
    buttons: [
      [action('geom-figures', L('🔮 The 16 Figures'), 'prompt', { prompt: 'Teach all 16 geomantic figures: their names, elements, ruling planets, and what each represents.', mode: 'geomancy' }), action('geom-mothers', L('👩 Four Mothers'), 'prompt', { prompt: 'Teach the four mother figures in geomancy and how they relate to elements, planets, and Tarot suit correspondences.', mode: 'geomancy' })],
      [action('geom-houses', L('🏠 Houses & Points'), 'prompt', { prompt: 'Teach geomantic houses and the planetary points: how to construct a geomantic chart and what each house rules.', mode: 'geomancy' }), action('geom-reading', L('🧭 Geomantic Reading Method'), 'prompt', { prompt: 'Teach the step-by-step method for doing a geomantic reading: figure generation, interpretation, and how to combine with Tarot.', mode: 'geomancy' })],
      [action('geom-tarot', L('🔗 Combined Practice'), 'prompt', { prompt: 'Teach how to weave Tarot and geomancy together: when to use geomancy to clarify a Tarot card and vice versa.', mode: 'geomancy' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:pathwork': {
    title: L('🧘 Pathworking'),
    buttons: [
      [action('pw-preparation', L('🕯️ Preparation'), 'prompt', { prompt: 'Teach pathworking preparation: ritual setting, breathwork, how to enter a meditative state before journeying.', mode: 'pathwork' }), action('pw-threshold', L('🚪 Entering the Threshold'), 'prompt', { prompt: 'Teach how to enter the path: crossing the threshold, the first sensations, how to recognize genuine pathworking vs imagination.', mode: 'pathwork' })],
      [action('pw-lands', L('🌅 The Inner Landscape'), 'prompt', { prompt: 'Teach what the inner landscape of a pathworking feels like: symbolic geography, weather, beings, and what different elements mean.', mode: 'pathwork' }), action('pw-encounter', L('👁️ Meeting the Card'), 'prompt', { prompt: 'Teach how to encounter the card archetype directly: meeting the figure, receiving the teaching, what authentic contact looks like.', mode: 'pathwork' })],
      [action('pw-return', L('🔄 Return & Integration'), 'prompt', { prompt: 'Teach the return journey and integration: how to close the pathworking, ground the experience, and journal what was received.', mode: 'pathwork' })],
      back('tarot:study'),
    ],
  },
  'tarot:study:practitioner': {
    title: L('🧭 Practitioner Meaning Method'),
    buttons: [
      [action('prac-upright', L('⬆️ Upright Meaning'), 'prompt', { prompt: 'Teach how to construct a precise upright card meaning: the difference between textbook definitions and what actually matters in a live reading.', mode: 'teacher' }), action('prac-reversed', L('⬇️ Reversed Meaning'), 'prompt', { prompt: 'Teach how to interpret reversals: blocked energy, inner version, not-as-extreme, and when reversal does and does not apply.', mode: 'teacher' })],
      [action('prac-timing', L('⏱️ Timing'), 'prompt', { prompt: 'Teach Tarot timing techniques: planetary hours, season-based, card cycle timing, and how to give time frames that are actually useful.', mode: 'teacher' }), action('prac-spreads', L('🃏 Spread Architecture'), 'prompt', { prompt: 'Teach how to design and read spreads: position meaning, card interaction, and how to layer multiple cards in a single position.', mode: 'teacher' })],
      [action('prac-question', L('❓ Question Framing'), 'prompt', { prompt: 'Teach how to work with the querent\'s question: how to reframe vague questions, what makes a question readable vs unanswerable.', mode: 'teacher' }), action('prac-reading', L('📖 The Full Reading'), 'prompt', { prompt: 'Teach the full arc of a live reading: opening, reading, synthesis, closing, and what separates a good reader from a great one.', mode: 'teacher' })],
      back('tarot:study'),
    ],
  },
  'tarot:learn': { title: L('🎓 Learning Paths'), buttons: learnRows() },
  'tarot:commands': {
    title: L('🧰 Command Deck'),
    buttons: [
      [action('cmd-reading', L('Reading · Full reading'), 'prompt', { prompt: '__SPECIAL_SPREAD_celtic__', mode: 'reading', afterMenu: 'tarot:reading-followups', description: L('Full ten-card Celtic Cross on your question') }), action('cmd-learn', L('Learn · Study path'), 'submenu', { nextMenu: 'tarot:learn', description: L('Structured paths from beginner to initiate') })],
      [action('cmd-geomancy', L('Geomancy · Tarot & figures'), 'prompt', { prompt: 'Teach geomancy and Tarot together with examples and practical use.', mode: 'geomancy', description: L('Earth-based divination paired with the cards') }), action('cmd-pathwork', L('Pathwork · Guided vision'), 'prompt', { prompt: 'Guide a Tarot pathworking meditation for the current situation.', mode: 'pathwork', description: L('Guided visionary journey using the card as a threshold') })],
      [action('cmd-history', L('History · Origins'), 'prompt', { prompt: 'Teach the history and origins of Tarot carefully and critically.', mode: 'historian', description: L('From Visconti-Sforza to the modern deck') }), action('cmd-school', L('Schools · Reading schools'), 'prompt', { prompt: 'Compare the main Tarot reading schools with examples.', mode: 'school_compare', description: L('Traditional, esoteric, psychological, and Marseille traditions') })],
      [action('cmd-constellation', L('Constellation · Birth & soul cards'), 'prompt', { prompt: 'Teach Tarot constellations, birth cards, soul cards, and how to work with them.', mode: 'teacher', description: L('Card patterns that reveal character and life themes') }), action('cmd-journal', L('Journal · Tarot journaling'), 'prompt', { prompt: 'Give a Tarot journaling framework for serious daily practice.', mode: 'teacher', description: L('Structured writing practice to deepen card literacy') })],
      back('tarot:root'),
    ],
  },
  'tantra:root': {
    title: L('🔥 Shakti Oracle'),
    buttons: [
      [action('tantra-daily', L('🔥 Daily Technique'), 'prompt', { prompt: '__SPECIAL_DHARANA_daily__', mode: 'dharana', afterMenu: 'tantra:dharana-follow' }), action('tantra-practices', L('🧘 Practice Path'), 'submenu', { nextMenu: 'tantra:practices' })],
      [action('tantra-dharanas', L('✨ 112 Dharanas'), 'submenu', { nextMenu: 'tantra:dharanas' }), action('tantra-study', L('📚 Deep Study'), 'submenu', { nextMenu: 'tantra:study' })],
      [action('tantra-chakras', L('🌸 Chakra Map'), 'submenu', { nextMenu: 'tantra:chakras' }), action('tantra-kundalini', L('⚡ Kundalini'), 'submenu', { nextMenu: 'tantra:kundalini' })],
    ],
  },
  'tantra:practices': { title: L('🧘 Practice Paths'), buttons: [
      ...Object.entries(TANTRA_PRACTICES).map(([key,v]) => [action(`tantra:practice:${key}`, L(v.label), 'prompt', { prompt: `Practice path: ${v.label}. Teach it as an integrated journey using representative dharanas, cautions, and next steps.`, mode: 'dharana' })]),
      back('tantra:root')
  ] },
  'tantra:dharanas': { title: L('✨ 112 Dharanas'), buttons: [
      ...Object.entries(DHARANA_GROUPS).map(([key,v]) => [action(`tantra:grp:${key}`, L(v.label), 'submenu', { nextMenu: `tantra:grp:${key}` })]),
      back('tantra:root')
  ] },
  'tantra:study': { title: L('📚 Deep Study'), buttons: [
      [action('tantra-kashmir', L('📜 Kashmir Shaivism'), 'prompt', { prompt: 'Teach Kashmir Shaivism as the metaphysical heart of these practices.', mode: 'scholar' }), action('tantra-shiva', L('🕉 Shiva · Shakti'), 'prompt', { prompt: 'Teach Shiva-Shakti cosmology and how it appears in practice.', mode: 'shiva_shakti' })],
      [action('tantra-mantra', L('🎵 Mantra'), 'prompt', { prompt: 'Teach mantra in Tantra: sound, repetition, embodiment, and practice cautions.', mode: 'oracle' }), action('tantra-vedanta', L('🪔 Vedanta'), 'prompt', { prompt: 'Explain Vedanta and non-dual recognition in relation to Tantra without flattening them.', mode: 'vedanta' })],
      [action('tantra-schools', L('🏛 Compare Schools'), 'prompt', { prompt: 'Compare major Tantric streams and practice cultures.', mode: 'school_compare' }), action('tantra-history', L('📜 History'), 'prompt', { prompt: 'Teach the history of Tantra carefully and without sensationalism.', mode: 'historian' })],
      [action('tantra-breathwork', L('🌬 Breathwork'), 'prompt', { prompt: 'Teach breath as doorway in Tantra with reference to the first dharanas.', mode: 'dharana' }), action('tantra-subtle', L('🔆 Subtle Body'), 'prompt', { prompt: 'Teach the subtle body map with chakras, channels, energies, and correspondences.', mode: 'chakra' })],
      back('tantra:root')
  ] },
  'tantra:chakras': { title: L('🌸 Chakra Map'), buttons: [
      [action('tantra-chak-full', L('⚡ Full Map'), 'prompt', { prompt: 'Give a full seven-chakra map with practical, psychological, symbolic, and correspondence-rich meanings.', mode: 'chakra' })],
      ...CHAKRAS.map(([key,name,emoji]) => [action(`tantra:chakra:${key}`, L(`${emoji} ${name}`), 'prompt', { prompt: `Teach the ${name} chakra deeply: body, psyche, symbolism, common distortions, practices, and correspondences.`, mode: 'chakra' })]),
      back('tantra:root')
  ] },
  'tantra:kundalini': { title: L('⚡ Kundalini'), buttons: [
      [action('kundalini-intro', L('⚡ Foundation'), 'prompt', { prompt: 'Give a grounded introduction to Kundalini: signs, misconceptions, pacing, and caution.', mode: 'kundalini' }), action('kundalini-safety', L('🛡 Safety & Pacing'), 'prompt', { prompt: 'Teach Kundalini safety, pacing, regulation, and warning signs without alarmism.', mode: 'kundalini' })],
      [action('kundalini-rising', L('🔥 Rising Process'), 'prompt', { prompt: 'Explain the process of rising energy and how practitioners can distinguish symbolism from physiology and stress.', mode: 'kundalini' }), action('kundalini-integration', L('🫀 Integration'), 'prompt', { prompt: 'Teach integration after intense energetic openings: grounding, diet, rest, journaling, and humility.', mode: 'kundalini' })],
      back('tantra:root')
  ] },
  'entheogen:root': { title: L('🍄 Esoteric Entheogen'), buttons: [
      [action('entheo-maps', L('🧠 Maps of Consciousness'), 'prompt', { prompt: 'Compare Grof, Wilber, Tart, and Lilly on entheogenic states.', mode: 'transpersonal' }), action('entheo-shamanism', L('🪶 Shamanism'), 'prompt', { prompt: 'Teach entheogens in relation to shamanic technologies and cautions.', mode: 'shamanic' })],
      [action('entheo-ethnobotany', L('🌿 Ethnobotany'), 'prompt', { prompt: 'Teach entheogens ethnobotanically: lineage, plant context, cultural setting, and caution.', mode: 'ethnobotany' }), action('entheo-safety', L('⚠️ Harm Reduction'), 'prompt', { prompt: 'Give a harm-reduction guide for entheogenic work with set, setting, contraindications, and integration.', mode: 'harm_reduction' })],
      [action('entheo-entities', L('👁 Entities'), 'prompt', { prompt: 'Discuss entity encounters carefully across symbolic, psychological, phenomenological, and occult frames.', mode: 'entity' }), action('entheo-correspond', L('🕸 Correspondence'), 'prompt', { prompt: 'Map plants, molecules, correspondences, and visionary signatures across the archive.', mode: 'correspondence' })],
  ] },
  'sufi:root': { title: L('🌙 Sufi Mystic'), buttons: [
      [action('sufi-rumi', L('🫀 Rumi'), 'prompt', { prompt: 'Teach Rumi deeply: longing, annihilation, love, paradox, and practice. Include why he is so central and so often flattened.', mode: 'poetry' }), action('sufi-lineages', L('🧭 Paths & Lineages'), 'prompt', { prompt: 'Compare the Naqshbandi, Mevlevi, Chishti, Qadiri, and Shadhili paths carefully.', mode: 'tariqa' })],
      [action('sufi-maqam', L('🪜 Stations & States'), 'prompt', { prompt: 'Explain maqam and hal in Sufism with practical examples and common misunderstandings.', mode: 'maqam' }), action('sufi-dhikr', L('🕯 Dhikr & Adab'), 'prompt', { prompt: 'Teach dhikr and adab as living practice, not just concepts.', mode: 'dhikr' })],
      [action('sufi-poetry', L('📜 Poetry & Symbols'), 'prompt', { prompt: 'Explain classic Sufi symbols: the Beloved, wine, tavern, moth, reed flute, mirror, dust, and journey.', mode: 'poetry' }), action('sufi-masters', L('👳 Masters'), 'prompt', { prompt: 'Teach the lives and teachings of Rumi, Ibn Arabi, Al-Ghazali, Rabia, Hallaj, and other major figures.', mode: 'saint' })],
  ] },
  'dreamwalker:root': { title: L('🌌 Dreamwalker'), buttons: [
      [action('dw-lucid', L('🌙 Lucid Dreaming'), 'prompt', { prompt: 'Teach lucid dreaming in a grounded, serious way: recall, reality checks, WBTB, stabilisation, and common errors.', mode: 'lucid' }), action('dw-techniques', L('🛠 Techniques'), 'prompt', { prompt: 'Compare Monroe, Raduga, Bruce, and LaBerge style methods without flattening them.', mode: 'teacher' })],
      [action('dw-yoga', L('🕉 Dream Yoga'), 'prompt', { prompt: 'Teach dream yoga as continuity of awareness, not thrill-seeking. Include Norbu and Tenzin Wangyal.', mode: 'dream_yoga' }), action('dw-astral', L('✨ Astral Projection'), 'prompt', { prompt: 'Teach astral projection carefully: threshold phenomena, navigation, grounding, and interpretations.', mode: 'astral' })],
      [action('dw-remote', L('📡 Remote Viewing'), 'prompt', { prompt: 'Teach remote viewing at a high level using Targ, Swann, and McMoneagle.', mode: 'remote_viewing' }), action('dw-interpret', L('🔮 Interpretation'), 'prompt', { prompt: 'Interpret a dream using Jungian, symbolic, recurring-pattern, and emotional-context lenses.', mode: 'interpretation' })],
      [action('dw-practice', L('🛏 Night Practice'), 'prompt', { prompt: "Design tonight's night-practice routine for dream recall, lucidity, and integration.", mode: 'sleep_practice' }), action('dw-check', L('✅ Checklists'), 'prompt', { prompt: "Create a checklist for lucid dreaming, dreamwork, or astral practice based on the user's goal.", mode: 'checklist' })],
    ] },
}

export function getMenuScreen(pack: OraclePack, key: string): MenuScreen {
  if (key.startsWith('tarot:suit:')) return { title: L(`✨ ${key.replace('tarot:suit:','')} `), buttons: suitRows(key.replace('tarot:suit:','') as keyof typeof TAROT_SUITS) }
  if (key.startsWith('tantra:grp:')) {
    const gk = key.replace('tantra:grp:','') as keyof typeof DHARANA_GROUPS
    const g = (DHARANA_GROUPS as any)[gk]
    const nums = g?.techniques || []
    const rows: MenuAction[][] = []
    for (let i=0;i<nums.length;i+=2){
      const pair = nums.slice(i,i+2)
      rows.push(pair.map((num:number)=> action(`tantra:dharana:${num}`, L(`${num}. ${(ALL_DHARANAS as any)[num].name}`), 'prompt', { prompt: `Transmit dharana ${num}: '${(ALL_DHARANAS as any)[num].name}'. Seed: ${(ALL_DHARANAS as any)[num].desc} Give the actual technique, practice steps, inner landscape, and application.`, mode:'dharana', afterMenu:`tantra:dharanafollow:${num}` })))
    }
    rows.push(back('tantra:dharanas'))
    return { title: L(g?.label || 'Dharana Group'), buttons: rows }
  }
  if (key.startsWith('tantra:dharanafollow:')) {
    const num = Number(key.replace('tantra:dharanafollow:',''))
    const d = (ALL_DHARANAS as any)[num]
    return {
      title: L(`🧘 Dharana ${num}: ${d?.name || ''}`),
      buttons: [
        [action(`tantra:${num}:practice`, L('🧘 Practice Guide'), 'prompt', { prompt: `Step-by-step practice for dharana ${num}: '${d?.name}'.`, mode:'dharana' }), action(`tantra:${num}:scholar`, L('📖 Scholar'), 'prompt', { prompt: `Scholar commentary on dharana ${num}: '${d?.name}'.`, mode:'scholar' })],
        [action(`tantra:${num}:experience`, L('🌌 Experience'), 'prompt', { prompt: `Inner phenomenology and experience of dharana ${num}: '${d?.name}'.`, mode:'dharana' }), action(`tantra:${num}:kashmir`, L('📜 Kashmir'), 'prompt', { prompt: `Kashmir Shaivism lens on dharana ${num}: '${d?.name}'.`, mode:'scholar' })],
        [action(`tantra:${num}:devotion`, L('🌹 Devotion'), 'prompt', { prompt: `Devotional approach to dharana ${num}: '${d?.name}'.`, mode:'surrender' }), action(`tantra:${num}:journal`, L('📓 Journal'), 'prompt', { prompt: `Five journaling inquiries for dharana ${num}: '${d?.name}'.`, mode:'surrender' })],
        [action(`tantra:${num}:advanced`, L('⚡ Advanced'), 'prompt', { prompt: `Advanced territory and cautions of dharana ${num}: '${d?.name}'.`, mode:'dharana' })],
        back(`tantra:grp:${d?.group || 'breath'}`),
      ],
    }
  }
  if (key.startsWith('tarot:learn:') && key.endsWith(':follow')) {
    const base = key.replace(':follow','').split(':').pop() || 'beginner'
    return { title: L('🔁 Continue this path'), buttons: [
      [action(`learn-${base}-steps`, L('📚 Break down the steps'), 'prompt', { prompt: `Break down the ${base} Tarot learning path into steps with reading order and exercises.`, mode:'teacher', description: L('What to study, in what order, with what exercises') }), action(`learn-${base}-sources`, L('📖 Key sources'), 'prompt', { prompt: `List the key sources and why they matter in the ${base} Tarot learning path.`, mode:'teacher', description: L('Books, authors, and resources worth your time') })],
      [action(`learn-${base}-practice`, L('🃏 Weekly practice plan'), 'prompt', { prompt: `Create a weekly practice plan for the ${base} Tarot learning path.`, mode:'teacher', description: L('Structured weekly cadence for serious practitioners') }), action(`learn-${base}-next`, L('🧭 What next?'), 'prompt', { prompt: `What should a practitioner do next after the ${base} Tarot learning path?`, mode:'teacher', description: L('Where this path leads and what opens after it') })],
      back('tarot:learn')
    ]}
  }
  return makeMenu(pack, key)
}
