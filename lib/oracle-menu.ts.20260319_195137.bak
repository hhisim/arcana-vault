
import type { OracleMode, OraclePack, UiLang } from '@/lib/oracle-ui'

type Localized = Record<UiLang, string>

export type MenuActionKind = 'submenu' | 'prompt' | 'back' | 'voice' | 'language' | 'invite' | 'gift' | 'plans' | 'switch'

export interface MenuAction {
  id: string
  label: Localized
  kind: MenuActionKind
  nextMenu?: string
  prompt?: string
  mode?: OracleMode
  displayText?: Localized
}

export interface MenuScreen {
  title: Localized
  buttons: MenuAction[][]
}

const L = (en: string, tr?: string, ru?: string): Localized => ({ en, tr: tr ?? en, ru: ru ?? en })
const action = (id: string, label: Localized, kind: MenuActionKind, extra: Partial<MenuAction> = {}): MenuAction => ({ id, label, kind, ...extra })
const back = (nextMenu: string) => [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu })]
const utilityRows = [
  [action('voice', L('🎙 Voice', '🎙 Ses', '🎙 Голос'), 'voice'), action('language', L('🌐 Language', '🌐 Dil', '🌐 Язык'), 'language')],
  [action('invite', L('🔗 Invite', '🔗 Davet', '🔗 Пригласить'), 'invite'), action('gift', L('🎁 Gift', '🎁 Hediye', '🎁 Подарок'), 'gift')],
  [action('switch', L('🔀 Switch', '🔀 Değiştir', '🔀 Сменить'), 'switch'), action('plans', L('💳 Plans', '💳 Planlar', '💳 Тарифы'), 'plans')],
]

const majorCards = [
  '0 · The Fool','I · The Magician','II · The High Priestess','III · The Empress','IV · The Emperor','V · The Hierophant',
  'VI · The Lovers','VII · The Chariot','VIII · Strength','IX · The Hermit','X · Wheel of Fortune','XI · Justice',
  'XII · The Hanged Man','XIII · Death','XIV · Temperance','XV · The Devil','XVI · The Tower','XVII · The Star',
  'XVIII · The Moon','XIX · The Sun','XX · Judgement','XXI · The World'
]

function tarotCardRows() {
  const rows: MenuAction[][] = []
  for (let i=0;i<majorCards.length;i+=2) {
    const slice = majorCards.slice(i,i+2)
    rows.push(slice.map((card) => action(`tarot-card-${card}`, L(card), 'prompt', {
      prompt: `Give a deep but readable reading of ${card} in Tarot, including symbolism, shadow, light, and practical guidance.`,
      mode: 'reading',
    })))
  }
  return rows
}

const MENUS: Record<string, MenuScreen> = {
  'tao:root': {
    title: L('☯️ Tao Oracle Menu'),
    buttons: [
      [action('tao-patience', L('What does the Tao say about patience?'), 'prompt', { prompt: 'What does the Tao say about patience?', mode: 'oracle' }), action('tao-obstacles', L('Why do obstacles appear?'), 'prompt', { prompt: 'Why do obstacles appear?', mode: 'oracle' })],
      [action('tao-decision', L('How should I approach a difficult decision?'), 'prompt', { prompt: 'How should I approach a difficult decision?', mode: 'seeker' }), action('tao-daily', L('Share wisdom for today.'), 'prompt', { prompt: 'Share wisdom for today.', mode: 'quote' })],
      ...utilityRows,
    ],
  },
  'tarot:root': {
    title: L('🎴 The Cartomancer'),
    buttons: [
      [action('tarot-daily', L('✨ Daily Draw'), 'prompt', { prompt: 'Draw a card for today and interpret it clearly.', mode: 'reading' }), action('tarot-shadow', L('🪞 Shadow Work'), 'prompt', { prompt: 'Give me a shadow reading for the current moment.', mode: 'shadow' })],
      [action('tarot-browse', L('✨ Browse the Arcana'), 'submenu', { nextMenu: 'tarot:browse' }), action('tarot-study', L('📚 Deep Study'), 'submenu', { nextMenu: 'tarot:study' })],
      [action('tarot-compare', L('⚖️ Deck Compare'), 'prompt', { prompt: 'Compare Marseille and Rider-Waite on The Fool.', mode: 'deck_compare' }), action('tarot-qabalah', L('🔯 Qabalah'), 'prompt', { prompt: 'Explain the Qabalistic significance of The Fool.', mode: 'qabalah' })],
      ...utilityRows,
    ],
  },
  'tarot:browse': {
    title: L('✨ Browse the Arcana'),
    buttons: [
      [action('tarot-majors', L('✨ Major Arcana (22)'), 'submenu', { nextMenu: 'tarot:majors' })],
      [action('tarot-cups', L('🌊 Cups (14)'), 'prompt', { prompt: 'Teach the Cups suit in Tarot: emotional, mystical, relational, and divinatory meanings.', mode: 'teacher' }), action('tarot-pents', L('🌿 Pentacles (14)'), 'prompt', { prompt: 'Teach the Pentacles suit in Tarot: material, bodily, practical, and magical meanings.', mode: 'teacher' })],
      [action('tarot-swords', L('💨 Swords (14)'), 'prompt', { prompt: 'Teach the Swords suit in Tarot: mental conflict, truth, severance, and clarity.', mode: 'teacher' }), action('tarot-wands', L('🔥 Wands (14)'), 'prompt', { prompt: 'Teach the Wands suit in Tarot: will, fire, eros, spirit, and action.', mode: 'teacher' })],
      back('tarot:root'),
    ],
  },
  'tarot:majors': { title: L('✨ The 22 Major Arcana'), buttons: [...tarotCardRows(), back('tarot:browse')] },
  'tarot:study': {
    title: L('📚 Deep Study'),
    buttons: [
      [action('tarot-teacher', L('🧭 Teacher'), 'prompt', { prompt: 'Teach the Tarot as a structured beginner-to-intermediate curriculum.', mode: 'teacher' }), action('tarot-historian', L('🏺 Historian'), 'prompt', { prompt: 'Trace the historical lineage of Tarot from Visconti-Sforza to Marseille, RWS, and Thoth.', mode: 'historian' })],
      [action('tarot-astro', L('♈ Astrology'), 'prompt', { prompt: 'Explain the astrological correspondences of the major arcana.', mode: 'astro' }), action('tarot-num', L('🔢 Numerology'), 'prompt', { prompt: 'Explain numerology in Tarot across the major arcana and suits.', mode: 'numerology' })],
      [action('tarot-pathwork', L('🜂 Pathworking'), 'prompt', { prompt: 'Guide a Tarot pathworking meditation for The High Priestess.', mode: 'pathwork' }), action('tarot-geomancy', L('🜁 Geomancy'), 'prompt', { prompt: 'Explain how Tarot and geomancy can be used together.', mode: 'geomancy' })],
      back('tarot:root'),
    ],
  },
  'tantra:root': {
    title: L('🔥 Shakti Oracle'),
    buttons: [
      [action('tantra-daily', L('🔥 Daily Technique'), 'prompt', { prompt: 'Offer one tantra or dharana-based practice for today.', mode: 'dharana' }), action('tantra-practice', L('🙏 Practice Path'), 'submenu', { nextMenu: 'tantra:practice' })],
      [action('tantra-dharanas', L('✨ 112 Dharanas'), 'submenu', { nextMenu: 'tantra:dharanas' }), action('tantra-study', L('📚 Deep Study'), 'submenu', { nextMenu: 'tantra:study' })],
      [action('tantra-chakra', L('🌸 Chakra Map'), 'submenu', { nextMenu: 'tantra:chakra' }), action('tantra-kundalini', L('⚡ Kundalini'), 'prompt', { prompt: 'Explain kundalini clearly, carefully, and without sensationalism.', mode: 'kundalini' })],
      ...utilityRows,
    ],
  },
  'tantra:practice': {
    title: L('🙏 Practice Path'),
    buttons: [
      [action('tantra-seeker', L('🪷 Seeker'), 'prompt', { prompt: 'Offer a seeker-friendly tantra practice path for the next month.', mode: 'seeker' }), action('tantra-shiva', L('🕉 Shiva–Shakti'), 'prompt', { prompt: 'Explain Shiva and Shakti as lived practice, not just metaphysics.', mode: 'shiva_shakti' })],
      [action('tantra-vedanta', L('🪞 Vedanta'), 'prompt', { prompt: 'Explain Vedanta in relation to tantra and direct realization.', mode: 'vedanta' }), action('tantra-surrender', L('🌊 Surrender'), 'prompt', { prompt: 'Offer one embodied surrender practice for today.', mode: 'surrender' })],
      back('tantra:root'),
    ],
  },
  'tantra:dharanas': {
    title: L('✨ 112 Dharanas'),
    buttons: [
      [action('d1', L('🏳️ Sacred Breath (1–9)'), 'prompt', { prompt: 'Teach the Sacred Breath dharanas (1–9): essence, cautions, and one practice.', mode: 'dharana' })],
      [action('d2', L('🔥 The Rising Fire (10–22)'), 'prompt', { prompt: 'Teach The Rising Fire dharanas (10–22): essence, cautions, and one practice.', mode: 'dharana' })],
      [action('d3', L('✨ Senses as Sacred Doors (23–42)'), 'prompt', { prompt: 'Teach the dharanas that use the senses as sacred doors (23–42).', mode: 'dharana' })],
      [action('d4', L('🌌 The Inner Sky (43–56)'), 'prompt', { prompt: 'Teach The Inner Sky dharanas (43–56).', mode: 'dharana' })],
      [action('d5', L('👁 The Pure Witness (57–71)'), 'prompt', { prompt: 'Teach The Pure Witness dharanas (57–71).', mode: 'dharana' })],
      [action('d6', L('🎶 Sacred Sound & Mantra (72–83)'), 'prompt', { prompt: 'Teach the Sacred Sound & Mantra dharanas (72–83).', mode: 'dharana' })],
      [action('d7', L('🌹 Surrender & Devotion (84–99)'), 'prompt', { prompt: 'Teach the Surrender & Devotion dharanas (84–99).', mode: 'dharana' })],
      [action('d8', L('☀️ The Absolute (100–112)'), 'prompt', { prompt: 'Teach the final dharanas (100–112) in relation to the Absolute.', mode: 'dharana' })],
      back('tantra:root'),
    ],
  },
  'tantra:chakra': {
    title: L('🌸 Chakra Map'),
    buttons: [
      [action('c1', L('🟥 Root'), 'prompt', { prompt: 'Explain the Root chakra in a safe, grounded tantra frame.', mode: 'chakra' })],
      [action('c2', L('🟧 Sacral'), 'prompt', { prompt: 'Explain the Sacral chakra in a safe, grounded tantra frame.', mode: 'chakra' })],
      [action('c3', L('🟨 Solar Plexus'), 'prompt', { prompt: 'Explain the Solar Plexus chakra in a safe, grounded tantra frame.', mode: 'chakra' })],
      [action('c4', L('💚 Heart'), 'prompt', { prompt: 'Explain the Heart chakra in a safe, grounded tantra frame.', mode: 'chakra' })],
      [action('c5', L('🔵 Throat'), 'prompt', { prompt: 'Explain the Throat chakra in a safe, grounded tantra frame.', mode: 'chakra' })],
      [action('c6', L('🟣 Third Eye'), 'prompt', { prompt: 'Explain the Third Eye chakra in a safe, grounded tantra frame.', mode: 'chakra' })],
      [action('c7', L('🟤 Crown'), 'prompt', { prompt: 'Explain the Crown chakra in a safe, grounded tantra frame.', mode: 'chakra' })],
      [action('c8', L('⚡ Full Map'), 'prompt', { prompt: 'Give a full chakra map overview in tantra, with cautions and good practice principles.', mode: 'chakra' })],
      back('tantra:root'),
    ],
  },
  'tantra:study': {
    title: L('📚 Deep Study'),
    buttons: [
      [action('tantra-scholar', L('📚 Scholar'), 'prompt', { prompt: 'Teach tantra through a scholarly comparison of schools, goals, symbols, and methods.', mode: 'scholar' }), action('tantra-compare', L('⚖️ School Compare'), 'prompt', { prompt: 'Compare Kashmir Shaivism, classical tantra, Vedanta, and modern neo-tantra carefully.', mode: 'school_compare' })],
      [action('tantra-teacher', L('🧭 Teacher'), 'prompt', { prompt: 'Teach tantra in a practical, serious, beginner-safe way.', mode: 'teacher' }), action('tantra-history', L('🏺 Historian'), 'prompt', { prompt: 'Give a concise history of tantra and its major streams.', mode: 'historian' })],
      back('tantra:root'),
    ],
  },
  'entheogen:root': {
    title: L('🍄 Esoteric Entheogen'),
    buttons: [
      [action('ent-maps', L('🧠 Maps of Consciousness'), 'submenu', { nextMenu: 'entheogen:maps' }), action('ent-shamanism', L('🪶 Shamanism'), 'submenu', { nextMenu: 'entheogen:shamanism' })],
      [action('ent-ethno', L('🌿 Ethnobotany'), 'submenu', { nextMenu: 'entheogen:ethno' }), action('ent-pharma', L('🔬 Pharmacopoeia'), 'submenu', { nextMenu: 'entheogen:pharma' })],
      [action('ent-safety', L('⚠️ Harm Reduction'), 'submenu', { nextMenu: 'entheogen:safety' }), action('ent-entities', L('👁 Entity Types'), 'submenu', { nextMenu: 'entheogen:entities' })],
      [action('ent-guides', L('🧭 Trip Guides'), 'submenu', { nextMenu: 'entheogen:guides' }), action('ent-corr', L('🕸 Correspondence Web'), 'submenu', { nextMenu: 'entheogen:corr' })],
      [action('ent-study', L('📚 Deep Study'), 'submenu', { nextMenu: 'entheogen:study' }), action('ent-history', L('🏛 History & Philosophy'), 'submenu', { nextMenu: 'entheogen:history' })],
      ...utilityRows,
    ],
  },
  'entheogen:maps': { title: L('🧠 Maps of Consciousness'), buttons: [
      [action('grof', L('🌀 Grof · Holotropic'), 'prompt', { prompt: `Explain Stanislav Grof's map of the psyche: biographical, perinatal, transpersonal, and implications for psychedelic states.`, mode: 'transpersonal' })],
      [action('wilber', L('🏔 Wilber · Spectrum'), 'prompt', { prompt: `Explain Ken Wilber's transpersonal spectrum and how psychedelic states fit or fail to fit it.`, mode: 'transpersonal' })],
      [action('tart', L('🧭 Tart · States of Consciousness'), 'prompt', { prompt: `Explain Charles Tart's state-specific sciences and altered states framework for psychedelics.`, mode: 'transpersonal' })],
      [action('lilly', L('🐬 Lilly · Metaprogramming'), 'prompt', { prompt: `Explain John C. Lilly's metaprogramming and inner-space model in relation to psychedelic exploration.`, mode: 'transpersonal' })],
      back('entheogen:root'),
    ]},
  'entheogen:shamanism': { title: L('🪶 Shamanism'), buttons: [
      [action('core-shamanism', L('🪘 Core Shamanism'), 'prompt', { prompt: `Compare shamanic models of healing, journeying, initiation, and plant relations across the archive.`, mode: 'shamanic' })],
      [action('soul', L('🫀 Soul retrieval'), 'prompt', { prompt: `Explain soul loss and soul retrieval in shamanic discourse, carefully and non-sensationally.`, mode: 'shamanic' })],
      [action('icaros', L('🎵 Songs, icaros, invocation'), 'prompt', { prompt: `Explain songs, chants, icaros, and invocation in shamanic and plant medicine settings.`, mode: 'shamanic' })],
      [action('schools', L('⚖️ Compare schools'), 'prompt', { prompt: `Compare shamanic, clinical, and transpersonal interpretations of entheogenic experience.`, mode: 'school_compare' })],
      back('entheogen:root'),
    ]},
  'entheogen:ethno': { title: L('🌿 Ethnobotany'), buttons: [
      [action('mushrooms', L('🍄 Sacred Mushrooms'), 'prompt', { prompt: `Teach sacred mushrooms through ethnobotany, history, and meaning.`, mode: 'ethnobotany' })],
      [action('ayahuasca', L('🍃 Ayahuasca Plants'), 'prompt', { prompt: `Teach the ayahuasca botanical matrix: vines, admixtures, traditions, ritual and ethnobotany.`, mode: 'ethnobotany' })],
      [action('peyote', L('🌵 Peyote / Mescaline'), 'prompt', { prompt: `Teach peyote and mescaline from ethnobotanical, historical, and ceremonial perspectives.`, mode: 'ethnobotany' })],
      [action('salvia', L('🌀 Salvia divinorum'), 'prompt', { prompt: `Teach Salvia divinorum through ethnobotany, phenomenology, and distinctiveness from serotonergic psychedelics.`, mode: 'ethnobotany' })],
      [action('ancient', L('🏺 Ancient sacred plants'), 'prompt', { prompt: `Teach ancient sacred plants, mystery religions, and entheogens in relation to religion and myth.`, mode: 'historian' })],
      back('entheogen:root'),
    ]},
  'entheogen:pharma': { title: L('🔬 Pharmacopoeia'), buttons: [
      [action('tryptamines', L('🧬 Tryptamines'), 'prompt', { prompt: `Explain the tryptamine family in the archive: DMT, psilocybin, analogues, phenomenology, duration, and key thinkers.`, mode: 'pharmacology' })],
      [action('lysergamides', L('🧪 Lysergamides'), 'prompt', { prompt: `Explain LSD and the lysergamide family from chemistry, pharmacology, history, and therapeutic use perspectives.`, mode: 'pharmacology' })],
      [action('phenethylamines', L('💠 Phenethylamines'), 'prompt', { prompt: `Explain mescaline and the phenethylamine world as represented in the archive.`, mode: 'pharmacology' })],
      [action('dissociatives', L('🫧 Dissociatives'), 'prompt', { prompt: `Explain ketamine and related dissociative territory in the archive.`, mode: 'pharmacology' })],
      [action('correspond', L('🕸 Plant ↔ Molecule'), 'prompt', { prompt: `Map plants, principal alkaloids, chemical families, and experiential signatures across the entheogen archive.`, mode: 'correspondence' })],
      back('entheogen:root'),
    ]},
  'entheogen:safety': { title: L('⚠️ Harm Reduction'), buttons: [
      [action('set-setting', L('🧭 Set & Setting'), 'prompt', { prompt: `Give a careful set and setting guide for entheogenic work: mindset, environment, intentions, and support.`, mode: 'guide' })],
      [action('contra', L('🚫 Contraindications'), 'prompt', { prompt: `Explain major contraindication domains for entheogens in a harm reduction frame.`, mode: 'harm_reduction' })],
      [action('interactions', L('⚠️ Interactions'), 'prompt', { prompt: `Give a harm reduction overview of major entheogen interaction categories and why combinations can become risky.`, mode: 'harm_reduction' })],
      [action('integration', L('🪞 Integration'), 'prompt', { prompt: `Teach psychedelic integration: journaling, therapy, ritual closure, embodiment, and discernment.`, mode: 'guide' })],
      [action('sitter', L('🤝 Trip Sitter Guide'), 'prompt', { prompt: `Give a practical trip sitter guide: presence, language, boundaries, safety, escalation, and what not to do.`, mode: 'guide' })],
      back('entheogen:root'),
    ]},
  'entheogen:entities': { title: L('👁 DMT Entity Atlas'), buttons: [
      [action('trickster', L('🃏 Trickster / Jester'), 'prompt', { prompt: `Describe trickster or jester-like DMT entities as reported in the archive, framing them as phenomenological motifs rather than objective proof.`, mode: 'entity' })],
      [action('teacher', L('📚 Teachers / Instructors'), 'prompt', { prompt: `Describe teacher-like, guide-like, or initiatory DMT entities in the archive as phenomenological motifs.`, mode: 'entity' })],
      [action('machine', L('⚙️ Machine / Geometry beings'), 'prompt', { prompt: `Describe machine-like, geometric, or hyperdimensional intelligences in DMT reports from the archive.`, mode: 'entity' })],
      [action('question', L('❓ What are entities?'), 'prompt', { prompt: `What are DMT entities according to the archive? Compare phenomenological, psychological, spiritual, and skeptical frames without claiming certainty.`, mode: 'philosophy' })],
      back('entheogen:root'),
    ]},
  'entheogen:guides': { title: L('🧭 Set, Setting & Guides'), buttons: [
      [action('first', L('🌱 First Journey'), 'prompt', { prompt: `Give a grounded guide for a first entheogenic journey, emphasizing preparation, support, pacing, and integration.`, mode: 'guide' })],
      [action('ritual', L('🕯 Ritual Container'), 'prompt', { prompt: `Teach how ritual container shapes entheogenic work.`, mode: 'guide' })],
      [action('after', L('🌄 The Morning After'), 'prompt', { prompt: `Teach the morning-after integration frame for a powerful entheogenic experience.`, mode: 'guide' })],
      [action('questions', L('🤔 Pre-trip questions'), 'prompt', { prompt: `Give a set of pre-trip questions to ask before entheogenic work.`, mode: 'guide' })],
      back('entheogen:root'),
    ]},
  'entheogen:corr': { title: L('🕸 Correspondence Web'), buttons: [
      [action('correspond', L('🌿 Plant ↔ Molecule'), 'prompt', { prompt: `Map plants, principal alkaloids, chemical families, ritual contexts, and experiential signatures across the archive.`, mode: 'correspondence' })],
      [action('analogues', L('🍃 Ayahuasca analogues'), 'prompt', { prompt: `Explain ayahuasca analogues and plant-based tryptamine pathways in a historical and comparative way, without recipes or extraction details.`, mode: 'pharmacology' })],
      [action('pathways', L('⚖️ Compare classic pathways'), 'prompt', { prompt: `Compare psilocybin, LSD, mescaline, ayahuasca, salvia, and ketamine across tone, symbolism, and integration challenges.`, mode: 'school_compare' })],
      back('entheogen:root'),
    ]},
  'entheogen:study': { title: L('📚 Deep Study'), buttons: [
      [action('transpersonal-study', L('🧠 Transpersonal Psychology'), 'prompt', { prompt: `Teach transpersonal psychology as it appears across the entheogen archive.`, mode: 'transpersonal' })],
      [action('therapy', L('🛋 Psychedelic Therapy'), 'prompt', { prompt: `Teach psychedelic therapy in the archive: healing, preparation, setting, and integration.`, mode: 'scholar' })],
      [action('religion', L('⛩ Religion & Mysticism'), 'prompt', { prompt: `Teach religion and mysticism in relation to entheogens.`, mode: 'philosophy' })],
      [action('compare', L('⚖️ Compare schools'), 'prompt', { prompt: `Compare the major schools in the entheogen archive: transpersonal, shamanic, clinical, philosophical, and skeptical.`, mode: 'school_compare' })],
      back('entheogen:root'),
    ]},
  'entheogen:history': { title: L('🏛 History & Philosophy'), buttons: [
      [action('origins', L('🏺 Ancient Mysteries'), 'prompt', { prompt: `Teach the ancient mysteries and sacred plants in the entheogen archive.`, mode: 'historian' })],
      [action('mckenna', L('🛰 McKenna / Hyperspace'), 'prompt', { prompt: `Summarize Terence McKenna's hyperspace and novelty ideas critically and clearly.`, mode: 'philosophy' })],
      [action('history', L('📜 Modern psychedelic history'), 'prompt', { prompt: `Give a concise history of modern psychedelic culture and research.`, mode: 'historian' })],
      back('entheogen:root'),
    ]},
  'sufi:root': {
    title: L('🌙 Sufi Mystic'),
    buttons: [
      [action('sufi-daily', L('🌙 Daily contemplation'), 'prompt', { prompt: 'Offer one Sufi contemplation for today: a symbol, a station of the path, one practical adab, and one question for self-accounting.', mode: 'oracle' }), action('sufi-paths', L('🗺 Paths & Lineages'), 'submenu', { nextMenu: 'sufi:paths' })],
      [action('sufi-maqam', L('⛰ Stations & States'), 'submenu', { nextMenu: 'sufi:maqam' }), action('sufi-practice', L('📿 Practices & Adab'), 'submenu', { nextMenu: 'sufi:practice' })],
      [action('sufi-poetry', L('🌹 Poetry & Symbols'), 'submenu', { nextMenu: 'sufi:poetry' }), action('sufi-masters', L('🧙 Masters'), 'submenu', { nextMenu: 'sufi:masters' })],
      [action('sufi-meta', L('🌌 Metaphysics'), 'submenu', { nextMenu: 'sufi:meta' }), action('sufi-heart', L('🪞 Heart Mirror'), 'submenu', { nextMenu: 'sufi:heart' })],
      [action('sufi-history', L('🏺 History & Ethics'), 'submenu', { nextMenu: 'sufi:history' }), action('sufi-question', L('🤔 Provoking Questions'), 'submenu', { nextMenu: 'sufi:question' })],
      ...utilityRows,
    ],
  },
  'sufi:paths': { title: L('🗺 Paths & Lineages'), buttons: [
      [action('qadiri', L('🟢 Qadiri Path'), 'prompt', { prompt: 'Teach the Qadiri path: its ethos, devotional character, service, remembrance, and how it is traditionally understood.', mode: 'tariqa' })],
      [action('naqshbandi', L('🫧 Naqshbandi Path'), 'prompt', { prompt: 'Teach the Naqshbandi path: silent dhikr, sobriety, vigilance, companionship, and the inner work of presence.', mode: 'tariqa' })],
      [action('chishti', L('🎶 Chishti Path'), 'prompt', { prompt: 'Teach the Chishti path: love, hospitality, music, service, and the social heart of devotion.', mode: 'tariqa' })],
      [action('mevlevi', L('🌀 Mevlevi Path'), 'prompt', { prompt: 'Teach the Mevlevi path: Rumi, sema, music, disciplined refinement, and the symbolism of turning.', mode: 'tariqa' })],
      [action('shadhili', L('🌊 Shadhili Path'), 'prompt', { prompt: 'Teach the Shadhili path: remembrance in the world, trust in God, adab, litanies, and sobriety amidst daily life.', mode: 'tariqa' })],
      [action('lineage-compare', L('⚖️ Compare lineages'), 'prompt', { prompt: 'Compare the Qadiri, Naqshbandi, Chishti, Mevlevi, and Shadhili lineages in tone, practices, symbolism, and emphasis.', mode: 'school_compare' })],
      back('sufi:root'),
    ]},
  'sufi:maqam': { title: L('⛰ Stations & States'), buttons: [
      [action('tawba', L('🌱 Tawba · Turning'), 'prompt', { prompt: 'Explain tawba in Sufism as turning, return, repentance, and reorientation of the heart.', mode: 'maqam' })],
      [action('sabr', L('⛰ Sabr & Tawakkul'), 'prompt', { prompt: 'Explain sabr and tawakkul in Sufi practice: patience, trust, surrender, and their practical expression.', mode: 'maqam' })],
      [action('love', L('❤️ Love & Gnosis'), 'prompt', { prompt: 'Explain mahabba and marifa in Sufism: divine love, knowing by tasting, and the transformation of perception.', mode: 'maqam' })],
      [action('fana', L('🔥 Fana & Baqa'), 'prompt', { prompt: 'Explain fana and baqa in classical Sufism carefully, distinguishing them from loose modern talk about ego death.', mode: 'maqam' })],
      [action('sobriety', L('🌗 Sobriety & Ecstasy'), 'prompt', { prompt: 'Compare sober and ecstatic currents in Sufism: Junayd, Bistami, Hallaj, wajd, sukr, and sahw.', mode: 'school_compare' })],
      [action('stations-vs-states', L('⚖️ Stations vs States'), 'prompt', { prompt: 'Explain the distinction between maqamat and ahwal in Sufism and why it matters for practice.', mode: 'maqam' })],
      back('sufi:root'),
    ]},
  'sufi:practice': { title: L('📿 Practices & Adab'), buttons: [
      [action('dhikr', L('📿 Dhikr'), 'prompt', { prompt: 'Teach dhikr in Sufism: remembrance, silent and vocal forms, intention, breath, adab, and transformation of the heart. Do not provide secret formulas or claim initiation.', mode: 'dhikr' })],
      [action('muraqaba', L('👁 Muraqaba'), 'prompt', { prompt: 'Teach muraqaba as watchfulness, contemplative presence, and inward witnessing in the Sufi path.', mode: 'dhikr' })],
      [action('sohbet', L('🫶 Sohbet / Suhba'), 'prompt', { prompt: 'Teach sohbet or suhba in Sufism: companionship, transmission, presence with a teacher, and refinement through company.', mode: 'adab' })],
      [action('khalwa', L('🕯 Khalwa / Retreat'), 'prompt', { prompt: 'Teach khalwa in Sufism: retreat, silence, discipline, risks of isolation, and the need for guidance and adab.', mode: 'adab' })],
      [action('sama', L('🎵 Sama / Listening'), 'prompt', { prompt: 'Teach sama in Sufi traditions: music, audition, ecstasy, discipline, and the conditions under which it is understood.', mode: 'dhikr' })],
      [action('service', L('🍞 Service & Courtesy'), 'prompt', { prompt: 'Teach khidma and adab in Sufism: service, humility, courtesy, restraint, and polishing the ego through action.', mode: 'adab' })],
      back('sufi:root'),
    ]},
  'sufi:poetry': { title: L('🌹 Poetry & Symbols'), buttons: [
      [action('rumi', L('🌹 Rumi'), 'prompt', { prompt: 'Teach the central themes of Rumi in a Sufi frame: longing, annihilation in love, listening, bewilderment, and union without flattening theology.', mode: 'poetry' })],
      [action('attar', L('🕊 Attar'), 'prompt', { prompt: 'Teach Attar’s Sufi symbolism through The Conference of the Birds: quest, stations, annihilation, kingship, and the mirror of the Simurgh.', mode: 'poetry' })],
      [action('rabia', L('🔥 Rabia'), 'prompt', { prompt: 'Teach Rabia al-Adawiyya’s Sufi vision of love, sincerity, and worship beyond fear and reward.', mode: 'saint' })],
      [action('wine', L('🍷 Wine & Beloved'), 'prompt', { prompt: 'Explain classical Sufi symbolism of wine, intoxication, tavern, cupbearer, and the Beloved without reducing everything to literalism.', mode: 'poetry' })],
      [action('reed', L('🎋 Reed flute & moth'), 'prompt', { prompt: 'Explain the Sufi symbolism of the reed flute, the moth and candle, fire, absence, and yearning.', mode: 'poetry' })],
      [action('symbols-compare', L('⚖️ Compare symbols'), 'prompt', { prompt: 'Compare major Sufi poetic symbols: wine, Beloved, reed, moth, mirror, desert, ocean, and night.', mode: 'school_compare' })],
      back('sufi:root'),
    ]},
  'sufi:masters': { title: L('🧙 Masters'), buttons: [
      [action('junayd', L('🧭 Junayd'), 'prompt', { prompt: 'Teach Junayd of Baghdad: sobriety, disciplined Sufism, annihilation with return, and why he matters.', mode: 'saint' })],
      [action('hallaj', L('⚡ Hallaj'), 'prompt', { prompt: 'Teach al-Hallaj carefully: ecstatic utterance, martyrdom, love, danger, and the meanings attached to “Ana al-Haqq”.', mode: 'saint' })],
      [action('ghazali', L('📚 al-Ghazali'), 'prompt', { prompt: 'Teach al-Ghazali’s integration of law, theology, ethics, and Sufi purification.', mode: 'saint' })],
      [action('ibn-arabi', L('🌌 Ibn Arabi'), 'prompt', { prompt: 'Teach Ibn Arabi’s key Sufi themes: imagination, unity, the perfect human, mercy, and the divine names.', mode: 'metaphysics' })],
      [action('bistami', L('🕯 Bistami'), 'prompt', { prompt: 'Teach Bayazid Bistami: ecstatic language, self-effacement, sobriety versus intoxication, and the shock of utterance.', mode: 'saint' })],
      [action('masters-compare', L('⚖️ Compare masters'), 'prompt', { prompt: 'Compare Junayd, Hallaj, al-Ghazali, Ibn Arabi, Rabia, and Bistami in tone, method, and doctrine.', mode: 'school_compare' })],
      back('sufi:root'),
    ]},
  'sufi:meta': { title: L('🌌 Metaphysics'), buttons: [
      [action('nafs', L('🫀 Nafs · Qalb · Ruh'), 'prompt', { prompt: 'Explain the layered inner anthropology of Sufism: nafs, qalb, ruh, sirr, and how purification changes perception.', mode: 'metaphysics' })],
      [action('wahdat', L('🌊 Unity & Multiplicity'), 'prompt', { prompt: 'Explain wahdat al-wujud and related debates in a careful Sufi frame, including how unity and multiplicity are held together.', mode: 'metaphysics' })],
      [action('imaginal', L('🪞 Imaginal world'), 'prompt', { prompt: 'Teach the imaginal realm in Sufi metaphysics: barzakh, symbolic vision, dream, and the world of forms between worlds.', mode: 'metaphysics' })],
      [action('insan', L('👤 Perfect Human'), 'prompt', { prompt: 'Explain al-insan al-kamil in Sufism and why the perfect human is a mirror rather than a superhero ideal.', mode: 'metaphysics' })],
      [action('names', L('✨ Divine Names'), 'prompt', { prompt: 'Teach the role of the divine names in Sufism: invocation, character refinement, mercy, majesty, beauty, and balance.', mode: 'metaphysics' })],
      [action('metaphysics-compare', L('⚖️ Compare metaphysics'), 'prompt', { prompt: 'Compare Junaydian sobriety, Ghazalian ethics, Ibn Arabi’s metaphysics, and poetic-symbolic Sufi discourse.', mode: 'school_compare' })],
      back('sufi:root'),
    ]},
  'sufi:heart': { title: L('🪞 Heart Mirror'), buttons: [
      [action('dreams', L('🌙 Dreams & symbols'), 'prompt', { prompt: 'Teach dreams in a Sufi frame: discernment, symbolic reading, humility, and why not every dream is revelation.', mode: 'dreamwork' })],
      [action('muhasaba', L('🧾 Muhasaba'), 'prompt', { prompt: 'Teach muhasaba in Sufism: self-accounting, inward honesty, repentance, and the daily audit of the heart.', mode: 'adab' })],
      [action('longing', L('💧 Longing & absence'), 'prompt', { prompt: 'Explore longing, separation, intimacy, absence, and presence in the Sufi path without reducing them to sentimentality.', mode: 'poetry' })],
      [action('discernment', L('🧠 Discernment'), 'prompt', { prompt: 'Teach discernment in the inner life: how to distinguish sincerity from fantasy, inspiration from inflation.', mode: 'adab' })],
      [action('questions', L('❓ Heart questions'), 'prompt', { prompt: 'Give ten Sufi-style questions for self-accounting, humility, longing, service, and remembrance.', mode: 'adab' })],
      back('sufi:root'),
    ]},
  'sufi:history': { title: L('🏺 History & Ethics'), buttons: [
      [action('origins', L('🏺 Early Sufism'), 'prompt', { prompt: 'Teach the origins of Sufism: ascetic currents, Basra and Baghdad, early renunciants, love mystics, and formation of the path.', mode: 'historian' })],
      [action('orders', L('🗺 Tariqas through history'), 'prompt', { prompt: 'Teach how Sufi orders developed historically across the Arab, Persian, Anatolian, Central Asian, African, and Indian worlds.', mode: 'historian' })],
      [action('women', L('🪷 Women in Sufism'), 'prompt', { prompt: 'Teach the place of women in Sufism through figures such as Rabia and through the wider question of devotion, authority, and transmission.', mode: 'historian' })],
      [action('ethics', L('⚖️ Teacher, power, adab'), 'prompt', { prompt: 'Explore ethics in Sufi life: the teacher-disciple relationship, authority, obedience, abuse risk, sincerity, and discernment.', mode: 'adab' })],
      [action('modern', L('🌍 Sufism today'), 'prompt', { prompt: 'Teach the modern transmission of Sufism: adaptation, translation, universalism, lineage, dilution, and living practice.', mode: 'historian' })],
      [action('law', L('⚖️ Law, theology, mysticism'), 'prompt', { prompt: 'Compare how Sufism relates to theology, law, ethics, poetry, and contemplative practice without flattening the tradition.', mode: 'school_compare' })],
      back('sufi:root'),
    ]},
  'sufi:question': { title: L('🤔 Provoking Questions'), buttons: [
      [action('q1', L('What is the difference between longing for God and longing for intensity?'), 'prompt', { prompt: 'What is the difference between longing for God and longing for intensity?', mode: 'oracle' })],
      [action('q2', L('When does a spiritual state become vanity?'), 'prompt', { prompt: 'When does a spiritual state become vanity?', mode: 'oracle' })],
      [action('q3', L('Is remembrance something you do, or something that overtakes you?'), 'prompt', { prompt: 'Is remembrance something you do, or something that overtakes you?', mode: 'oracle' })],
      [action('q4', L('What in you resists surrender because it fears disappearance?'), 'prompt', { prompt: 'What in you resists surrender because it fears disappearance?', mode: 'oracle' })],
      [action('q5', L('When is silence truth, and when is it avoidance?'), 'prompt', { prompt: 'When is silence truth, and when is it avoidance?', mode: 'oracle' })],
      back('sufi:root'),
    ]},

  'dreamwalker:root': {
    title: L('🌌 Dreamwalker Menu', '🌌 Rüya Gezgini Menüsü', '🌌 Меню Путника Снов'),
    buttons: [
      [action('dw-lucid', L('🌙 Lucid Dreaming', '🌙 Bilinçli Rüya', '🌙 Осознанные сны'), 'submenu', { nextMenu: 'dreamwalker:lucid' }), action('dw-yoga', L('🕉 Dream Yoga', '🕉 Rüya Yogası', '🕉 Йога сна'), 'submenu', { nextMenu: 'dreamwalker:yoga' })],
      [action('dw-astral', L('✨ Astral Projection', '✨ Astral Projeksiyon', '✨ Астральная проекция'), 'submenu', { nextMenu: 'dreamwalker:astral' }), action('dw-remote', L('📡 Remote Viewing', '📡 Uzak Görüş', '📡 Дистанционное видение'), 'submenu', { nextMenu: 'dreamwalker:remote' })],
      [action('dw-interpret', L('🔮 Dream Interpretation', '🔮 Rüya Yorumlama', '🔮 Толкование снов'), 'submenu', { nextMenu: 'dreamwalker:interpret' }), action('dw-practice', L('🛏 Night Practice', '🛏 Gece Pratiği', '🛏 Ночная практика'), 'submenu', { nextMenu: 'dreamwalker:practice' })],
      [action('dw-question', L('🤔 Provoking Questions', '🤔 Kışkırtıcı Sorular', '🤔 Провокационные вопросы'), 'prompt', { prompt: 'Offer one precise dreamwork question that opens self-discovery without superstition.', mode: 'dreamwork' })],
      ...utilityRows,
    ],
  },
  'dreamwalker:lucid': {
    title: L('🌙 Lucid Dreaming', '🌙 Bilinçli Rüya', '🌙 Осознанные сны'),
    buttons: [
      [action('dw-reality', L('Reality checks', 'Gerçeklik kontrolleri', 'Проверки реальности'), 'prompt', { prompt: 'Teach reality checks, dream signs, and recall in lucid dreaming for a serious beginner.', mode: 'lucid' })],
      [action('dw-wbtb', L('WBTB / re-entry', 'WBTB / yeniden giriş', 'WBTB / повторный вход'), 'prompt', { prompt: 'Explain wake-back-to-bed and re-entry methods safely and practically.', mode: 'lucid' })],
      [action('dw-stability', L('Stabilising the dream', 'Rüyayı sabitlemek', 'Стабилизация сна'), 'prompt', { prompt: 'Explain how to stabilise lucidity without forcing the dream or waking up immediately.', mode: 'lucid' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:yoga': {
    title: L('🕉 Dream Yoga', '🕉 Rüya Yogası', '🕉 Йога сна'),
    buttons: [
      [action('dw-view', L('View and purpose', 'Bakış ve amaç', 'Взгляд и цель'), 'prompt', { prompt: 'Explain dream yoga as a spiritual discipline rather than a thrill-seeking lucid dream technique.', mode: 'dream_yoga' })],
      [action('dw-sleep', L('Sleep awareness', 'Uyku farkındalığı', 'Осознанность во сне'), 'prompt', { prompt: 'Teach the continuity of awareness through sleep and dream in dream yoga, carefully and accessibly.', mode: 'dream_yoga' })],
      [action('dw-compare', L('Compare traditions', 'Gelenekleri karşılaştır', 'Сравнить традиции'), 'prompt', { prompt: 'Compare dream yoga, lucid dreaming, and contemplative night practice without collapsing them into one thing.', mode: 'school_compare' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:astral': {
    title: L('✨ Astral Projection', '✨ Astral Projeksiyon', '✨ Астральная проекция'),
    buttons: [
      [action('dw-exit', L('Exit sensations', 'Çıkış hisleri', 'Ощущения выхода'), 'prompt', { prompt: 'Explain the reported exit sensations around astral projection and how to interpret them cautiously.', mode: 'astral' })],
      [action('dw-safety', L('Safety and grounding', 'Güvenlik ve topraklanma', 'Безопасность и заземление'), 'prompt', { prompt: 'Give grounded safety and emotional stabilisation guidance for astral projection experimentation.', mode: 'astral' })],
      [action('dw-vs-lucid', L('Astral vs lucid', 'Astral ve bilinçli rüya', 'Астрал и осознанный сон'), 'prompt', { prompt: 'Compare astral projection and lucid dreaming as experiences, practices, and interpretations.', mode: 'school_compare' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:remote': {
    title: L('📡 Remote Viewing', '📡 Uzak Görüş', '📡 Дистанционное видение'),
    buttons: [
      [action('dw-ideogram', L('Basic protocol', 'Temel protokol', 'Базовый протокол'), 'prompt', { prompt: 'Explain remote viewing at a high level: protocol, signal line, noise, and disciplined perception.', mode: 'remote_viewing' })],
      [action('dw-ethics', L('Ethics and limits', 'Etik ve sınırlar', 'Этика и пределы'), 'prompt', { prompt: 'Explain the ethics, limits, and pitfalls of remote viewing claims and practice.', mode: 'remote_viewing' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:interpret': {
    title: L('🔮 Dream Interpretation', '🔮 Rüya Yorumlama', '🔮 Толкование снов'),
    buttons: [
      [action('dw-symbol', L('Symbols and patterns', 'Semboller ve kalıplar', 'Символы и паттерны'), 'prompt', { prompt: 'Teach dream interpretation through patterns, emotional charge, symbols, and context rather than simplistic one-to-one dictionaries.', mode: 'interpretation' })],
      [action('dw-nightmare', L('Nightmares', 'Kâbuslar', 'Кошмары'), 'prompt', { prompt: 'Explain how to work with nightmares as messages, stress expressions, or shadow material without superstition.', mode: 'interpretation' })],
      [action('dw-recurring', L('Recurring dreams', 'Tekrarlayan rüyalar', 'Повторяющиеся сны'), 'prompt', { prompt: 'Explain recurring dreams and how to investigate them psychologically and symbolically.', mode: 'interpretation' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:practice': {
    title: L('🛏 Night Practice', '🛏 Gece Pratiği', '🛏 Ночная практика'),
    buttons: [
      [action('dw-journal', L('Dream journal', 'Rüya günlüğü', 'Дневник снов'), 'prompt', { prompt: 'Give a clear dream journal practice that improves recall, lucidity, and interpretation.', mode: 'sleep_practice' })],
      [action('dw-ritual', L('Before-sleep ritual', 'Uyku öncesi ritüel', 'Ритуал перед сном'), 'prompt', { prompt: 'Design a simple before-sleep contemplative ritual for lucid dreaming and dreamwork.', mode: 'sleep_practice' })],
      [action('dw-body', L('Body / sleep hygiene', 'Beden / uyku hijyeni', 'Тело / гигиена сна'), 'prompt', { prompt: 'Explain body regulation, sleep hygiene, and nervous-system stability for dream practices.', mode: 'sleep_practice' })],
      back('dreamwalker:root'),
    ],
  },
}

export function getMenuScreen(pack: OraclePack, menuKey?: string, _currentCard?: string | null): MenuScreen {
  const key = menuKey && MENUS[menuKey] ? menuKey : `${pack}:root`
  return MENUS[key] ?? MENUS[`${pack}:root`]
}
