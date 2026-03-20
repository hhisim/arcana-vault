
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
  const rows = Object.entries(learnPaths).map(([key, value]) => [action(`tarot:learn:${key}`, L(value.label), 'prompt', { prompt: value.prompt, mode: value.mode, afterMenu: `tarot:learn:${key}:follow` })])
  rows.push(back('tarot:root'))
  return rows
}

function makeMenu(pack: OraclePack, key: string): MenuScreen {
  if (key.startsWith('tarot:card:')) {
    const card = key.replace('tarot:card:', '')
    return {
      title: L(`🎴 ${card}`),
      buttons: [
        [action(`tarot-meaning:${card}`, L('📖 Card Meaning'), 'prompt', { prompt: `Complete practical meaning of ${card} for Tarot readings. Upright meaning, reversed meaning, what it indicates in love, career, and spiritual growth. Clear and useful for a working reader.`, mode: 'teacher', afterMenu: `tarot:card:${card}` })],
        [action(`tarot-decks:${card}`, L('🗃 RWS · Thoth · Marseille'), 'prompt', { prompt: `Compare ${card} across Rider-Waite-Smith, Thoth, and Marseille. Give clear practical differences for a working reader.`, mode: 'deck_compare', afterMenu: `tarot:card:${card}` })],
        [action(`tarot-qabalah:${card}`, L('⚗️ Qabalistic Analysis'), 'prompt', { prompt: `Give a full Qabalistic analysis of ${card}: Hebrew letter, Tree of Life path, Sephiroth, rulers, and initiatic meaning.`, mode: 'qabalah', afterMenu: `tarot:card:${card}` }), action(`tarot-astro:${card}`, L('🌟 Astrology of this Card'), 'prompt', { prompt: `Give the astrological correspondences of ${card}, including ruler, decan if relevant, and how it reads in practice.`, mode: 'astro', afterMenu: `tarot:card:${card}` })],
        [action(`tarot-shadow:${card}`, L('🌑 Shadow Work'), 'prompt', { prompt: `Do shadow work with ${card}: the hidden wound, the protective pattern, the invitation, and one journal exercise.`, mode: 'shadow', afterMenu: `tarot:card:${card}` }), action(`tarot-pathwork:${card}`, L('🧘 Pathworking'), 'prompt', { prompt: `Guide a pathworking for ${card}: threshold, landscape, encounter, gift, return. Use second person and keep it grounded.`, mode: 'pathwork', afterMenu: `tarot:card:${card}` })],
        [action(`tarot-talisman:${card}`, L('🔮 Talisman & Magic'), 'prompt', { prompt: `Explain practical magical and talismanic uses of ${card}. Include correspondences, cautions, and simple ritual applications.`, mode: 'talisman', afterMenu: `tarot:card:${card}` }), action(`tarot-teach:${card}`, L('👩‍🏫 Teach Me This Card'), 'prompt', { prompt: `Teach ${card} as if I am a serious practitioner. Include symbolism, upright vs reversed, practical reading use, and one spread example.`, mode: 'teacher', afterMenu: `tarot:card:${card}` })],
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
      [action('tao-patience', L('What does the Tao say about patience?'), 'prompt', { prompt: 'What does the Tao say about patience?', mode: 'oracle' }), action('tao-obstacles', L('Why do obstacles appear?'), 'prompt', { prompt: 'Why do obstacles appear?', mode: 'oracle' })],
      [action('tao-decision', L('How should I approach a difficult decision?'), 'prompt', { prompt: 'How should I approach a difficult decision?', mode: 'seeker' }), action('tao-daily', L('Share wisdom for today.'), 'prompt', { prompt: 'Share one concise Taoist teaching for today with one practical application.', mode: 'quote' })],
    ],
  },
  'tarot:root': {
    title: L('🎴 The Cartomancer'),
    buttons: [
      [action('tarot-daily', L('🃏 Daily Card'), 'prompt', { prompt: '__SPECIAL_DAILY_CARD__', mode: 'reading', afterMenu: 'tarot:reading-followups' }), action('tarot-spreads', L('🔮 Readings'), 'submenu', { nextMenu: 'tarot:spreads' })],
      [action('tarot-study', L('📚 Deep Study'), 'submenu', { nextMenu: 'tarot:study' }), action('tarot-shadow-menu', L('🌑 Shadow Work'), 'submenu', { nextMenu: 'tarot:shadow' })],
      [action('tarot-browse', L('✨ Browse Arcana'), 'submenu', { nextMenu: 'tarot:browse' }), action('tarot-learn', L('🎓 Learning Paths'), 'submenu', { nextMenu: 'tarot:learn' })],
      [action('tarot-commands', L('🧰 Command Deck'), 'submenu', { nextMenu: 'tarot:commands' })],
    ],
  },
  'tarot:spreads': {
    title: L('🔮 Readings'),
    buttons: [
      [action('spread:single', L('🃏 Single Card'), 'prompt', { prompt: '__SPECIAL_SPREAD_single__', mode: 'reading', afterMenu: 'tarot:reading-followups' }), action('spread:three', L('🔮 Past · Present · Future'), 'prompt', { prompt: '__SPECIAL_SPREAD_three__', mode: 'reading', afterMenu: 'tarot:reading-followups' })],
      [action('spread:shadow', L('🌗 Shadow & Light'), 'prompt', { prompt: '__SPECIAL_SPREAD_shadow__', mode: 'shadow', afterMenu: 'tarot:reading-followups' }), action('spread:crossroads', L('⚔️ Crossroads'), 'prompt', { prompt: '__SPECIAL_SPREAD_crossroads__', mode: 'reading', afterMenu: 'tarot:reading-followups' })],
      [action('spread:horseshoe', L('🌙 Horseshoe (7)'), 'prompt', { prompt: '__SPECIAL_SPREAD_horseshoe__', mode: 'reading', afterMenu: 'tarot:reading-followups' }), action('spread:celtic', L('✡️ Celtic Cross (10)'), 'prompt', { prompt: '__SPECIAL_SPREAD_celtic__', mode: 'reading', afterMenu: 'tarot:reading-followups' })],
      back('tarot:root'),
    ],
  },
  'tarot:reading-followups': {
    title: L('🔁 Go deeper'),
    buttons: [
      [action('rf-clarify', L('🃏 Pull a clarifier'), 'prompt', { prompt: 'Pull one clarifier card for the last Tarot spread and explain what it resolves or intensifies.', mode: 'reading' }), action('rf-positions', L('📍 Explain the positions'), 'prompt', { prompt: 'Explain the spread positions and how they interact in the last Tarot reading.', mode: 'teacher' })],
      [action('rf-symbols', L('🔍 Clarify the symbolism'), 'prompt', { prompt: 'Clarify the symbolism and repeated motifs in the last Tarot reading.', mode: 'teacher' }), action('rf-shadow', L('🌑 Read it in shadow mode'), 'prompt', { prompt: 'Re-read the last Tarot spread in shadow mode. What hidden dynamic is present?', mode: 'shadow' })],
      [action('rf-practical', L('🧭 Practical next step'), 'prompt', { prompt: 'Give a practical next step and one ritual or journaling action from the last Tarot reading.', mode: 'seeker' }), action('rf-lovecareer', L('💞 Love / Career / Spiritual'), 'prompt', { prompt: 'Translate the last Tarot reading into love, career, and spiritual-development meanings.', mode: 'teacher' })],
      back('tarot:spreads'),
    ],
  },
  'tarot:browse': {
    title: L('✨ Browse the Arcana'),
    buttons: [
      [action('tarot-majors', L('✨ Major Arcana (22)'), 'submenu', { nextMenu: 'tarot:majors' })],
      [action('tarot-cups', L('🌊 Cups (14)'), 'submenu', { nextMenu: 'tarot:suit:Cups' }), action('tarot-pents', L('🌿 Pentacles (14)'), 'submenu', { nextMenu: 'tarot:suit:Pentacles' })],
      [action('tarot-swords', L('💨 Swords (14)'), 'submenu', { nextMenu: 'tarot:suit:Swords' }), action('tarot-wands', L('🔥 Wands (14)'), 'submenu', { nextMenu: 'tarot:suit:Wands' })],
      back('tarot:root'),
    ],
  },
  'tarot:majors': { title: L('✨ The 22 Major Arcana'), buttons: majorsRows() },
  'tarot:study': {
    title: L('📚 Deep Study'),
    buttons: [
      [action('tarot-qabalah-study', L('⚗️ Qabalah & Tree of Life'), 'prompt', { prompt: 'Teach Tarot through Qabalah and the Tree of Life in a structured way for a practitioner.', mode: 'qabalah' }), action('tarot-astro-study', L('🌟 Astrology Correspondences'), 'prompt', { prompt: 'Teach Tarot through astrology and decans in a structured way for a practitioner.', mode: 'astro' })],
      [action('tarot-num-study', L('🔢 Numerology & Number Keys'), 'prompt', { prompt: 'Teach Tarot numerology across the major and minor arcana with examples.', mode: 'numerology' }), action('tarot-deck-study', L('🗃️ Deck Comparison'), 'prompt', { prompt: 'Compare Marseille, Rider-Waite-Smith, and Thoth as systems and reading cultures.', mode: 'deck_compare' })],
      [action('tarot-school-study', L('🏛️ Reading Schools'), 'prompt', { prompt: 'Compare traditional/divinatory, esoteric/initatic, psychological/intuitive, and Marseille schools of Tarot reading.', mode: 'school_compare' }), action('tarot-history-study', L('📜 History & Origins'), 'prompt', { prompt: 'Trace the history and origins of Tarot carefully, separating myth from evidence.', mode: 'historian' })],
      [action('tarot-talisman-study', L('🔮 Magic & Talismans'), 'prompt', { prompt: 'Teach practical Tarot magic and talismanic work with clear caution and real correspondences.', mode: 'talisman' }), action('tarot-geomancy-study', L('🌿 Geomancy & Tarot'), 'prompt', { prompt: 'Teach how Tarot and geomancy can be used together, including figures, courts, and practical combinations.', mode: 'geomancy' })],
      [action('tarot-pathwork-study', L('🧘 Pathworking'), 'prompt', { prompt: 'Teach Tarot pathworking as a practice: preparation, entering, meeting, return, integration.', mode: 'pathwork' }), action('tarot-practitioner', L('🧭 Practitioner Meaning'), 'prompt', { prompt: 'Give the practitioner’s Tarot meaning method: upright, reversed, timing, question context, and practical use in readings.', mode: 'teacher' })],
      back('tarot:root'),
    ],
  },
  'tarot:shadow': {
    title: L('🌑 Shadow Work'),
    buttons: [
      [action('shadow-devil', L('XV · The Devil'), 'prompt', { prompt: 'Do a shadow-work session with The Devil.', mode: 'shadow' }), action('shadow-tower', L('XVI · The Tower'), 'prompt', { prompt: 'Do a shadow-work session with The Tower.', mode: 'shadow' })],
      [action('shadow-moon', L('XVIII · The Moon'), 'prompt', { prompt: 'Do a shadow-work session with The Moon.', mode: 'shadow' }), action('shadow-nine', L('Nine of Swords'), 'prompt', { prompt: 'Do a shadow-work session with Nine of Swords.', mode: 'shadow' })],
      [action('shadow-random', L('🎲 Random Shadow Card'), 'prompt', { prompt: 'Pick a strong shadow-work Tarot card and do a full session with wound, defensive pattern, and integration path.', mode: 'shadow' })],
      back('tarot:root'),
    ],
  },
  'tarot:learn': { title: L('🎓 Learning Paths'), buttons: learnRows() },
  'tarot:commands': {
    title: L('🧰 Command Deck'),
    buttons: [
      [action('cmd-reading', L('Reading · Full reading'), 'prompt', { prompt: '__SPECIAL_SPREAD_celtic__', mode: 'reading', afterMenu: 'tarot:reading-followups' }), action('cmd-learn', L('Learn · Study path'), 'submenu', { nextMenu: 'tarot:learn' })],
      [action('cmd-geomancy', L('Geomancy · Tarot & figures'), 'prompt', { prompt: 'Teach geomancy and Tarot together with examples and practical use.', mode: 'geomancy' }), action('cmd-pathwork', L('Pathwork · Guided vision'), 'prompt', { prompt: 'Guide a Tarot pathworking meditation for the current situation.', mode: 'pathwork' })],
      [action('cmd-history', L('History · Origins'), 'prompt', { prompt: 'Teach the history and origins of Tarot carefully and critically.', mode: 'historian' }), action('cmd-school', L('Schools · Reading schools'), 'prompt', { prompt: 'Compare the main Tarot reading schools with examples.', mode: 'school_compare' })],
      [action('cmd-constellation', L('Constellation · Birth & soul cards'), 'prompt', { prompt: 'Teach Tarot constellations, birth cards, soul cards, and how to work with them.', mode: 'teacher' }), action('cmd-journal', L('Journal · Tarot journaling'), 'prompt', { prompt: 'Give a Tarot journaling framework for serious daily practice.', mode: 'teacher' })],
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
      [action('dw-practice', L('🛏 Night Practice'), 'prompt', { prompt: 'Design tonight’s night-practice routine for dream recall, lucidity, and integration.', mode: 'sleep_practice' }), action('dw-check', L('✅ Checklists'), 'prompt', { prompt: 'Create a checklist for lucid dreaming, dreamwork, or astral practice based on the user’s goal.', mode: 'checklist' })],
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
      [action(`learn-${base}-steps`, L('📚 Break down the steps'), 'prompt', { prompt: `Break down the ${base} Tarot learning path into steps with reading order and exercises.`, mode:'teacher' }), action(`learn-${base}-sources`, L('📖 Key sources'), 'prompt', { prompt: `List the key sources and why they matter in the ${base} Tarot learning path.`, mode:'teacher' })],
      [action(`learn-${base}-practice`, L('🃏 Weekly practice plan'), 'prompt', { prompt: `Create a weekly practice plan for the ${base} Tarot learning path.`, mode:'teacher' }), action(`learn-${base}-next`, L('🧭 What next?'), 'prompt', { prompt: `What should a practitioner do next after the ${base} Tarot learning path?`, mode:'teacher' })],
      back('tarot:learn')
    ]}
  }
  return makeMenu(pack, key)
}
