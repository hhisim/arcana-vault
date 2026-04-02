
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
]

export const TAROT_ALL_CARDS = [
  '0 · The Fool','I · The Magician','II · The High Priestess','III · The Empress','IV · The Emperor','V · The Hierophant',
  'VI · The Lovers','VII · The Chariot','VIII · Strength','IX · The Hermit','X · Wheel of Fortune','XI · Justice',
  'XII · The Hanged Man','XIII · Death','XIV · Temperance','XV · The Devil','XVI · The Tower','XVII · The Star',
  'XVIII · The Moon','XIX · The Sun','XX · Judgement','XXI · The World'
]

function tarotCardRows() {
  const rows: MenuAction[][] = []
  for (let i=0;i<TAROT_ALL_CARDS.length;i+=2) {
    const slice = TAROT_ALL_CARDS.slice(i,i+2)
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
      [action('tarot-daily', L('🃏 Daily Card', '🃏 Günlük Kart', '🃏 Карта дня'), 'prompt', { prompt: 'Draw a daily card and give a clear reading with symbolism, shadow, and practical guidance.', mode: 'reading' }), action('tarot-spreads', L('🔮 Readings', '🔮 Okumalar', '🔮 Расклады'), 'submenu', { nextMenu: 'tarot:spreads' })],
      [action('tarot-study', L('📚 Deep Study', '📚 Derin Çalışma', '📚 Глубокое изучение'), 'submenu', { nextMenu: 'tarot:study' }), action('tarot-shadow-menu', L('🌑 Shadow Work', '🌑 Gölge Çalışması', '🌑 Теневая работа'), 'submenu', { nextMenu: 'tarot:shadow' })],
      [action('tarot-browse', L('✨ Browse the Arcana', '✨ Arkana Tarama', '✨ Просмотр Арканов'), 'submenu', { nextMenu: 'tarot:browse' }), action('tarot-learn', L('🎓 Learning Paths', '🎓 Öğrenme Yolları', '🎓 Пути обучения'), 'submenu', { nextMenu: 'tarot:learn' })],
      [action('tarot-compare', L('⚖️ Deck Compare', '⚖️ Deste Karşılaştır', '⚖️ Сравнить колоды'), 'prompt', { prompt: 'Compare Marseille, Rider-Waite-Smith, and Thoth on the Fool. Show what each tradition uniquely reveals.', mode: 'deck_compare' }), action('tarot-qabalah', L('🔯 Qabalah', '🔯 Kabala', '🔯 Каббала'), 'prompt', { prompt: 'Explain the Qabalistic significance of The Fool: Hebrew letter, path, Sephiroth bridge, and astrological ruler.', mode: 'qabalah' })],
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

  'tarot:spreads': {
    title: L('🔮 Readings', '🔮 Okumalar', '🔮 Расклады'),
    buttons: [
      [action('spread-single', L('🃏 Single Card', '🃏 Tek Kart', '🃏 Одна карта'), 'prompt', { prompt: 'Do a single-card reading for the present moment.', mode: 'reading' }), action('spread-three', L('🔮 Past · Present · Future', '🔮 Geçmiş · Şimdi · Gelecek', '🔮 Прошлое · Настоящее · Будущее'), 'prompt', { prompt: 'Do a three-card Past/Present/Future Tarot reading.', mode: 'reading' })],
      [action('spread-shadow', L('🌗 Shadow & Light', '🌗 Gölge ve Işık', '🌗 Тень и Свет'), 'prompt', { prompt: 'Do a Shadow and Light Tarot reading with integration guidance.', mode: 'shadow' }), action('spread-crossroads', L('⚔️ Crossroads', '⚔️ Yol Ayrımı', '⚔️ Перекрёсток'), 'prompt', { prompt: 'Do a four-position crossroads Tarot reading: situation, challenge, hidden factor, advice.', mode: 'reading' })],
      [action('spread-horseshoe', L('🌙 Horseshoe', '🌙 Nal', '🌙 Подкова'), 'prompt', { prompt: 'Do a five-card horseshoe reading: past, present, hidden factor, advice, outcome.', mode: 'reading' }), action('spread-celtic', L('✡️ Celtic Cross', '✡️ Kelt Haçı', '✡️ Кельтский Крест'), 'prompt', { prompt: 'Do a full Celtic Cross reading with position-by-position synthesis.', mode: 'reading' })],
      back('tarot:root'),
    ],
  },
  'tarot:shadow': {
    title: L('🌑 Shadow Work', '🌑 Gölge Çalışması', '🌑 Теневая работа'),
    buttons: [
      [action('shadow-random', L('🎲 Random Shadow Card', '🎲 Rastgele Gölge Kartı', '🎲 Случайная карта тени'), 'prompt', { prompt: 'Pick a strong shadow-work Tarot card and do a full shadow session with the hidden question, the wound, and the path of integration.', mode: 'shadow' })],
      [action('shadow-devil', L('XV · The Devil', 'XV · Şeytan', 'XV · Дьявол'), 'prompt', { prompt: 'Do a shadow work session for The Devil.', mode: 'shadow' }), action('shadow-tower', L('XVI · The Tower', 'XVI · Kule', 'XVI · Башня'), 'prompt', { prompt: 'Do a shadow work session for The Tower.', mode: 'shadow' })],
      [action('shadow-moon', L('XVIII · The Moon', 'XVIII · Ay', 'XVIII · Луна'), 'prompt', { prompt: 'Do a shadow work session for The Moon.', mode: 'shadow' }), action('shadow-nine', L('Nine of Swords', 'Kılıç Dokuzlusu', 'Девятка Мечей'), 'prompt', { prompt: 'Do a shadow work session for Nine of Swords.', mode: 'shadow' })],
      back('tarot:root'),
    ],
  },
  'tarot:learn': {
    title: L('🎓 Learning Paths', '🎓 Öğrenme Yolları', '🎓 Пути обучения'),
    buttons: [
      [action('learn-beginner', L('🌱 Absolute Beginner', '🌱 Tam Başlangıç', '🌱 Абсолютный новичок'), 'prompt', { prompt: 'Give the Absolute Beginner Tarot study path as a guided curriculum with steps, sources, and practice suggestions.', mode: 'teacher' }), action('learn-intermediate', L('🔥 Intermediate Practitioner', '🔥 Orta Düzey Uygulayıcı', '🔥 Средний практик'), 'prompt', { prompt: 'Give the Intermediate Practitioner Tarot path with deeper readings, reversals, court cards, and spread mastery.', mode: 'teacher' })],
      [action('learn-esoteric', L('⚗️ Esoteric & Initiatic', '⚗️ Ezoterik ve İnisiyatik', '⚗️ Эзотерический и инициационный'), 'prompt', { prompt: 'Give the Esoteric & Initiatic Tarot study path: Golden Dawn, Case, Wang, Thoth, astrology, and Qabalah.', mode: 'teacher' }), action('learn-shadow', L('🌑 Shadow & Psychology', '🌑 Gölge ve Psikoloji', '🌑 Тень и психология'), 'prompt', { prompt: 'Give the Shadow & Psychology Tarot learning path with Greer, Jette, journaling, and constellation work.', mode: 'teacher' })],
      [action('learn-magical', L('🔮 Magical & Ritual Arts', '🔮 Büyüsel ve Ritüel Sanatlar', '🔮 Магические и ритуальные искусства'), 'prompt', { prompt: 'Give the Magical & Ritual Arts Tarot path with Tyson, Ciceros, Knight, De Biasi, and Levi.', mode: 'teacher' }), action('learn-history', L('📜 Historical Research', '📜 Tarihsel Araştırma', '📜 Исторические исследования'), 'prompt', { prompt: 'Give the Historical Research Tarot path from Visconti-Sforza to modern schools.', mode: 'historian' })],
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
      [action('tantra-mantra', L('📿 Mantra'), 'prompt', { prompt: 'Teach mantra in Tantra: sound, subtle body, attention, devotion, and safe practice.', mode: 'teacher' }), action('tantra-subtle', L('🧬 Subtle Body'), 'prompt', { prompt: 'Teach the subtle body in tantra: nadis, bindu, prana, chakras, and safe interpretation.', mode: 'teacher' })],
      [action('tantra-osho', L('📖 Osho / Book of Secrets'), 'prompt', { prompt: 'Explain how Osho frames the 112 dharanas in The Book of Secrets, and how to use that book wisely.', mode: 'teacher' }), action('tantra-kashmir', L('⚡ Kashmir Shaivism'), 'prompt', { prompt: 'Teach Kashmir Shaivism as a core philosophical and experiential frame for the dharanas.', mode: 'scholar' })],
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
      [action('rabia', L('🔥 Rabia'), 'prompt', { prompt: 'Teach Rabia al-Adawiyya\'s Sufi vision of love, sincerity, and worship beyond fear and reward.', mode: 'saint' })],
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
      [action('dw-lucid', L('🌙 Lucid Dreaming', '🌙 Bilinçli Rüya', '🌙 Осознанные сны'), 'submenu', { nextMenu: 'dreamwalker:lucid' }), action('dw-techniques', L('🛠 Techniques', '🛠 Teknikler', '🛠 Техники'), 'submenu', { nextMenu: 'dreamwalker:techniques' })],
      [action('dw-yoga', L('🕉 Dream Yoga', '🕉 Rüya Yogası', '🕉 Йога сна'), 'submenu', { nextMenu: 'dreamwalker:yoga' }), action('dw-astral', L('✨ Astral Projection', '✨ Astral Projeksiyon', '✨ Астральная проекция'), 'submenu', { nextMenu: 'dreamwalker:astral' })],
      [action('dw-remote', L('📡 Remote Viewing', '📡 Uzak Görüş', '📡 Дистанционное видение'), 'submenu', { nextMenu: 'dreamwalker:remote' }), action('dw-interpret', L('🔮 Dream Interpretation', '🔮 Rüya Yorumlama', '🔮 Толкование снов'), 'submenu', { nextMenu: 'dreamwalker:interpret' })],
      [action('dw-practice', L('🛏 Night Practice', '🛏 Gece Pratiği', '🛏 Ночная практика'), 'submenu', { nextMenu: 'dreamwalker:practice' }), action('dw-checklists', L('✅ Checklists', '✅ Kontrol Listeleri', '✅ Чеклисты'), 'submenu', { nextMenu: 'dreamwalker:checklists' })],
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
  'dreamwalker:techniques': {
    title: L('🛠 Techniques', '🛠 Teknikler', '🛠 Техники'),
    buttons: [
      [action('dw-monroe', L('🎧 Monroe / Phasing', '🎧 Monroe / Phasing', '🎧 Монро / Фазинг'), 'prompt', { prompt: 'Teach the Monroe/phasing approach to altered-state navigation and out-of-body work at a high level.', mode: 'astral' })],
      [action('dw-raduga', L('⚡ Raduga / The Phase', '⚡ Raduga / The Phase', '⚡ Радуга / Фаза'), 'prompt', { prompt: 'Teach Michael Raduga\'s phase approach to lucid and out-of-body work, including strengths and limits.', mode: 'lucid' })],
      [action('dw-bruce', L('🛡 Robert Bruce / Energy & Exit', '🛡 Robert Bruce / Enerji & Çıkış', '🛡 Роберт Брюс / Энергия и выход'), 'prompt', { prompt: 'Teach Robert Bruce\'s practical approach to exit sensations, energy work, and grounding.', mode: 'astral' })],
      [action('dw-laberge', L('📘 LaBerge / Scientific Lucidity', '📘 LaBerge / Bilimsel Lüsidite', '📘 Лаберж / Научная осознанность'), 'prompt', { prompt: 'Teach Stephen LaBerge\'s scientific lucid dreaming framework: MILD, WBTB, re-entry, and dream signs.', mode: 'lucid' })],
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
      [action('dw-integration', L('Morning integration', 'Sabah entegrasyonu', 'Утренняя интеграция'), 'prompt', { prompt: 'Teach a morning-after integration routine for intense dream, lucid, or astral-style experiences.', mode: 'sleep_practice' })],
      back('dreamwalker:root'),
    ],
  },
  'dreamwalker:checklists': {
    title: L('✅ Checklists', '✅ Kontrol Listeleri', '✅ Чеклисты'),
    buttons: [
      [action('dw-check-lucid', L('Lucid checklist', 'Lüsid kontrol listesi', 'Чеклист осознанного сна'), 'prompt', { prompt: 'Create a concise lucid dreaming checklist for tonight: pre-sleep, during the night, on lucidity, and on waking.', mode: 'checklist' })],
      [action('dw-check-astral', L('Astral checklist', 'Astral kontrol listesi', 'Астральный чеклист'), 'prompt', { prompt: 'Create a grounded astral projection checklist: preparation, threshold signs, safety, grounding, and post-session notes.', mode: 'checklist' })],
      [action('dw-check-dream', L('Dreamwork checklist', 'Rüya çalışması listesi', 'Чеклист работы со снами'), 'prompt', { prompt: 'Create a dreamwork checklist for recall, journaling, interpretation, and integration.', mode: 'checklist' })],
      [action('dw-check-rv', L('Remote viewing checklist', 'Uzak görüş listesi', 'Чеклист дистанционного видения'), 'prompt', { prompt: 'Create a disciplined beginner remote-viewing checklist: target protocol, mindset, session hygiene, and review.', mode: 'checklist' })],
      back('dreamwalker:root'),
    ],
  },

  // ── Kabbalah ──────────────────────────────────────────────────────────
  'kabbalah:root': {
    title: L('✡ The Kabbalist'),
    buttons: [
      [action('kab-daily', L('✡ Daily Wisdom', '✡ Günlük Bilgelik', '✡ Мудрость дня'), 'prompt', { prompt: 'Give a single piece of Kabbalistic wisdom for today, drawing from the Zohar, Sefer Yetzirah, or the Ari. Contemplative oracle prose.', mode: 'oracle' }), action('kab-tree', L('🌳 The Tree of Life', '🌳 Hayat Ağacı', '🌳 Древо Жизни'), 'submenu', { nextMenu: 'kabbalah:tree' })],
      [action('kab-zohar', L('📖 The Zohar', '📖 Zohar', '📖 Зоар'), 'submenu', { nextMenu: 'kabbalah:zohar' }), action('kab-study', L('📚 Deep Study', '📚 Derin Çalışma', '📚 Глубокое изучение'), 'submenu', { nextMenu: 'kabbalah:study' })],
      [action('kab-meditation', L('🧘 Meditation', '🧘 Meditasyon', '🧘 Медитация'), 'submenu', { nextMenu: 'kabbalah:meditation' }), action('kab-names', L('🔯 72 Names', '🔯 72İsim', '🔯 72 Имени'), 'submenu', { nextMenu: 'kabbalah:names' })],
      [action('kab-paths', L('🔤 22 Paths & Letters', '🔤 22 Yol ve Harf', '🔤 22 Пути и буквы'), 'submenu', { nextMenu: 'kabbalah:paths' }), action('kab-worlds', L('🌐 Four Worlds', '🌐 Dört Dünya', '🌐 Четыре мира'), 'prompt', { prompt: 'Teach the Four Worlds of Kabbalah — Atziluth, Beriah, Yetzirah, Assiah — and how they nest within each other. Include the divine name, archangelic presence, and angelic order of each world.', mode: 'teacher' })],
      [action('kab-lurianic', L('🌀 Lurianic System', '🌀 Lurianik Sistem', '🌀 Лурианская система'), 'submenu', { nextMenu: 'kabbalah:lurianic' }), action('kab-hermetic', L('⚗️ Hermetic Qabalah', '⚗️ Hermetik Kabala', '⚗️ Герметическая Каббала'), 'submenu', { nextMenu: 'kabbalah:hermetic' })],
      [action('kab-learn', L('🎓 Learning Paths', '🎓 Öğrenme Yolları', '🎓 Пути обучения'), 'submenu', { nextMenu: 'kabbalah:learn' }), action('kab-compare', L('⚖️ Compare Schools', '⚖️ Okulları Karşılaştır', '⚖️ Сравнить школы'), 'prompt', { prompt: 'Compare the major schools of Kabbalah: Classical Jewish Kabbalah (Zohar, Cordovero, Luria), Hasidic Kabbalah (Baal Shem Tov, Tanya), and Hermetic Qabalah (Golden Dawn, Crowley, B.O.T.A.) without collapsing them into one.', mode: 'school_compare' })],
      ...utilityRows,
    ],
  },

  'kabbalah:tree': {
    title: L('🌳 The Tree of Life', '🌳 Hayat Ağacı', '🌳 Древо Жизни'),
    buttons: [
      [action('tree-overview', L('🌳 Tree Overview', '🌳 Ağaç Genel Bakış', '🌳 Обзор Древа'), 'prompt', { prompt: 'Teach the Tree of Life as a complete map: the ten Sephiroth, three pillars, four worlds, and 22 connecting paths. How does this map describe the structure of consciousness, creation, and the human soul?', mode: 'teacher' })],
      [action('tree-keter', L('👑 Keter (Crown)'), 'prompt', { prompt: 'Teach Keter — the first Sephirah, the Crown, the Infinite Will. Its divine name, archangel, correspondences, and how to meditate upon it.', mode: 'sephirah' }), action('tree-chokmah', L('⚡ Chokmah (Wisdom)'), 'prompt', { prompt: 'Teach Chokmah — the second Sephirah, supernal Wisdom. The Yod, the first flash of revelation, the Father principle, and its correspondences.', mode: 'sephirah' })],
      [action('tree-binah', L('🌊 Binah (Understanding)'), 'prompt', { prompt: 'Teach Binah — the third Sephirah, the supernal Mother. The first Heh, the womb of form, Saturn, and the Great Sea.', mode: 'sephirah' }), action('tree-daat', L("Da'at (Abyss)"), 'prompt', { prompt: "Teach Da'at — the hidden Sephirah, the Abyss. Not one of the ten, yet the gateway to the supernal triad. Explain its role in both Lurianic and Hermetic systems.", mode: 'sephirah' })],
      [action('tree-chesed', L('💙 Chesed (Mercy)'), 'prompt', { prompt: 'Teach Chesed — the fourth Sephirah, Lovingkindness. Jupiter, the right hand of God, expansive grace, and its role in the moral triad.', mode: 'sephirah' }), action('tree-gevurah', L('🔴 Gevurah (Severity)'), 'prompt', { prompt: 'Teach Gevurah — the fifth Sephirah, Strength and Judgment. Mars, the left hand of God, contraction, boundaries, and sacred fire.', mode: 'sephirah' })],
      [action('tree-tiferet', L('☀️ Tiferet (Beauty)'), 'prompt', { prompt: 'Teach Tiferet — the sixth Sephirah, the Heart of the Tree. The Sun, the Son, the Vav, the reconciliation of Chesed and Gevurah.', mode: 'sephirah' }), action('tree-netzach', L('🌿 Netzach (Victory)'), 'prompt', { prompt: 'Teach Netzach — the seventh Sephirah, Eternity and Victory. Venus, desire, passion, the right leg, and the force of nature.', mode: 'sephirah' })],
      [action('tree-hod', L('🧡 Hod (Splendor)'), 'prompt', { prompt: 'Teach Hod — the eighth Sephirah, Splendor and Glory. Mercury, intellect, language, magic, and the architect of form.', mode: 'sephirah' }), action('tree-yesod', L('🌙 Yesod (Foundation)'), 'prompt', { prompt: 'Teach Yesod — the ninth Sephirah, the Foundation. The Moon, the astral plane, sexuality, dreams, the Tzaddik, and the channel between worlds.', mode: 'sephirah' })],
      [action('tree-malkuth', L('🌍 Malkuth (Kingdom)'), 'prompt', { prompt: 'Teach Malkuth — the tenth Sephirah, the Kingdom. Earth, the Shekhinah, the bride, embodied reality, and the gateway to ascent.', mode: 'sephirah' })],
      [action('tree-pillars', L('⚡ Three Pillars', '⚡ Üç Sütun', '⚡ Три столпа'), 'prompt', { prompt: 'Teach the three pillars of the Tree of Life: the Pillar of Mercy (right), the Pillar of Severity (left), and the Middle Pillar. How do they balance and what do they represent in the human body and psyche?', mode: 'teacher' })],
      back('kabbalah:root'),
    ],
  },

  'kabbalah:zohar': {
    title: L('📖 The Zohar', '📖 Zohar', '📖 Зоар'),
    buttons: [
      [action('zohar-intro', L('📖 What is the Zohar?'), 'prompt', { prompt: 'What is the Zohar? Explain its authorship debate (Rabbi Shimon bar Yochai vs Moses de Leon), its structure, its literary form, and why it is considered the central text of Kabbalah.', mode: 'zohar' })],
      [action('zohar-bereshit', L('🌅 Bereshit (Genesis)'), 'prompt', { prompt: "Teach the Zohar's commentary on Bereshit — the opening of Genesis. How does the Zohar reinterpret creation as a process of divine emanation rather than material fabrication?", mode: 'zohar' }), action('zohar-sifra', L('📜 Sifra Detzniyutha'), 'prompt', { prompt: 'Teach the Sifra Detzniyutha — the Book of Concealed Mystery. What does it reveal about the hidden structure of the Godhead and the unmanifest aspects of the divine?', mode: 'zohar' })],
      [action('zohar-idra', L('⚡ Idra Rabba & Zuta'), 'prompt', { prompt: 'Teach the Idra Rabba (Greater Assembly) and Idra Zuta (Lesser Assembly) of the Zohar. What happened at these mystical gatherings and what was revealed about the divine face (Partzufim)?', mode: 'zohar' }), action('zohar-raya', L('🐑 Raya Mehemna'), 'prompt', { prompt: 'Teach the Raya Mehemna — the Faithful Shepherd section of the Zohar. How does Moses appear as a guide to Rabbi Shimon, and what does this layer reveal about Torah and commandments?', mode: 'zohar' })],
      [action('zohar-shimon', L('👤 Rabbi Shimon bar Yochai'), 'prompt', { prompt: 'Tell the story of Rabbi Shimon bar Yochai — the cave, the companions (Chevraya), and how the Zohar tradition portrays his mystical experience and death (Idra Zuta).', mode: 'zohar' }), action('zohar-shekhinah', L('🕊️ The Shekhinah'), 'prompt', { prompt: 'Teach the Shekhinah in the Zohar — the feminine presence of God in exile. Her relationship to Tiferet, the lover-beloved dynamic, and the cosmic drama of divine reunion.', mode: 'zohar' })],
      [action('zohar-reading', L('📚 How to Read the Zohar'), 'prompt', { prompt: 'Give practical guidance on reading the Zohar as a contemplative practice. Which editions to use (Soncino, Pritzker, Matt), how to approach its narrative style, and how to let the text work on the reader.', mode: 'teacher' })],
      back('kabbalah:root'),
    ],
  },

  'kabbalah:study': {
    title: L('📚 Deep Study', '📚 Derin Çalışma', '📚 Глубокое изучение'),
    buttons: [
      [action('study-yetzirah', L('🔤 Sefer Yetzirah'), 'prompt', { prompt: 'Teach the Sefer Yetzirah — the Book of Formation. The 10 Sefirot of Nothingness, the 22 foundation letters, the 231 gates. Use Kaplan ed. as primary reference.', mode: 'yetzirah' }), action('study-bahir', L('✨ Sefer HaBahir'), 'prompt', { prompt: 'Teach the Sefer HaBahir — the Book of Brilliance. The earliest Kabbalistic text, its parables, its introduction of the Sephiroth concept.', mode: 'scholar' })],
      [action('study-etz-chaim', L('🌳 Etz Chaim (Ari)'), 'prompt', { prompt: "Teach the Etz Chaim — the Tree of Life by Chaim Vital, recording the Ari's (Isaac Luria's) Kabbalistic system. Tzimtzum, Shevirat HaKelim, and Tikkun.", mode: 'lurianic' }), action('study-tanya', L('📕 Tanya (Chabad)'), 'prompt', { prompt: 'Teach the Tanya by Rabbi Schneur Zalman of Liadi — the foundational text of Chabad Hasidism. The two souls, the five levels, the Beinoni.', mode: 'scholar' })],
      [action('study-cordovero', L('🌹 Pardes Rimonim'), 'prompt', { prompt: "Teach Moshe Cordovero's Pardes Rimonim — the Garden of Pomegranates. How Cordovero systematized Kabbalah before Luria.", mode: 'scholar' }), action('study-abulafia', L('🌀 Abulafia Ecstasy'), 'prompt', { prompt: "Teach Abraham Abulafia's ecstatic Kabbalah — his methods of letter permutation, breathing techniques, and prophetic experience.", mode: 'scholar' })],
      [action('study-gematria', L('🔢 Gematria'), 'prompt', { prompt: 'Teach the art of gematria — the numerical values of Hebrew letters and how they reveal hidden connections in Torah. Include standard gematria, notarikon, temurah, and at-bash.', mode: 'gematria' }), action('study-scholem', L('🏛️ Gershom Scholem'), 'prompt', { prompt: 'Teach Gershom Scholems contribution to Kabbalah studies — Major Trends in Jewish Mysticism, his periodization, and his thesis about Gnosticism and early Kabbalah.', mode: 'historian' })],
      back('kabbalah:root'),
    ],
  },

  'kabbalah:meditation': {
    title: L('🧘 Kabbalistic Meditation', '🧘 Kabalistik Meditasyon', '🧘 Каббалистическая медитация'),
    buttons: [
      [action('med-hitbodedut', L('🕯️ Hitbodedut'), 'prompt', { prompt: 'Teach hitbodedut — contemplative isolation as practiced in the Kabbalistic tradition. How to enter solitude, how to speak to the divine, and how this differs from Eastern meditation.', mode: 'meditation' })],
      [action('med-letters', L('🔤 Letter Meditation'), 'prompt', { prompt: 'Teach Kabbalistic letter meditation — how to visualize, combine, and permute Hebrew letters as a path to altered states. The method of Abulafia.', mode: 'meditation' }), action('med-pillar', L('⚡ Middle Pillar'), 'prompt', { prompt: 'Guide a Middle Pillar meditation — the Western magical adaptation. Vibrate the divine names at each Sephirah from Keter to Malkuth, circulating light through the body.', mode: 'pathwork' })],
      [action('med-sephirah', L('🌳 Sephirah Contemplation'), 'prompt', { prompt: 'Guide a contemplative meditation on a single Sephirah. Include the color, divine name, archangel, and quality to embody.', mode: 'meditation' }), action('med-shema', L('📿 Shema Meditation'), 'prompt', { prompt: 'Teach the Shema as a Kabbalistic meditation — not just a prayer but a unification practice. How the six words encode the union of the Sephiroth.', mode: 'meditation' })],
      [action('med-pathwork', L('🚶 Pathworking'), 'prompt', { prompt: 'Guide a pathworking meditation on the Tree of Life. Lead the seeker through the gateway, the landscape, and the encounter.', mode: 'pathwork' }), action('med-devekut', L('🔥 Devekut (Cleaving)'), 'prompt', { prompt: 'Teach devekut — the Kabbalistic and Hasidic practice of cleaving to God. How to cultivate constant awareness of the divine in every action, thought, and breath.', mode: 'meditation' })],
      back('kabbalah:root'),
    ],
  },

  'kabbalah:names': {
    title: L('🔯 The 72 Names of God', '🔯 Tanrının 72 İsmi', '🔯 72 Имени Бога'),
    buttons: [
      [action('names-intro', L('🔯 What Are the 72 Names?'), 'prompt', { prompt: 'Teach the 72 Names of God (Shem HaMephorash) — how they are derived from Exodus 14:19-21, how each three-letter combination functions as a vibrational key.', mode: 'names' })],
      [action('names-1-18', L('Names 1–18'), 'prompt', { prompt: 'Teach the first 18 of the 72 Names of God. For each: the three Hebrew letters, the angelic intelligence, the quality it governs, and how to meditate on it.', mode: 'names' }), action('names-19-36', L('Names 19–36'), 'prompt', { prompt: 'Teach Names 19-36 of the 72 Names of God. For each: the three Hebrew letters, the angelic intelligence, and the quality it governs.', mode: 'names' })],
      [action('names-37-54', L('Names 37–54'), 'prompt', { prompt: 'Teach Names 37-54 of the 72 Names of God. For each: the three Hebrew letters, the angelic intelligence, and the quality it governs.', mode: 'names' }), action('names-55-72', L('Names 55–72'), 'prompt', { prompt: 'Teach Names 55-72 of the 72 Names of God. For each: the three Hebrew letters, the angelic intelligence, and the quality it governs.', mode: 'names' })],
      [action('names-practice', L('🧘 72 Names Practice'), 'prompt', { prompt: 'Give a practical guide to working with the 72 Names: scanning, meditation, visualization, and how to select the right Name for your current situation.', mode: 'practical' })],
      back('kabbalah:root'),
    ],
  },

  'kabbalah:paths': {
    title: L('🔤 The 22 Paths & Hebrew Letters', '🔤 22 Yol ve İbrani Harfler', '🔤 22 Пути и еврейские буквы'),
    buttons: [
      [action('paths-overview', L('🔤 The 22 Paths Overview'), 'prompt', { prompt: 'Teach the 22 paths of the Tree of Life — how each Hebrew letter connects two Sephiroth, the classification into 3 mothers, 7 doubles, and 12 simples, and the correspondence to Tarot trumps.', mode: 'path' })],
      [action('paths-mothers', L('🌬️ 3 Mother Letters'), 'prompt', { prompt: 'Teach the three Mother Letters: Aleph (Air/Spirit), Mem (Water), Shin (Fire). Their cosmic role in the Sefer Yetzirah, their Tarot correspondences.', mode: 'path' }), action('paths-doubles', L('🔄 7 Double Letters'), 'prompt', { prompt: 'Teach the seven Double Letters: Beth, Gimel, Daleth, Kaph, Peh, Resh, Tav. Their planetary correspondences and dual nature.', mode: 'path' })],
      [action('paths-simples', L('✡️ 12 Simple Letters'), 'prompt', { prompt: 'Teach the twelve Simple Letters and their zodiacal correspondences. How do these paths connect the lower Sephiroth?', mode: 'path' }), action('paths-tarot', L('🎴 Paths & Tarot'), 'prompt', { prompt: 'Explain how the 22 Tarot Major Arcana map onto the 22 paths of the Tree of Life. Include the Golden Dawn attributions.', mode: 'path' })],
      [action('paths-231', L('🌀 231 Gates'), 'prompt', { prompt: 'Teach the 231 Gates of the Sefer Yetzirah — the permutations of the 22 Hebrew letters taken two at a time. What do these gates represent?', mode: 'yetzirah' })],
      back('kabbalah:root'),
    ],
  },

  'kabbalah:lurianic': {
    title: L('🌀 Lurianic Kabbalah', '🌀 Lurianik Kabala', '🌀 Лурианская Каббала'),
    buttons: [
      [action('luria-tzimtzum', L('🌑 Tzimtzum (Contraction)'), 'prompt', { prompt: 'Teach Tzimtzum — the Aris radical doctrine that God contracted to make room for creation. The Reshimu, the Kav, and why this idea transformed all of Kabbalah.', mode: 'lurianic' })],
      [action('luria-shevirah', L('💥 Shevirat HaKelim'), 'prompt', { prompt: 'Teach Shevirat HaKelim — the Breaking of the Vessels. Why did the vessels shatter? What are the Nitzotzot (sparks) and Klipot (shells)?', mode: 'lurianic' }), action('luria-tikkun', L('🔧 Tikkun (Repair)'), 'prompt', { prompt: 'Teach Tikkun — the cosmic repair. How do human actions gather the scattered sparks and rebuild the shattered vessels?', mode: 'lurianic' })],
      [action('luria-partzufim', L('👤 Partzufim (Faces)'), 'prompt', { prompt: 'Teach the five Partzufim of Lurianic Kabbalah: Atik Yomin, Arikh Anpin, Abba, Imma, and Zeir Anpin with Nukvah.', mode: 'lurianic' }), action('luria-gilgul', L('🔄 Gilgul (Reincarnation)'), 'prompt', { prompt: 'Teach Gilgul Neshamot — the Kabbalistic doctrine of reincarnation as taught by the Ari in Shaar HaGilgulim. How does tikkun carry across lifetimes?', mode: 'lurianic' })],
      [action('luria-ari', L('👤 The Ari (Isaac Luria)'), 'prompt', { prompt: 'Tell the story of Rabbi Isaac Luria (the Ari) — his life in Safed, his relationship with Chaim Vital, his teaching method.', mode: 'historian' }), action('luria-vital', L('📜 Chaim Vital'), 'prompt', { prompt: 'Tell the story of Chaim Vital — the Aris primary student who recorded the Lurianic system.', mode: 'historian' })],
      back('kabbalah:root'),
    ],
  },

  'kabbalah:hermetic': {
    title: L('⚗️ Hermetic Qabalah', '⚗️ Hermetik Kabala', '⚗️ Герметическая Каббала'),
    buttons: [
      [action('herm-gd', L('✡️ Golden Dawn'), 'prompt', { prompt: 'Teach how the Hermetic Order of the Golden Dawn adapted Jewish Kabbalah into a Western magical system. The grade structure mapped to the Tree, the four color scales.', mode: 'hermetic' })],
      [action('herm-777', L('📊 777 (Crowley)'), 'prompt', { prompt: "Teach Crowley's 777 — the master correspondence table that maps every symbol onto the Tree of Life. How to use it as a practical tool.", mode: 'hermetic' }), action('herm-bota', L('🎴 B.O.T.A. (Case)'), 'prompt', { prompt: 'Teach Paul Foster Case and B.O.T.A. — how Case integrated Qabalah with Tarot, color theory, and sound vibration into a complete Western mystery school curriculum.', mode: 'hermetic' })],
      [action('herm-fortune', L('📕 Dion Fortune'), 'prompt', { prompt: "Teach Dion Fortune's contribution through The Mystical Qabalah — the most accessible Western introduction to the Tree. Her emphasis on psychological realities and practical pathworking.", mode: 'hermetic' }), action('herm-qliphoth', L('🕸️ Qliphoth & Nightside'), 'prompt', { prompt: 'Teach the Qliphoth — the shadow side of the Tree of Life. The shells, the anti-Sephiroth, the tunnels of Set. Handle with care.', mode: 'qliphoth' })],
      [action('herm-ritual', L('🕯️ Ritual Qabalah'), 'prompt', { prompt: 'Teach the practical ritual applications: the Lesser Banishing Ritual of the Pentagram, the Middle Pillar, the Qabalistic Cross.', mode: 'practical' }), action('herm-knight', L('📚 Gareth Knight'), 'prompt', { prompt: "Teach Gareth Knight's Practical Guide to Qabalistic Symbolism — how the two-volume system maps every symbol to the Sephiroth and paths.", mode: 'hermetic' })],
      back('kabbalah:root'),
    ],
  },

  'kabbalah:learn': {
    title: L('🎓 Learning Paths', '🎓 Öğrenme Yolları', '🎓 Пути обучения'),
    buttons: [
      [action('learn-kab-begin', L('🌱 Foundation Path', '🌱 Temel Yol', '🌱 Основы'), 'prompt', { prompt: 'Give the Foundation learning path for Kabbalah: start with Dion Fortune or Halevi, learn the Tree, the Four Worlds, and the Hebrew letters. Step by step with book recommendations.', mode: 'teacher' }), action('learn-kab-inter', L('🔥 Practitioner Path', '🔥 Uygulayıcı Yolu', '🔥 Путь практика'), 'prompt', { prompt: 'Give the Practitioner learning path: Zohar study, Lurianic Kabbalah, Kabbalistic meditation (Kaplan), gematria, and the kavvanot. Step by step with sources and practice.', mode: 'teacher' })],
      [action('learn-kab-herm', L('⚗️ Hermetic Path', '⚗️ Hermetik Yol', '⚗️ Герметический путь'), 'prompt', { prompt: 'Give the Hermetic Qabalah learning path: Golden Dawn (Regardie), 777 (Crowley), B.O.T.A. (Case), pathworking, and practical ritual. Step by step.', mode: 'teacher' }), action('learn-kab-acad', L('🏛️ Academic Path', '🏛️ Akademik Yol', '🏛️ Академический путь'), 'prompt', { prompt: 'Give the Academic Kabbalah studies path: Scholem, Idel, Wolfson, Dan, Matt, Fishbane. Major Trends, Kabbalah: New Perspectives, and critical scholarship.', mode: 'teacher' })],
      [action('learn-kab-hasid', L('🕎 Hasidic Path', '🕎 Hasidik Yol', '🕎 Хасидский путь'), 'prompt', { prompt: 'Give the Hasidic Kabbalah path: from the Baal Shem Tov through the Tanya to contemporary Chabad and Breslov practice. Focus on devekut, hitbodedut, joy, and the democratization of mystical experience.', mode: 'teacher' }), action('learn-kab-prac', L('🔮 Practical Magic Path', '🔮 Pratik Büyü Yolu', '🔮 Путь практической магии'), 'prompt', { prompt: 'Give the Practical Kabbalistic Magic path: from Bardons Key to the True Quabbalah through Ambelains Practical Kabbalah to the Shem operations and angel magic.', mode: 'teacher' })],
      back('kabbalah:root'),
    ],
  },

  // ── Chaos Magick ─────────────────────────────────────────────────────────
  'chaos-magick:root': {
    title: L('✴ The Paradigm Hacker'),
    buttons: [
      [action('chaos-daily', L('✴ Daily Hack', '✴ Günlük Hack', '✴ Хак дня'), 'prompt', { prompt: 'Give a single piece of pragmatic chaos magick wisdom for today. Short, sharp, operational. Channel Spare\'s directness.', mode: 'oracle' }), action('chaos-sigils', L('🔮 Sigil Workshop', '🔮 Sigil Atölyesi', '🔮 Сигильная мастерская'), 'submenu', { nextMenu: 'chaos-magick:sigils' })],
      [action('chaos-spare', L('🖤 Austin Osman Spare', '🖤 Austin Osman Spare', '🖤 Остин Осман Спэйр'), 'submenu', { nextMenu: 'chaos-magick:spare' }), action('chaos-servitors', L('👁 Servitors & Entities', '👁 Servitörler', '👁 Сервиторы'), 'submenu', { nextMenu: 'chaos-magick:servitors' })],
      [action('chaos-gnosis', L('⚡ Gnosis States', '⚡ Gnosis Durumları', '⚡ Состояния гнозиса'), 'submenu', { nextMenu: 'chaos-magick:gnosis' }), action('chaos-lhp', L('🔥 Left Hand Path', '🔥 Sol El Yolu', '🔥 Путь Левой Руки'), 'submenu', { nextMenu: 'chaos-magick:lhp' })],
      [action('chaos-practical', L('🛠️ Practical Sorcery', '🛠️ Pratik Büyü', '🛠️ Практическая магия'), 'submenu', { nextMenu: 'chaos-magick:practical' }), action('chaos-paradigm', L('🔄 Paradigm Shifting', '🔄 Paradigma Kaydırma', '🔄 Сдвиг парадигмы'), 'submenu', { nextMenu: 'chaos-magick:paradigm' })],
      [action('chaos-learn', L('🎓 Learning Paths', '🎓 Öğrenme Yolları', '🎓 Пути обучения'), 'submenu', { nextMenu: 'chaos-magick:learn' }), action('chaos-compare', L('⚖️ Compare Currents', '⚖️ Akımları Karşılaştır', '⚖️ Сравнить течения'), 'prompt', { prompt: 'Compare the major currents within and around chaos magick: Spare\'s art-magic, Carroll\'s IOT, Ford\'s Luciferianism, Morrison\'s pop-magic, and Crowley\'s Thelema as precursor. What each uniquely contributes and where they diverge.', mode: 'school_compare' })],
      ...utilityRows,
    ],
  },

  'chaos-magick:sigils': {
    title: L('🔮 Sigil Workshop', '🔮 Sigil Atölyesi', '🔮 Сигильная мастерская'),
    buttons: [
      [action('sigil-create', L('✏️ Create a Sigil (Full Guide)'), 'prompt', { prompt: 'Walk me through creating a sigil from scratch: crafting the statement of intent, the reduction methods (word, letter, and pictorial), designing the glyph, and finalizing it for charging. Be precise and operational.', mode: 'sigil' })],
      [action('sigil-charge', L('⚡ Charging Methods'), 'prompt', { prompt: 'Teach all the major sigil charging methods: sexual gnosis, pain, exhaustion, meditation/trance, ecstatic dance, laughter, the death posture, and the "doesn\'t matter / need not be" method. Compare their strengths and when to use each.', mode: 'sigil' }), action('sigil-launch', L('🚀 Launching & Forgetting'), 'prompt', { prompt: 'Teach the art of launching and forgetting a sigil — why forgetting matters, the different approaches (fire, burial, distraction), and what to do when a sigil won\'t leave your mind. Include Spare\'s "neither-neither" approach vs Carroll\'s systematic method.', mode: 'sigil' })],
      [action('sigil-alphabet', L('🔤 Alphabet of Desire'), 'prompt', { prompt: 'Teach Spare\'s Alphabet of Desire — not standard sigil magick but his personal system of symbolic representations of fundamental drives. How it differs from simple letter-reduction sigils, how to build your own alphabet, and why Spare considered it his most important magical tool.', mode: 'seeker' }), action('sigil-trouble', L('🔧 Troubleshooting'), 'prompt', { prompt: 'Why do sigils fail? Common mistakes: weak gnosis, poor intent formulation, obsessing over results, lust of result, unconscious counter-intentions. How to diagnose and fix failed sigil work.', mode: 'sigil' })],
      [action('sigil-advanced', L('🌀 Advanced Techniques'), 'prompt', { prompt: 'Teach advanced sigil techniques: linking sigils, time-delayed sigils, sigil chains, shoaling (launching multiple sigils together), hypersigils (narrative-based reality engineering), and robofish technique. How Gordon White and Peter Carroll expanded Spare\'s original method.', mode: 'sigil' })],
      back('chaos-magick:root'),
    ],
  },

  'chaos-magick:spare': {
    title: L('🖤 Austin Osman Spare'),
    buttons: [
      [action('spare-book', L('📖 The Book of Pleasure'), 'prompt', { prompt: 'Teach the core ideas of Spare\'s Book of Pleasure (Self-Love): the nature of desire, the Kia, Zos, the Neither-Neither principle, and how the book lays the foundation for all chaos magick. This text is dense — unpack it carefully.', mode: 'seeker' })],
      [action('spare-zos', L('🤲 Zos (The Body)'), 'prompt', { prompt: 'Teach Spare\'s concept of Zos — the body considered as a whole, the total psycho-physical organism as a magical instrument. How does Zos relate to Kia? Why did Spare insist that magic operates through the body, not despite it?', mode: 'seeker' }), action('spare-kia', L('💨 Kia (Atmospheric I)'), 'prompt', { prompt: 'Teach Spare\'s concept of Kia — the atmospheric "I", pure awareness freed from all belief and identification. How is Kia the source of magical power? How does one access it?', mode: 'seeker' })],
      [action('spare-nn', L('∅ Neither-Neither'), 'prompt', { prompt: 'Teach Spare\'s Neither-Neither principle — the exhaustion of all duality, the yes and no, belief and disbelief. How it functions as both a philosophical insight and a practical magical technique. Why Spare considered it the key to all sorcery.', mode: 'seeker' }), action('spare-atavism', L('🐍 Atavistic Resurgence'), 'prompt', { prompt: 'Teach Spare\'s doctrine of Atavistic Resurgence — the deliberate invocation of pre-human, ancestral, and animal states of consciousness. How did Spare access these through art and the death posture? What are the risks and the rewards?', mode: 'seeker' })],
      [action('spare-death', L('💀 The Death Posture'), 'prompt', { prompt: 'Teach the Death Posture — Spare\'s technique of extreme physical tension followed by collapse to achieve momentary ego-death and gnosis. The original form from the Book of Pleasure and its modern adaptations. Include safety considerations.', mode: 'seeker' }), action('spare-art', L('🎨 Art as Magic'), 'prompt', { prompt: 'Teach how Spare used automatic drawing, painting, and the creative act itself as a magical technique. The relationship between aesthetic trance, the subconscious, and the manifestation of desire through art.', mode: 'seeker' })],
      [action('spare-bio', L('👤 Spare\'s Life & Legacy'), 'prompt', { prompt: 'Tell the story of Austin Osman Spare — the prodigy who exhibited at the Royal Academy at 17, rejected Crowley\'s AA, chose poverty and obscurity over fame, and died in a basement in Brixton. How his life embodied his philosophy.', mode: 'historian' })],
      back('chaos-magick:root'),
    ],
  },

  'chaos-magick:servitors': {
    title: L('👁 Servitors & Entities', '👁 Servitörler ve Varlıklar', '👁 Сервиторы и сущности'),
    buttons: [
      [action('serv-create', L('🔨 Create a Servitor (Full Guide)'), 'prompt', { prompt: 'Walk me through creating a servitor from scratch: defining its purpose, designing its form and name, determining its power source (offerings, emotions, actions), setting behavioral parameters and limitations, activation method, maintenance schedule, and dissolution protocol. Be thorough and operational.', mode: 'servitor' })],
      [action('serv-types', L('📋 Types of Servitors'), 'prompt', { prompt: 'Teach the different types of servitors and thought-form entities: simple task servitors, guardian servitors, information-gathering servitors, egregores (group thought-forms), and the distinction between servitors and independently existing spirits. When to use each.', mode: 'servitor' }), action('serv-maintain', L('🔧 Maintenance & Dissolution'), 'prompt', { prompt: 'Teach servitor maintenance and disposal: how to feed a servitor, how to know when it\'s working, signs of malfunction or rogue behavior, how to repair a damaged servitor, and how to safely dissolve one when its task is complete. The importance of always including a kill-switch.', mode: 'servitor' })],
      [action('serv-ford', L('🔥 Ford\'s Chaos Servitors'), 'prompt', { prompt: 'Teach Michael Ford\'s approach to chaos servitors from his writings — how his Luciferian framework shapes the creation and deployment of thought-form entities. How does the adversarial current inform servitor design?', mode: 'lhp' }), action('serv-egregore', L('🌐 Egregores & Group Mind'), 'prompt', { prompt: 'Teach the concept of egregores — thought-forms created by groups rather than individuals. How magical orders, religions, corporations, and fandoms create and sustain egregores. How a chaos mage can work with or against existing egregores.', mode: 'servitor' })],
      back('chaos-magick:root'),
    ],
  },

  'chaos-magick:gnosis': {
    title: L('⚡ Gnosis States', '⚡ Gnosis Durumları', '⚡ Состояния гнозиса'),
    buttons: [
      [action('gnosis-overview', L('⚡ What is Gnosis?'), 'prompt', { prompt: 'Teach gnosis in chaos magick — the altered state of consciousness where magical operations are performed. Why is gnosis necessary? How does it relate to the subconscious and to Spare\'s concept of the "vacuity" of mind? Compare Carroll\'s model with Spare\'s original.', mode: 'gnosis' })],
      [action('gnosis-inhibit', L('🧘 Inhibitory Gnosis'), 'prompt', { prompt: 'Teach inhibitory gnosis methods: meditation, sensory deprivation, fasting, prolonged stillness, sleep deprivation, yoga nidra, and the "empty mind" technique. Step by step instructions for the most accessible methods. Include safety guidance.', mode: 'gnosis' }), action('gnosis-excite', L('🥁 Excitatory Gnosis'), 'prompt', { prompt: 'Teach excitatory gnosis methods: drumming, chanting, ecstatic dance, hyperventilation, pain, sexual arousal at peak, extreme physical exertion, and emotional flooding. How to use these to bypass the conscious mind. Safety and boundary-setting.', mode: 'gnosis' })],
      [action('gnosis-nn', L('∅ Spare\'s Indifference'), 'prompt', { prompt: 'Teach Spare\'s "indifference" or neither-neither as a gnosis method — the most subtle and arguably most powerful technique. Achieving magical effect through the deliberate cultivation of not-caring. How this paradoxically short-circuits lust of result.', mode: 'seeker' }), action('gnosis-practice', L('🎯 Gnosis Training Plan'), 'prompt', { prompt: 'Give a 30-day gnosis training plan for a chaos magick beginner: starting with basic meditation, progressing through inhibitory and excitatory techniques, and culminating in a first sigil working using each method. One technique per week.', mode: 'teacher' })],
      back('chaos-magick:root'),
    ],
  },

  'chaos-magick:lhp': {
    title: L('🔥 Left Hand Path', '🔥 Sol El Yolu', '🔥 Путь Левой Руки'),
    buttons: [
      [action('lhp-philosophy', L('🔥 Luciferian Philosophy'), 'prompt', { prompt: 'Teach Michael Ford\'s Luciferian philosophy — the Black Flame as inner illumination, the Adversary as mirror of the self, self-deification through challenge and shadow integration. How this differs from both theistic Satanism and edgy atheism.', mode: 'lhp' })],
      [action('lhp-goetia', L('👹 Luciferian Goetia'), 'prompt', { prompt: 'Teach Ford\'s approach to the Luciferian Goetia — working with the 72 Goetic spirits not through Solomonic subjugation but through a Luciferian framework of mutual respect and self-empowerment. How Ford reframes the spirits as aspects of consciousness to be integrated.', mode: 'lhp' }), action('lhp-evocation', L('🕯️ Evocation Techniques'), 'prompt', { prompt: 'Teach the practical evocation techniques from Ford\'s archive: preparation, circle design, the Luciferian framework for spirit communication, scrying methods (Unlocking the Gaze), and theurgic evocation for self-transformation.', mode: 'evocation' })],
      [action('lhp-sabbat', L('🌙 The Sabbat Current'), 'prompt', { prompt: 'Teach the Sabbat current from Ford\'s Master of the Sabbat — the witches\' Sabbath as an internal initiatory experience, the meeting with the Adversary at the crossroads, and the Black Sabbath as a state of consciousness.', mode: 'lhp' }), action('lhp-necro', L('💀 Draconian Necromancy'), 'prompt', { prompt: 'Teach the necromantic current in Ford\'s work — Draconian Necromancy, necroscience, and communication with death-current energies. Context this within the Luciferian framework as a path of self-knowledge through confrontation with mortality.', mode: 'lhp' })],
      [action('lhp-pact', L('📜 Pact-Making'), 'prompt', { prompt: 'Teach the Luciferian approach to pact-making from Ford\'s Pacte Diabolique — not selling one\'s soul to an external entity, but making a binding commitment to one\'s own self-deification. The structure, the commitment, and the psychological reality of the pact.', mode: 'lhp' }), action('lhp-crowley', L('⭐ Crowley & Thelema'), 'prompt', { prompt: 'Teach how Crowley\'s Thelema relates to chaos magick and the Left Hand Path. The Book of the Law, "Do what thou wilt," and how chaos magick took Crowley\'s system and made it modular and paradigm-independent. Where they converge and where they diverge.', mode: 'historian' })],
      back('chaos-magick:root'),
    ],
  },

  'chaos-magick:practical': {
    title: L('🛠️ Practical Sorcery', '🛠️ Pratik Büyü', '🛠️ Практическая магия'),
    buttons: [
      [action('prac-spellcraft', L('✨ SpellCraft Basics'), 'prompt', { prompt: 'Teach the fundamentals of chaos magick spellcraft from the archive: structuring a spell, selecting components, timing, correspondences (or deliberately ignoring them), execution, and result-tracking. The chaos approach to traditional spellwork.', mode: 'practical' }), action('prac-scrying', L('🔮 Scrying & Vision'), 'prompt', { prompt: 'Teach scrying techniques from Ford\'s Scrying the Shroud and Unlocking the Gaze: mirror scrying, crystal gazing, fire gazing, and how to enter the receptive state. The Luciferian approach to vision work.', mode: 'practical' })],
      [action('prac-ritual', L('🕯️ Ritual Design'), 'prompt', { prompt: 'Teach how to design a chaos magick ritual from scratch: the principle that structure serves intent (not the other way around), how to select and combine elements, banishing with laughter vs LBRP, opening and closing, and the importance of post-ritual grounding.', mode: 'practical' }), action('prac-divination', L('🎲 Chaos Divination'), 'prompt', { prompt: 'Teach chaos magick approaches to divination: using any system as a temporary belief lens (Tarot, I Ching, runes, bones), creating personal divination systems, and the theoretical framework for why divination works from a chaos perspective.', mode: 'practical' })],
      [action('prac-banish', L('🧹 Banishing Techniques'), 'prompt', { prompt: 'Teach chaos magick banishing: the Gnostic Pentagram Ritual, banishing with laughter, Peter Carroll\'s vortex method, the LBRP repurposed for chaos work, and Ford\'s adversarial banishing. When and why to banish.', mode: 'practical' }), action('prac-enchant', L('🎯 Results Magick'), 'prompt', { prompt: 'Teach enchantment — the branch of chaos magick focused on producing tangible results in the material world. Combining sigils, servitors, and practical timing. How to set up a results-tracking system and iterate based on what works.', mode: 'practical' })],
      back('chaos-magick:root'),
    ],
  },

  'chaos-magick:paradigm': {
    title: L('🔄 Paradigm Shifting', '🔄 Paradigma Kaydırma', '🔄 Сдвиг парадигмы'),
    buttons: [
      [action('para-what', L('🔄 What is a Paradigm Shift?'), 'prompt', { prompt: 'Teach paradigm shifting — the core meta-skill of chaos magick. How to temporarily adopt any belief system (Christianity, Voodoo, Thelema, atheism), use it fully as a magical lens, and release it cleanly. The difference between sincere belief and operational belief.', mode: 'paradigm' })],
      [action('para-tunnel', L('🚇 Reality Tunnels'), 'prompt', { prompt: 'Teach the concept of reality tunnels (from Robert Anton Wilson through chaos magick): how every belief system creates a self-confirming perceptual filter, how to recognize your own tunnel, and how to deliberately switch between tunnels for magical and psychological benefit.', mode: 'paradigm' }), action('para-hack', L('💻 Hacking Belief'), 'prompt', { prompt: 'Teach the practical techniques for hacking your own belief system: acting-as-if, belief shifting exercises, the "month of practice" method, immersive paradigm work, and how to handle the disorientation that comes from taking belief apart and reassembling it.', mode: 'paradigm' })],
      [action('para-meta', L('🧠 Meta-Belief'), 'prompt', { prompt: 'Teach meta-belief — the awareness that sits above all belief systems. How chaos magick trains the ability to hold beliefs lightly, to see through the matrix of any paradigm while still being able to use it. The relationship between this and Spare\'s Neither-Neither.', mode: 'paradigm' }), action('para-danger', L('⚠️ Dangers & Safeguards'), 'prompt', { prompt: 'Teach the psychological risks of paradigm shifting: identity destabilization, Chapel Perilous, the "everything is meaningless" crisis, spiritual emergency vs spiritual emergence. How to stay grounded while working at the edges of reality. When to stop and stabilize.', mode: 'paradigm' })],
      back('chaos-magick:root'),
    ],
  },

  'chaos-magick:learn': {
    title: L('🎓 Learning Paths', '🎓 Öğrenme Yolları', '🎓 Пути обучения'),
    buttons: [
      [action('learn-chaos-begin', L('🌱 Chaos Initiate', '🌱 Kaos Müptedisi', '🌱 Посвящение в Хаос'), 'prompt', { prompt: 'Give the Chaos Magick Initiate learning path: core principles (belief as tool, gnosis, sigils), first practices, essential reading (Hine, Carroll, Spare), and a 90-day structured program from zero to first successful working.', mode: 'teacher' }), action('learn-chaos-spare', L('🖤 The Spare Path', '🖤 Spare Yolu', '🖤 Путь Спэйра'), 'prompt', { prompt: 'Give a learning path focused on Austin Osman Spare: the Book of Pleasure, the Zos Kia system, automatic drawing, the Alphabet of Desire, and atavistic resurgence. For practitioners who want to go deep into Spare\'s original art-magic.', mode: 'teacher' })],
      [action('learn-chaos-lhp', L('🔥 Left Hand Path', '🔥 Sol El Yolu', '🔥 Путь Левой Руки'), 'prompt', { prompt: 'Give a learning path for Ford\'s Luciferian current: starting with Luciferian Philosophy, through the Goetia, into the practical grimoire work (SpellCraft, Evocation, Scrying), and the deeper initiatory material (Sabbat, Necromancy, Pact). Step by step with the actual texts in the archive.', mode: 'teacher' }), action('learn-chaos-prac', L('🛠️ Practical Sorcerer', '🛠️ Pratik Büyücü', '🛠️ Практический маг'), 'prompt', { prompt: 'Give a practical sorcery learning path focused on producing results: sigil mastery, servitor creation, enchantment, divination, banishing, and results tracking. The engineering-minded approach to chaos magick.', mode: 'teacher' })],
      back('chaos-magick:root'),
    ],
  },
}

export function getMenuScreen(pack: OraclePack, menuKey?: string, _currentCard?: string | null): MenuScreen {
  const key = menuKey && MENUS[menuKey] ? menuKey : `${pack}:root`
  return MENUS[key] ?? MENUS[`${pack}:root`]
}
