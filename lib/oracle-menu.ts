
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
  
  // ─── SUFI ─────────────────────────────────────────────────────────────────
  'sufi:root': {
    title: L('🌙 Sufi Mystic'),
    buttons: [
      [action('sufi-rumi', L('🫀 Rumi'), 'submenu', { nextMenu: 'sufi:rumi' }), action('sufi-lineages', L('🧭 Paths & Lineages'), 'submenu', { nextMenu: 'sufi:tariqa' })],
      [action('sufi-maqam', L('🪜 Stations & States'), 'submenu', { nextMenu: 'sufi:maqam' }), action('sufi-dhikr', L('🕯 Dhikr & Adab'), 'submenu', { nextMenu: 'sufi:dhikr' })],
      [action('sufi-study', L('📚 Deep Study'), 'submenu', { nextMenu: 'sufi:study' }), action('sufi-poetry', L('📜 Poetry & Symbols'), 'submenu', { nextMenu: 'sufi:poetry' })],
      [action('sufi-masters', L('👳 Masters & Saints'), 'submenu', { nextMenu: 'sufi:masters' }), action('sufi-ibnarabi', L('⚡ Ibn Arabi & Wahdat al-Wujud'), 'submenu', { nextMenu: 'sufi:ibnarabi' })],
    ],
  },
  'sufi:study': {
    title: L('📚 Sufi Deep Study'),
    buttons: [
      [action('sufi-metaphysics', L('🌿 Metaphysics of Love'), 'prompt', { prompt: 'Teach the Sufi metaphysics of love: al-hubb, ishqq, divine love and how it differs from romantic love.', mode: 'metaphysics' }), action('sufi-fana', L('🔥 Fana & Baqa'), 'prompt', { prompt: 'Teach fana (annihilation) and baqa (abiding in God): the stages, how they differ from ego-death, and what each requires.', mode: 'metaphysics' })],
      [action('sufi-prophets', L('🕉️ The Prophet & Saints'), 'prompt', { prompt: 'Teach the Sufi relationship to the Prophet Muhammad, the awliya (saints), and how spiritual authority is transmitted.', mode: 'historian' }), action('sufi-ghazali', L('📖 Al-Ghazali'), 'prompt', { prompt: 'Teach Al-Ghazali: his spiritual crisis, the Ihya, and why he matters for every serious spiritual seeker.', mode: 'historian' })],
      [action('sufi-waheed', L('💎 Wahdat al-Wujud'), 'prompt', { prompt: 'Teach wahdat al-wujud (Unity of Being) clearly: what it means, what it does not mean, and why Ibn Arabi remains controversial.', mode: 'metaphysics' }), action('sufi-scripture', L('📜 Quran & Hadith Inner Sense'), 'prompt', { prompt: 'Teach how Sufis read the Quran and Hadith: batin (inner) vs zahir (outer), and how it differs from legal hermeneutics.', mode: 'historian' })],
      [action('sufi-music', L('🎵 Sufi Music & Sama'), 'prompt', { prompt: 'Teach sama (Sufi music and whirling) as spiritual practice: the mechanics, the risks, and the openings it is meant to produce.', mode: 'dhikr' })],
      back('sufi:root'),
    ],
  },
  'sufi:rumi': {
    title: L('🫀 Rumi Deep Dive'),
    buttons: [
      [action('rumi-life', L('📖 Life & Meeting Shams'), 'prompt', { prompt: 'Teach the life of Rumi: his meeting with Shams, his transformation, and the historical context of Konya.', mode: 'historian' }), action('rumi-masnavi', L('📚 The Masnavi'), 'prompt', { prompt: 'Teach the Masnavi: its structure, key stories, and why it is considered the greatest spiritual poem ever written.', mode: 'historian' })],
      [action('rumi-love', L('💞 The Theology of Love'), 'prompt', { prompt: 'Teach Rumi\'s theology of love: why love is the only valid approach to God, and how it differs from rational theology.', mode: 'poetry' }), action('rumi-whirling', L('🌀 The Practice of Whirling'), 'prompt', { prompt: 'Teach the mechanics and spirituality of sama whirling: the body, the breath, the turning, and how it leads to fana.', mode: 'dhikr' })],
      back('sufi:root'),
    ],
  },
  'sufi:poetry': {
    title: L('📜 Poetry & Symbols'),
    buttons: [
      [action('poetry-beloved', L('🌹 The Beloved'), 'prompt', { prompt: 'Teach the Sufi symbol of the Beloved: what it represents, how it operates in ghazal poetry, and what it asks of the reader.', mode: 'poetry' }), action('poetry-wine', L('🍷 Wine & Tavern'), 'prompt', { prompt: 'Teach the Sufi symbols of wine and the tavern: why they appear everywhere, what they actually mean, and how to read them correctly.', mode: 'poetry' })],
      [action('poetry-flute', L('🎶 The Reed Flute'), 'prompt', { prompt: 'Teach the Sufi symbolism of the reed flute (nay): separation from the source, the sound of longing, and what the hollow reed represents.', mode: 'poetry' }), action('poetry-moth', L('🕯️ The Moth'), 'prompt', { prompt: 'Teach the Sufi symbol of the moth: the classic image of surrendering to the flame, and why it recurs across all traditions.', mode: 'poetry' })],
      [action('poetry-mirror', L('🪞 The Mirror & Polish'), 'prompt', { prompt: 'Teach the Sufi symbol of the mirror and polishing it: self-purification, the reflection of the divine, and the work of tazkiya.', mode: 'poetry' }), action('poetry-journey', L('🌬 The Journey Archetype'), 'prompt', { prompt: 'Teach the Sufi journey archetype: stages from self to Source, the waymarks, and what gets left behind at each stage.', mode: 'poetry' })],
      back('sufi:root'),
    ],
  },
  'sufi:dhikr': {
    title: L('🕯 Dhikr & Adab'),
    buttons: [
      [action('dhikr-what', L('🔔 What is Dhikr'), 'prompt', { prompt: 'Teach dhikr: its Quranic basis, its many forms (vocal, mental, physical), and how the practice actually transforms the practitioner.', mode: 'dhikr' }), action('dhikr-forms', L('🎯 Forms of Dhikr'), 'prompt', { prompt: 'Teach the different forms across tariqas: lafdhi (vocal), khafi (silent), qalbi (heart-focused), and how to identify each.', mode: 'dhikr' })],
      [action('dhikr-adab', L('✨ Adab (Sacred Etiquette)'), 'prompt', { prompt: 'Teach adab in Sufism: why propriety, beauty, and courtesy are not merely social rules but spiritual technologies.', mode: 'adab' }), action('dhikr-daily', L('🛎️ Daily Dhikr Practice'), 'prompt', { prompt: 'Design a daily dhikr practice for a beginner: forms, durations, intentions, and what to expect in the first months.', mode: 'dhikr' })],
      back('sufi:root'),
    ],
  },
  'sufi:maqam': {
    title: L('🪜 Stations & States'),
    buttons: [
      [action('maqam-what', L('📖 Maqam vs Hal'), 'prompt', { prompt: 'Teach the difference between maqam (station — earned) and hal (state — given) in Sufi psychology, and why this distinction matters.', mode: 'maqam' }), action('maqam-stations', L('🛤️ Major Stations'), 'prompt', { prompt: 'Teach the major Sufi maqamat: tawba, wara, faqr, sidq, tawakkul, rida, and how they interrelate.', mode: 'maqam' })],
      [action('maqam-states', L('🌊 Major States (Hal)'), 'prompt', { prompt: 'Teach the major Sufi hals: the ecstasies, the trials, the darkness, the lights, and why they cannot be manufactured by will.', mode: 'maqam' }), action('maqam-guide', L('⚡ The Spiritual导师'), 'prompt', { prompt: 'Teach the role of the murshid or shaykh: why initiation and guidance are considered indispensable in Sufi practice.', mode: 'maqam' })],
      back('sufi:root'),
    ],
  },
  'sufi:tariqa': {
    title: L('🧭 Paths & Lineages'),
    buttons: [
      [action('tariqa-naksh', L('🌙 Naqshbandi'), 'prompt', { prompt: 'Teach the Naqshbandi path: its emphasis on silent dhikr (dhikr khafi), its quietist political stance, and its famous practitioners.', mode: 'tariqa' }), action('tariqa-mevlevi', L('🌀 Mevlevi (Whirling)'), 'prompt', { prompt: 'Teach the Mevlevi order: the whirling sema, Rumi\'s lineage, and the transformation of poetry into embodied practice.', mode: 'tariqa' })],
      [action('tariqa-chishti', L('🎵 Chishti'), 'prompt', { prompt: 'Teach the Chishti order: its musical dhikr, its spread from India, and its great saints including Nizamuddin Auliya.', mode: 'tariqa' }), action('tariqa-qadiri', L('🔥 Qadiri'), 'prompt', { prompt: 'Teach the Qadiri order: its founder Abdul Qadir Jilani, its spread, and its distinctive emphasis on spiritual struggle.', mode: 'tariqa' })],
      [action('tariqa-shazili', L('💠 Shadhili'), 'prompt', { prompt: 'Teach the Shadhili order: its founder al-Shadhili, the Burhaniya emphasis, and how it combines warmth with precision.', mode: 'tariqa' }), action('tariqa-choose', L('🧭 Choosing a Path'), 'prompt', { prompt: 'Guide someone on how to choose a tariqa: questions to ask, signs of authenticity, and how teachers are vetted.', mode: 'tariqa' })],
      back('sufi:root'),
    ],
  },
  'sufi:masters': {
    title: L('👳 Masters & Saints'),
    buttons: [
      [action('master-rabia', L('🌹 Rabia al-Adawiyya'), 'prompt', { prompt: 'Teach Rabia al-Adawiyya: her love of God without fear, her radical equality before the divine, and her place as a foundational Sufi woman.', mode: 'saint' }), action('master-hallaj', L('⚡ Mansur al-Hallaj'), 'prompt', { prompt: 'Teach Mansur al-Hallaj: his Ana al-Haqq declaration, his trial, his execution, and why he remains the most controversial Sufi martyr.', mode: 'saint' })],
      [action('master-ghazali2', L('📖 Al-Ghazali'), 'prompt', { prompt: 'Teach Al-Ghazali\'s spiritual crisis and his recovery: the Ihya as a guide to inner Islamic life.', mode: 'historian' }), action('master-ibnarabi2', L('⚡ Ibn Arabi'), 'prompt', { prompt: 'Teach Ibn Arabi: his extraordinary vision of unity, the Fusus al-Hikam, and why he is simultaneously revered and feared.', mode: 'saint' })],
      back('sufi:root'),
    ],
  },
  'sufi:ibnarabi': {
    title: L('⚡ Ibn Arabi & Wahdat al-Wujud'),
    buttons: [
      [action('ia-life', L('📖 Life & Context'), 'prompt', { prompt: 'Teach the life of Ibn Arabi: his visions, his teachers, his controversial relationship with power, and how he became the greatest Islamic philosopher.', mode: 'historian' }), action('ia-fusus', L('📚 The Fusus al-Hikam'), 'prompt', { prompt: 'Teach the Fusus al-Hikam: Ibn Arabi\'s masterwork on the perfect human and how divine wisdom is embodied in each prophet.', mode: 'metaphysics' })],
      [action('ia-wahdat', L('💎 Wahdat al-Wujud'), 'prompt', { prompt: 'Teach wahdat al-wujud: the doctrine of Unity of Being, its implications, its criticisms from within Islam, and how to approach it respectfully.', mode: 'metaphysics' }), action('ia-controversy', L('⚠️ Controversy & Reception'), 'prompt', { prompt: 'Teach why Ibn Arabi is controversial: accusations of pantheism, heretical declarations, and how different traditions receive him.', mode: 'historian' })],
      back('sufi:root'),
    ],
  },
  // ─── DREAMWALKER ─────────────────────────────────────────────────────────
  'dreamwalker:root': {
    title: L('🌌 Dreamwalker'),
    buttons: [
      [action('dw-lucid', L('🌙 Lucid Dreaming'), 'submenu', { nextMenu: 'dreamwalker:lucid', description: L('Recall, WBTB, reality checks, stabilization — the grounded method') }), action('dw-techniques', L('🛠 Techniques'), 'submenu', { nextMenu: 'dreamwalker:techniques', description: L('Compare Monroe, Raduga, Bruce, LaBerge, and others') })],
      [action('dw-yoga', L('🕉 Dream Yoga'), 'submenu', { nextMenu: 'dreamwalker:dream_yoga', description: L('Continuity of awareness, Tibetan lucid practice, Norbu, Wangyal') }), action('dw-astral', L('✨ Astral Projection'), 'submenu', { nextMenu: 'dreamwalker:astral', description: L('Threshold, navigation, ethics, and distinguishing it from lucid dreaming') })],
      [action('dw-remote', L('📡 Remote Viewing'), 'submenu', { nextMenu: 'dreamwalker:remote_viewing', description: L('Targ, Swann, McMoneagle — controlled remote perception') }), action('dw-interpret', L('🔮 Interpretation'), 'submenu', { nextMenu: 'dreamwalker:interpretation', description: L('Jungian, symbolic, recurring, and precognitive dream work') })],
      [action('dw-practice', L('🛏 Tonight\'s Practice'), 'prompt', { prompt: "Design tonight's night-practice routine for dream recall, lucidity, and integration.", mode: 'sleep_practice' }), action('dw-check', L('✅ Checklists'), 'prompt', { prompt: "Create a checklist for lucid dreaming, dreamwork, or astral practice based on the user's goal.", mode: 'checklist' })],
    ],
  },
  'dreamwalker:lucid': {
    title: L('🌙 Lucid Dreaming'),
    buttons: [
      [action('luc-recall', L('📖 Recall Foundation'), 'prompt', { prompt: 'Teach dream recall: dream journals, MILD technique, pre-sleep intention setting, and why most dreams are forgotten within minutes.', mode: 'lucid' }), action('luc-wbtb', L('⏰ WBTB Protocol'), 'prompt', { prompt: 'Teach WBTB (Wake-Back-To-Bed): timing, duration, entry methods, and how to use it without destroying sleep quality.', mode: 'lucid' })],
      [action('luc-rc', L('🔍 Reality Checks'), 'prompt', { prompt: 'Teach reality checks done correctly: how to develop the habit that actually carries into dreams, not just waking life.', mode: 'lucid' }), action('luc-stabilize', L('⚓ Stabilization'), 'prompt', { prompt: 'Teach how to stabilize a lucid dream: grounding techniques, spinning, shouting, and preventing the common causes of ejection.', mode: 'lucid' })],
      [action('luc-ethics', L('⚠️ Ethics & Psychological Limits'), 'prompt', { prompt: 'Teach the ethics and psychology of lucid dreaming: what to explore, what to avoid, and how to distinguish it from unhealthy dissociation.', mode: 'lucid' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:techniques': {
    title: L('🛠 Techniques Compared'),
    buttons: [
      [action('tech-mild', L('🎯 MILD (LaBerge)'), 'prompt', { prompt: 'Teach MILD (Mnemonic Induction of Lucid Dreams): its origins, the technique precisely, and why it works for some people and not others.', mode: 'lucid' }), action('tech-wild', L('🌊 WILD / SSW'), 'prompt', { prompt: 'Teach WILD (Wake Initiation of Lucid Dreams) and Sensing Status Wax: the entry, the body-paralysis phase, and how to survive it.', mode: 'lucid' })],
      [action('tech-monroe', L('🚀 Monroe Hemi-Sync'), 'prompt', { prompt: 'Teach Robert Monroe\'s Hemi-Sync technique: the binaural beat frequencies, the Levels 1-3 model, and how it enables out-of-body entry.', mode: 'lucid' }), action('tech-raduga', L('🌑 Raduga Method'), 'prompt', { prompt: 'Teach the Raduga (LEEPS) method: the Russian school of conscious sleep, micro-awakenings, and WBTB variations.', mode: 'lucid' })],
      [action('tech-combining', L('🧭 Combining & Personal Protocol'), 'prompt', { prompt: 'Teach how to combine lucid dreaming techniques: when to layer them, how to adapt to failure modes, and building a personal protocol.', mode: 'lucid' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:dream_yoga': {
    title: L('🕉 Dream Yoga'),
    buttons: [
      [action('dy-origin', L('📖 Origin & Purpose'), 'prompt', { prompt: 'Teach dream yoga\'s origin in the Tibetan Buddhist tradition: its purpose is liberation through awareness in all sleep states.', mode: 'dream_yoga' }), action('dy-norbu', L('🌬 Norbu Chen'), 'prompt', { prompt: 'Teach Norbu Chen\'s dream yoga: the four yogas of the bardo, the practice of PHWA (pho wa), and lucid clear light.', mode: 'dream_yoga' })],
      [action('dy-wangyal', L('🪷 Tenzin Wangyal'), 'prompt', { prompt: 'Teach Tenzin Wangyal\'s Western-facing dream yoga: the three kayas, working with space, and the difference between Tibetan and Western approaches.', mode: 'dream_yoga' }), action('dy-bardo', L('🌑 Bardos of Sleep'), 'prompt', { prompt: 'Teach the bardo of sleep and dreaming: what opportunities exist there, and what experienced practitioners actually report.', mode: 'dream_yoga' })],
      [action('dy-clearlight', L('💠 Clear Light Practice'), 'prompt', { prompt: 'Teach the clear light of sleep: how dream yoga practitioners work with it, and why it is not the same as visualization.', mode: 'dream_yoga' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:astral': {
    title: L('✨ Astral Projection'),
    buttons: [
      [action('ap-threshold', L('🚪 The Threshold Experience'), 'prompt', { prompt: 'Teach the threshold experience of astral projection: vibrations, paralysis, sounds — and how to recognize a genuine exit vs vivid imagination.', mode: 'astral' }), action('ap-navigation', L('🧭 Navigation'), 'prompt', { prompt: 'Teach how to navigate the astral plane: using intention, portals, the silver cord, and what experienced projectors report about astral geography.', mode: 'astral' })],
      [action('ap-reality', L('🌍 Astral vs Lucid Dream'), 'prompt', { prompt: 'Teach how to distinguish genuine astral projection from lucid dreaming: criteria, evidence, and the most credible accounts.', mode: 'astral' }), action('ap-ethics', L('⚠️ Ethics & Cautions'), 'prompt', { prompt: 'Teach the ethics and psychological cautions of astral projection: what it does and does not do, and why it is not a substitute for waking work.', mode: 'astral' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:remote_viewing': {
    title: L('📡 Remote Viewing'),
    buttons: [
      [action('rv-targ', L('🔮 Targ & Pat Price'), 'prompt', { prompt: 'Teach Russell Targ and Pat Price\'s work at SRI: how remote viewing was discovered, the protocols, and the evidence base.', mode: 'remote_viewing' }), action('rv-swann', L('👁 Dale Swann'), 'prompt', { prompt: 'Teach Dale Swann\'s remote viewing career: his most documented targets, the controversy, and what his work actually demonstrates.', mode: 'remote_viewing' })],
      [action('rv-mcmoneagle', L('📡 Joe McMoneagle'), 'prompt', { prompt: 'Teach Joe McMoneagle\'s remote viewing: his decades of work, the Stargate Project results, and his post-program analytical framework.', mode: 'remote_viewing' }), action('rv-protocols', L('🛎️ The RV Protocol'), 'prompt', { prompt: 'Teach the standard remote viewing protocol: target identification, channel, analytical overlay, and why the methodology was designed the way it was.', mode: 'remote_viewing' })],
      [action('rv-practice', L('🧘 Beginning RV Practice'), 'prompt', { prompt: 'Guide a beginner through a simple remote viewing exercise: selecting a target, entering the correct mental state, recording impressions without analytical overlay.', mode: 'remote_viewing' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:interpretation': {
    title: L('🔮 Dream Interpretation'),
    buttons: [
      [action('int-jung', L('🧠 Jungian Lens'), 'prompt', { prompt: 'Teach Jungian dream interpretation: complexes, archetypes, compensation, and why Jung insisted dreams always speak in symbolic language.', mode: 'interpretation' }), action('int-symbolic', L('🔣 Symbolic vs Literal'), 'prompt', { prompt: 'Teach when to read a dream symbolically and when to take it practically: the difference between archetypal imagery and literal guidance.', mode: 'interpretation' })],
      [action('int-recurring', L('🔄 Recurring Dreams'), 'prompt', { prompt: 'Teach recurring dreams: why the psyche uses them, what they signal, and how to work with them therapeutically vs divination-style.', mode: 'interpretation' }), action('int-nightmare', L('⚠️ Nightmares & Shadow'), 'prompt', { prompt: 'Teach nightmare work: when nightmares are psychological signal, when they are spiritual doorway, and how to work with each safely.', mode: 'interpretation' })],
      back('dreamwalker:root'),
    ],
  },
}
