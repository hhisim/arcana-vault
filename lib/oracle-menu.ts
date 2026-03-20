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
    title: L('☯ Tao Oracle Menu', '☯ Tao Kehaneti Menüsü', '☯ Дао Меню Оракула'),
    buttons: [
      [action('tao-daily', L('🕯️ Daily Path', '🕯️ Günlük Yol', '🕯️ Ежедневно'), 'prompt', { prompt: 'Offer a daily contemplation based on the Tao Te Ching.', mode: 'contemplation' }), action('tao-patience', L('⚖️ Patience', '⚖️ Sabır', '⚖️ Терпение'), 'prompt', { prompt: 'What does the Tao say about patience and letting things unfold in their own time?', mode: 'contemplation' })],
      [action('tao-obstacles', L('🌊 Obstacles', '🌊 Engeller', '🌊 Препятствия'), 'prompt', { prompt: 'Why do obstacles appear on the path? Teach the meaning of difficulty through a Taoist lens.', mode: 'contemplation' }), action('tao-decision', L('🧭 Decision-Making', '🧭 Karar Verme', '🧭 Принятие решений'), 'prompt', { prompt: 'How should I approach a difficult decision without forcing the outcome?', mode: 'contemplation' })],
    ],
  },
  'tarot:root': {
    title: L('🎴 The Cartomancer', '🎴 Kartomansi Portalı', '🎴 Картомант'),
    buttons: [
      [action('tarot-daily', L('🃏 Daily Card', '🃏 Günlük Kart', '🃏 Карта дня'), 'prompt', { prompt: '__SPECIAL_DAILY_CARD__', mode: 'reading', afterMenu: 'tarot:reading-followups' }), action('tarot-spreads', L('🔮 Readings', '🔮 Readings', '🔮 Расклады'), 'submenu', { nextMenu: 'tarot:spreads' })],
      [action('tarot-study', L('📚 Deep Study', '📚 Derin Eğitim', '📚 Обучение'), 'submenu', { nextMenu: 'tarot:study' }), action('tarot-shadow-menu', L('🌑 Shadow Work', '🌑 Gölge Çalışması', '🌑 Работа с тенью'), 'submenu', { nextMenu: 'tarot:shadow' })],
      [action('tarot-browse', L('✨ Browse Arcana', '✨ Arkanaya Göz At', '✨ Арканы'), 'submenu', { nextMenu: 'tarot:browse' }), action('tarot-learn', L('🎓 Learning Paths', '🎓 Öğrenme Yolları', '🎓 Пути обучения'), 'submenu', { nextMenu: 'tarot:learn' })],
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
      [action('shadow-random', L('🎲 Random Shadow Card'), 'prompt', { prompt: 'Pick a shadow-work Tarot card and do a full session with wound, defensive pattern, and integration path.', mode: 'shadow' })],
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
    title: L('🕉️ Tantra Oracle', '🕉️ Tantrik Kehanet', '🕉️ Тантра Оракул'),
    buttons: [
      [action('tantra-daily', L('🔥 Daily Technique', '🔥 Günlük Teknik', '🔥 Ежедневная практика'), 'prompt', { prompt: '__SPECIAL_DHARANA_daily__', mode: 'dharana', afterMenu: 'tantra:dharana-follow' }), action('tantra-practices', L('🧘 Practice Path', '🧘 Uygulama Yolu', '🧘 Путь практики'), 'submenu', { nextMenu: 'tantra:practices' })],
      [action('tantra-dharanas', L('✨ 112 Dharanas', '✨ 112 Dharana', '✨ 112 Дхаран'), 'submenu', { nextMenu: 'tantra:dharanas' }), action('tantra-study', L('📚 Deep Study', '📚 Derin Eğitim', '📚 Обучение'), 'submenu', { nextMenu: 'tantra:study' })],
      [action('tantra-chakras', L('🌸 Chakra Map', '🌸 Çakra Haritası', '🌸 Карта чакр'), 'submenu', { nextMenu: 'tantra:chakras' }), action('tantra-kundalini', L('⚡ Kundalini', '⚡ Kundalini', '⚡ Кундалини'), 'submenu', { nextMenu: 'tantra:kundalini' })],
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
  'entheogen:root': {
    title: L('🍄 Esoteric Entheogen', '🍄 Ezoterik Enteojen', '🍄 Эзотерический Энтеоген'),
    buttons: [
      [action('entheo-maps', L('🧠 Maps of Consciousness', '🧠 Bilinç Haritaları', '🧠 Карты сознания'), 'prompt', { prompt: 'Compare Grof, Wilber, Tart, and Lilly on entheogenic states.', mode: 'transpersonal' }), action('entheo-shamanism', L('🪶 Shamanism', '🪶 Şamanizm', '🪶 Шаманизм'), 'prompt', { prompt: 'Teach entheogens in relation to shamanic technologies and cautions.', mode: 'shamanic' })],
      [action('entheo-integration', L('✨ Integration', '✨ Entegrasyon', '✨ Интеграция'), 'prompt', { mode: 'practice', prompt: 'Offer a daily integration practice for entheogenic experiences.' }), action('entheo-safety', L('⚠️ Harm Reduction', '⚠️ Zarar Azaltma', '⚠️ Снижение вреда'), 'prompt', { prompt: 'Give a harm-reduction guide for entheogenic work with set, setting, contraindications, and integration.', mode: 'harm_reduction' })],
      [action('entheo-entities', L('👁 Entities', '👁 Varlıklar', '👁 Сущности'), 'prompt', { prompt: 'Discuss entity encounters carefully across symbolic, psychological, phenomenological, and occult frames.', mode: 'entity' }), action('entheo-mythology', L('🕯️ Mythology', '🕯️ Mitoloji', '🕯️ Мифология'), 'prompt', { mode: 'metaphysics', prompt: 'What is the metaphysics behind plant intelligence and ritual context?' })],
    ],
  },
  'sufi:root': {
    title: L('🌙 Sufi Mystic', '🌙 Sufi Mistik', '🌙 Суфийский Мистик'),
    buttons: [
      [action('sufi-contemplation', L('🕯️ Contemplation', '🕯️ Tefekkür', '🕯️ Созерцание'), 'prompt', { mode: 'contemplation', prompt: 'Give me a daily Sufi contemplation from the path of love.' }), action('sufi-lineages', L('🧭 Lineages', '🧭 Yollar', '🧭 Линии передачи'), 'submenu', { nextMenu: 'sufi:lineages' })],
      [action('sufi-rumi', L('🫀 Rumi & Shams', '🫀 Mevlana Rumi ve Şems', '🫀 Руми и Шамс'), 'submenu', { nextMenu: 'sufi:rumi' }), action('sufi-metaphysics', L('⚡ Metaphysics', '⚡ Metafizik', '⚡ Метафизика'), 'submenu', { nextMenu: 'sufi:meta' })],
      [action('sufi-practices', L('📿 Practices', '📿 Pratikler', '📿 Практики'), 'submenu', { nextMenu: 'sufi:practices' }), action('sufi-poetry', L('📜 Poetry', '📜 Şiir', '📜 Поэзия'), 'submenu', { nextMenu: 'sufi:poetry' })],
    ]
  },
  'sufi:lineages': {
    title: L('🧭 Sufi Lineages', '🧭 Sufi Yolları', '🧭 Суфийские Линии'),
    buttons: [
      [action('shadhili', L('🌿 Shadhiliya', '🌿 Şazeliyye', '🌿 Шазилия'), 'prompt', { mode: 'historian', prompt: 'Teach me about the Shadhili path, its emphasis on gratitude, and its key masters like Imam al-Shadhili and Ibn Ata Allah.' }), action('naqshbandi', L('💎 Naqshbandiya', '💎 Nakşibendiyye', '💎 Накшбандия'), 'prompt', { mode: 'historian', prompt: 'Teach me about the Naqshbandi path, the silent dhikr, and its emphasis on companionship (sohbet).' })],
      [action('chishti', L('🎵 Chishtiya', '🎵 Çeştiyye', '🎵 Чиштия'), 'prompt', { mode: 'historian', prompt: 'Teach me about the Chishti path, its use of music (sama), and the message of Hazrat Inayat Khan.' }), action('mevlevi', L('🌀 Mevleviya', '🌀 Mevleviyye', '🌀 Мевлевия'), 'prompt', { mode: 'historian', prompt: 'Teach me about the Mevlevi path, the Whirling Dervishes, and the legacy of Rumi.' })],
      back('sufi:root')
    ]
  },
  'sufi:rumi': {
    title: L('🫀 Rumi & Shams', '🫀 Rumi & Şems', '🫀 Руми и Шамс'),
    buttons: [
      [action('masnavi', L('📚 The Masnavi', '📚 Mesnevi', '📚 Маснави'), 'prompt', { mode: 'poetry', prompt: 'Recite and explain a key passage from the Masnavi about the longing of the soul.' }), action('shams', L('🔥 Shams Tabrizi', '🔥 Şems-i Tebrizi', '🔥 Шамс Табризи'), 'prompt', { mode: 'historian', prompt: 'Tell me about the meeting of Rumi and Shams and the transformation of the scholar into the lover.' })],
      [action('divan', L('🎼 Divan-e Shams', '🎼 Divan-ı Kebir', '🎼 Диван Шамса'), 'prompt', { mode: 'poetry', prompt: 'Share a ghazal from the Divan-e Kabir that captures the intoxication of divine love.' }), action('life', L('📖 Life in Konya', '📖 Konya’daki Hayatı', '📖 Жизнь в Конье'), 'prompt', { mode: 'historian', prompt: 'Tell me about Rumi’s life in Konya, the cultural context of his time, and his enduring legacy.' })],
      back('sufi:root')
    ]
  },
  'sufi:meta': {
    title: L('⚡ Sufi Metaphysics', '⚡ Metafizik', '⚡ Метафизика'),
    buttons: [
      [action('ibn-arabi', L('🌊 Ibn Arabi', '🌊 İbn Arabi', '🌊 Ибн Араби'), 'prompt', { mode: 'metaphysics', prompt: 'Explain the Unity of Being (Wahdat al-Wujud) transition from multiplicity to oneness.' }), action('ghazali', L('📖 Al-Ghazali', '📖 İmam Gazali', '📖 Аль-Газали'), 'prompt', { mode: 'historian', prompt: 'Teach me Al-Ghazali’s synthesis of law, theology, and Sufism in the Ihya.' })],
      [action('unity', L('💎 Tawhid', '💎 Tevhid', '💎 Таухид'), 'prompt', { mode: 'metaphysics', prompt: 'Explain the Sufi understanding of Divine Agency (Unity of Actions) in daily life.' }), action('love', L('❤️ Metaphysics of Love', '❤️ Aşkın Metafiziği', '❤️ Метафизика Любви'), 'prompt', { mode: 'metaphysics', prompt: 'Explain al-hubb and ishqq in Sufi cosmology and why love is the governing principle of the universe.' })],
      back('sufi:root')
    ]
  },
  'sufi:practices': {
    title: L('📿 Sufi Practices', '📿 Pratikler', '📿 Практики'),
    buttons: [
      [action('dhikr', L('📿 Dhikr Instruction', '📿 Zikir Eğitimi', '📿 Инструкция зикра'), 'prompt', { mode: 'contemplation', prompt: 'Guide me in a simple dhikr practice (remembrance) for centering the heart.' }), action('muraqaba', L('🧘 Muraqaba', '🧘 Murakabe', '🧘 Муракаба'), 'prompt', { mode: 'contemplation', prompt: 'Teach me the practice of Sufi meditation (muraqaba) and heart-watching.' })],
      [action('adab', L('✨ Adab & Courtesy', '✨ Edep ve Nezaket', '✨ Адаб'), 'prompt', { mode: 'contemplation', prompt: 'Explain the spiritual importance of Adab (etiquette) on the path to the Beloved.' }), action('daily', L('🛎️ Daily Record', '🛎️ Günlük Kayıt', '🛎️ Ежедневная запись'), 'prompt', { mode: 'contemplation', prompt: 'Teach me how to maintain a spiritual diary and account for my soul (muhasaba) each day.' })],
      back('sufi:root')
    ]
  },
  'sufi:poetry': {
    title: L('📜 Sufi Poetry', '📜 Şiir', '📜 Поэзия'),
    buttons: [
      [action('hafiz', L('🍷 Hafiz of Shiraz', '🍷 Hafız-ı Şirazi', '🍷 Хафиз Ширази'), 'prompt', { mode: 'poetry', prompt: 'Share the wisdom of Hafiz regarding the tavern of ruin and the wine of love.' }), action('attar', L('🕊️ Fariduddin Attar', '🕊️ Ferüdüddin Attar', '🕊️ Фаридуддин Аттар'), 'prompt', { mode: 'poetry', prompt: 'Teach me the lessons from the Conference of the Birds and the seven valleys of the quest.' })],
      [action('rabia', L('❤️ Rabia al-Adawiyya', '❤️ Rabia el-Adeviyye', '❤️ Рабия аль-Адавия'), 'prompt', { mode: 'poetry', prompt: 'Tell me about the pure love of Rabia and her refusal to worship out of fear of hell or hope for heaven.' }), action('symbols', L('🏺 Symbolism Guide', '🏺 Sembolizm Rehberi', '🏺 Гид по символам'), 'prompt', { mode: 'poetry', prompt: 'Explain common Sufi symbols: wine, tavern, cupbearer, beloved, locks of hair, and nightingales.' })],
      back('sufi:root')
    ]
  },
  'dreamwalker:root': {
    title: L('🌌 Dreamwalker', '🌌 Rüya Gezgini', '🌌 Сноходец'),
    buttons: [
      [action('induction', L('🌙 Induction', '🌙 İndüksiyon', '🌙 Индукция'), 'prompt', { mode: 'contemplation', prompt: 'Give me a specific technique to trigger lucidity tonight.' }), action('interpretation', L('🔮 Interpretation', '🔮 Rüya Yorumu', '🔮 Толкование'), 'submenu', { nextMenu: 'dream:interpretation' })],
      [action('astral', L('✨ Astral / OBIE', '✨ Astral / OBIE', '✨ Астрал'), 'submenu', { nextMenu: 'dream:astral' }), action('yoga', L('🕉 Dream Yoga', '🕉 Rüya Yogası', '🕉 Йога сна'), 'prompt', { mode: 'contemplation', prompt: 'Teach me the fundamentals of Tibetan Dream Yoga.' })],
      [action('daily', L('🛠️ Daily Work', '🛠️ Günlük Çalışma', '🛠️ Работа'), 'submenu', { nextMenu: 'dream:daily' }), action('rv', L('📡 Remote Viewing', '📡 Uzaktan Görüş', '📡 Удаленное видение'), 'submenu', { nextMenu: 'dream:remote' })],
      back('root')
    ]
  },
  'dream:symbols': {
    title: L('👁️ Symbols', '👁️ Sembolizm', '👁️ Символика'),
    buttons: [
      [action('archetypes', L('🎭 Archetypes', '🎭 Arketipler', '🎭 Архетипы'), 'prompt', { mode: 'contemplation', prompt: 'Explain the common archetypes encountered in the dream state and how to engage them.' }), action('animals', L('🐾 Animal Guides', '🐾 Hayvanlar', '🐾 Тотемы'), 'prompt', { mode: 'contemplation', prompt: 'How do I interpret animal appearances in dreams?' })],
      [action('elements', L('🔥 Elements', '🔥 Elementler', '🔥 Элементы'), 'prompt', { mode: 'contemplation', prompt: 'What does the presence of elements indicate in the dream landscape?' }), ...back('dreamwalker:root')]
    ]
  },
  'dream:astral': {
    title: L('✨ Astral Projection', '✨ Astral Projeksiyon', '✨ Астральная Проекция'),
    buttons: [
      [action('separation', L('⚡ Separation', '⚡ Ayrılma', '⚡ Разделение'), 'prompt', { mode: 'contemplation', prompt: 'Guide me through the vibrational stage and different separation techniques.' }), action('realms', L('🌍 Realms', '🌍 Alemler', '🌍 Миры'), 'prompt', { mode: 'historian', prompt: 'Describe the different layers or realms of the astral plane.' })],
      [action('cord', L('🔗 The Silver Cord', '🔗 Gümüş Kordon', '🔗 Серебряный шнур'), 'prompt', { mode: 'historian', prompt: 'Explain the concept of the silver cord and returned mechanics.' }), ...back('dreamwalker:root')]
    ]
  },
  'dream:daily': {
    title: L('🛠️ Daily Work', '🛠️ Günlük Çalışma', '🛠️ Работа'),
    buttons: [
      [action('reality', L('✅ Reality Checks', '✅ Kontroller', '✅ Проверки'), 'prompt', { mode: 'contemplation', prompt: 'Give me a list of the most effective reality checks.' }), action('journal', L('📓 Journaling', '📓 Günlük Tutma', '📓 Дневник'), 'prompt', { mode: 'contemplation', prompt: 'Teach me how to optimize my dream journal for maximum recall.' })],
      [action('incubation', L('🥚 Incubation', '🥚 İnkübasyon', '🥚 Инкубация'), 'prompt', { mode: 'contemplation', prompt: 'How do I incubate a specific dream or ask for guidance before sleep?' }), ...back('dreamwalker:root')]
    ]
  },
  'dream:remote': {
    title: L('📡 Remote Viewing', '📡 Uzaktan Görüş', '📡 Удаленное видение'),
    buttons: [
      [action('targ', L('🔮 Targ & Price', '🔮 Targ ve Price', '🔮 Тарг и Прайс'), 'prompt', { mode: 'remote_viewing', prompt: 'Teach Russell Targ and Pat Price SRI work.' }), action('mcmoneagle', L('📡 Joe McMoneagle', '📡 Joe McMoneagle', '📡 Джо Макмонигл'), 'prompt', { mode: 'remote_viewing', prompt: 'Teach Joe McMoneagle years of work, Stargate Results.' })],
      [action('protocols', L('🛎️ RV Protocol', '🛎️ RV Protokolü', '📡 Протоколы'), 'prompt', { mode: 'remote_viewing', prompt: 'Teach standard remote viewing protocol.' }), ...back('dreamwalker:root')]
    ]
  },
  'dream:interpretation': {
    title: L('🔮 Interpretation', '🔮 Rüya Yorumu', '🔮 Толкование'),
    buttons: [
      [action('jung', L('🧠 Jungian Lens', '🧠 Jung Yaklaşımı', '🧠 Метод Юнга'), 'prompt', { mode: 'interpretation', prompt: 'Teach Jungian dream interpretation: complexes, archetypes.' }), action('nightmare', L('⚠️ Nightmares', '⚠️ Kabuslar', '⚠️ Кошмары'), 'prompt', { mode: 'interpretation', prompt: 'Teach nightmare transformation and shadow work.' })],
      back('dreamwalker:root')
    ]
  }
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
