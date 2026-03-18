import type { OracleMode, OraclePack, UiLang } from '@/lib/oracle-ui'

type Localized = Record<UiLang, string>

export type MenuActionKind =
  | 'submenu'
  | 'prompt'
  | 'back'
  | 'voice'
  | 'language'
  | 'invite'
  | 'gift'
  | 'plans'
  | 'switch'

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

const L = (en: string, tr?: string, ru?: string): Localized => ({
  en,
  tr: tr ?? en,
  ru: ru ?? en,
})

const action = (id: string, label: Localized, kind: MenuActionKind, extra: Partial<MenuAction> = {}): MenuAction => ({
  id,
  label,
  kind,
  ...extra,
})

const genericRows = [
  [action('voice', L('🎙 Voice', '🎙 Ses', '🎙 Голос'), 'voice'), action('language', L('🌐 Language', '🌐 Dil', '🌐 Язык'), 'language')],
  [action('invite', L('🔗 Invite', '🔗 Davet Et', '🔗 Пригласить'), 'invite'), action('gift', L('🎁 Gift', '🎁 Hediye', '🎁 Подарок'), 'gift')],
  [action('switch', L('🔀 Switch', '🔀 Değiştir', '🔀 Сменить'), 'switch'), action('plans', L('💳 Plans', '💳 Planlar', '💳 Тарифы'), 'plans')],
]

const tarotMajors = [
  'The Fool','The Magician','The High Priestess','The Empress','The Emperor','The Hierophant','The Lovers','The Chariot','Strength','The Hermit','Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil','The Tower','The Star','The Moon','The Sun','Judgment','The World',
]

const suitCards = (suit: string) => [
  `Ace of ${suit}`,
  `Two of ${suit}`,
  `Three of ${suit}`,
  `Four of ${suit}`,
  `Five of ${suit}`,
  `Six of ${suit}`,
  `Seven of ${suit}`,
  `Eight of ${suit}`,
  `Nine of ${suit}`,
  `Ten of ${suit}`,
  `Page of ${suit}`,
  `Knight of ${suit}`,
  `Queen of ${suit}`,
  `King of ${suit}`,
]

const cardPrompt = (card: string) => `Full reading for ${card}. Core meaning for readings, symbolism, element, planet, Kabbalah. Flowing prose.`

const cardAnalysisButtons = (card: string): MenuAction[][] => [
  [action(`meaning:${card}`, L('📖 Card Meaning'), 'prompt', { mode: 'teacher', prompt: `Complete practical meaning of ${card} for Tarot readings. Upright meaning, reversed meaning, what it indicates in love, career, and spiritual growth. Clear and useful for a working reader.`, displayText: L(`📖 ${card} — Card Meaning`) })],
  [action(`deck:${card}`, L('🗃️ RWS vs Thoth vs Marseille'), 'prompt', { mode: 'deck_compare', prompt: `Compare ${card} across RWS (Waite/Pollack), Thoth (Crowley/DuQuette), and Marseille (Jodorowsky/Ben-Dov). What does each tradition uniquely reveal?`, displayText: L(`🗃️ ${card} — Deck Comparison`) })],
  [action(`qabalah:${card}`, L('⚗️ Qabalistic Analysis'), 'prompt', { mode: 'qabalah', prompt: `Full Qabalistic analysis of ${card}: Hebrew letter, Tree of Life path, bridging Sephiroth, astrological ruler, quality of consciousness. Cite Wang, Case, Mathers.`, displayText: L(`⚗️ ${card} — Qabalistic Analysis`) })],
  [action(`astro:${card}`, L('🌟 Astrology of this Card'), 'prompt', { mode: 'astro', prompt: `Full astrological analysis of ${card}: ruler, decan (if pip), how the energy manifests in the imagery, difference between RWS/GD and Thoth. Reference Anthony Louis.`, displayText: L(`🌟 ${card} — Astrology`) })],
  [action(`shadow:${card}`, L('🌑 Shadow Work'), 'prompt', { mode: 'shadow', prompt: `Shadow work session for ${card}: name the shadow aspect, the question the shadow holds, the integration path, and a journaling prompt. Follow Jette and Greer.`, displayText: L(`🌑 ${card} — Shadow Work`) })],
  [action(`path:${card}`, L('🧘 Pathworking'), 'prompt', { mode: 'pathwork', prompt: `Lead a complete pathworking for ${card}. Set the threshold, guide the landscape, the encounter, the reception, and the return. Present tense, second person.`, displayText: L(`🧘 ${card} — Pathworking`) })],
  [action(`talisman:${card}`, L('🔮 Talisman & Magic'), 'prompt', { mode: 'talisman', prompt: `Magical and talisman applications of ${card}. Reference Tyson, the Ciceros, De Biasi, and Gareth Knight. Include correspondences and practical ritual guidance.`, displayText: L(`🔮 ${card} — Talisman & Magic`) })],
  [action(`teacher:${card}`, L('👩‍🏫 Teach Me This Card'), 'prompt', { mode: 'teacher', prompt: `Teach me about ${card}. Structure: core principle, historical context with author citation, practical application, a student exercise, and what to study next.`, displayText: L(`👩‍🏫 ${card} — Teach Me`) })],
  [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tarot:arcana' })],
]

export function getMenuScreen(pack: OraclePack, menuKey: string, currentCard?: string | null): MenuScreen {
  if (pack === 'tao') {
    return {
      title: L('☯️ Tao Oracle Menu', '☯️ Tao Menüsü', '☯️ Меню Дао'),
      buttons: [
        [action('tao-q1', L('What does the Tao say about patience?'), 'prompt', { prompt: 'What does the Tao say about patience?', mode: 'oracle' })],
        [action('tao-q2', L('Why do obstacles appear?'), 'prompt', { prompt: 'Why do obstacles appear?', mode: 'seeker' })],
        [action('tao-q3', L('How should I approach a difficult decision?'), 'prompt', { prompt: 'How should I approach a difficult decision?', mode: 'oracle' })],
        [action('tao-q4', L('Share wisdom for today.'), 'prompt', { prompt: 'Share wisdom for today.', mode: 'quote' })],
        ...genericRows,
      ],
    }
  }

  if (pack === 'tantra') {
    const tantraScreens: Record<string, MenuScreen> = {
      'tantra:root': {
        title: L('🔥 Shakti Oracle', '🔥 Shakti Oracle', '🔥 Shakti Oracle'),
        buttons: [
          [action('daily', L('🔥 Daily Technique', '🔥 Günlük Teknik', '🔥 Практика дня'), 'prompt', { prompt: "Select one of the 112 dharanas and transmit: name, practice, inner landscape, invitation. Osho's Book of Secrets.", mode: 'dharana', displayText: L('🔥 Daily Technique') }), action('practices', L('🧘 Practice Path', '🧘 Pratik Yolu', '🧘 Путь практики'), 'submenu', { nextMenu: 'tantra:practices' })],
          [action('dharanas', L('✨ 112 Dharanas'), 'submenu', { nextMenu: 'tantra:dharanas' }), action('study', L('📚 Deep Study', '📚 Derin İnceleme', '📚 Глубокое изучение'), 'submenu', { nextMenu: 'tantra:study' })],
          [action('chakras', L('🌸 Chakra Map', '🌸 Çakra Haritası', '🌸 Карта чакр'), 'submenu', { nextMenu: 'tantra:chakras' }), action('kundalini', L('⚡ Kundalini'), 'prompt', { prompt: 'Complete Kundalini introduction. Woodroffe, Mookerjee, Osho.', mode: 'kundalini', displayText: L('⚡ Kundalini') })],
          ...genericRows,
        ],
      },
      'tantra:practices': {
        title: L('🧘 Practice Paths', '🧘 Pratik Yolları', '🧘 Пути практики'),
        buttons: [
          [action('breath_path', L('🌬️ The Breath Path'), 'prompt', { prompt: 'Practice path: The Breath Path. Select three dharanas from the breath group and explain how they work as one journey.', mode: 'dharana' })],
          [action('fire_path', L('🔥 The Fire Path'), 'prompt', { prompt: 'Practice path: The Fire Path. Select three dharanas from the fire group and explain how they work as one journey.', mode: 'dharana' })],
          [action('witness_path', L('👁️ The Witness Path'), 'prompt', { prompt: 'Practice path: The Witness Path. Select three dharanas from the witness group and explain how they work as one journey.', mode: 'dharana' })],
          [action('sound_path', L('🎵 The Sound Path'), 'prompt', { prompt: 'Practice path: The Sound Path. Select three dharanas from the sound group and explain how they work as one journey.', mode: 'dharana' })],
          [action('devotion_path', L('🌹 The Devotion Path'), 'prompt', { prompt: 'Practice path: The Devotion Path. Select three dharanas from the surrender group and explain how they work as one journey.', mode: 'dharana' })],
          [action('senses_path', L('✨ Senses as Doors'), 'prompt', { prompt: 'Practice path: Senses as Doors. Select three dharanas from the senses group and explain how they work as one journey.', mode: 'dharana' })],
          [action('space_path', L('🌌 The Space Path'), 'prompt', { prompt: 'Practice path: The Space Path. Select three dharanas from the space group and explain how they work as one journey.', mode: 'dharana' })],
          [action('lightning_path', L('⚡ The Lightning Path'), 'prompt', { prompt: 'Practice path: The Lightning Path. Select three dharanas from the lightning group and explain how they work as one journey.', mode: 'dharana' })],
          [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tantra:root' })],
        ],
      },
      'tantra:dharanas': {
        title: L('✨ 112 Dharanas', '✨ 112 Dharana', '✨ 112 дхаран'),
        buttons: [
          [action('grp-breath', L('🌬️ The Sacred Breath (1–9)'), 'prompt', { prompt: 'Teach the dharana group The Sacred Breath (1–9): breath as the primary doorway to consciousness.', mode: 'dharana' })],
          [action('grp-fire', L('🔥 The Rising Fire (10–22)'), 'prompt', { prompt: 'Teach the dharana group The Rising Fire (10–22): Kundalini, inner energy, and the luminous centers.', mode: 'dharana' })],
          [action('grp-senses', L('✨ Senses as Sacred Doors (23–42)'), 'prompt', { prompt: 'Teach the dharana group Senses as Sacred Doors (23–42): sensory experience as doorway to the infinite.', mode: 'dharana' })],
          [action('grp-space', L('🌌 The Inner Sky (43–56)'), 'prompt', { prompt: 'Teach the dharana group The Inner Sky (43–56): space, emptiness, and vast interior silence.', mode: 'dharana' })],
          [action('grp-witness', L('👁️ The Pure Witness (57–71)'), 'prompt', { prompt: 'Teach the dharana group The Pure Witness (57–71): pure awareness, witnessing, and nondual seeing.', mode: 'dharana' })],
          [action('grp-sound', L('🎵 Sacred Sound & Mantra (72–83)'), 'prompt', { prompt: 'Teach the dharana group Sacred Sound & Mantra (72–83): nada, mantra, and the inner vibration.', mode: 'dharana' })],
          [action('grp-surrender', L('🌹 Surrender & Devotion (84–99)'), 'prompt', { prompt: 'Teach the dharana group Surrender & Devotion (84–99): surrender, bhakti, and the path of love.', mode: 'surrender' })],
          [action('grp-lightning', L('🌞 The Absolute (100–112)'), 'prompt', { prompt: 'Teach the dharana group The Absolute (100–112): transcendence, the absolute, and final recognition.', mode: 'dharana' })],
          [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tantra:root' })],
        ],
      },
      'tantra:chakras': {
        title: L('🌸 Chakra Map', '🌸 Çakra Haritası', '🌸 Карта чакр'),
        buttons: [
          [action('root', L('🟥 Root'), 'prompt', { prompt: 'Complete teaching on Root chakra. Woodroffe, Judith.', mode: 'chakra' })],
          [action('sacral', L('🟧 Sacral'), 'prompt', { prompt: 'Complete teaching on Sacral chakra. Woodroffe, Judith.', mode: 'chakra' })],
          [action('solar', L('🟨 Solar Plexus'), 'prompt', { prompt: 'Complete teaching on Solar Plexus chakra. Woodroffe, Judith.', mode: 'chakra' })],
          [action('heart', L('💚 Heart'), 'prompt', { prompt: 'Complete teaching on Heart chakra. Woodroffe, Judith.', mode: 'chakra' })],
          [action('throat', L('🔵 Throat'), 'prompt', { prompt: 'Complete teaching on Throat chakra. Woodroffe, Judith.', mode: 'chakra' })],
          [action('third-eye', L('🟣 Third Eye'), 'prompt', { prompt: 'Complete teaching on Third Eye chakra. Woodroffe, Judith.', mode: 'chakra' })],
          [action('crown', L('🟤 Crown'), 'prompt', { prompt: 'Complete teaching on Crown chakra. Woodroffe, Judith.', mode: 'chakra' })],
          [action('full', L('⚡ Full Map'), 'prompt', { prompt: 'Complete seven-chakra map. Woodroffe, Judith.', mode: 'chakra' })],
          [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tantra:root' })],
        ],
      },
      'tantra:study': {
        title: L('📚 Deep Study', '📚 Derin İnceleme', '📚 Глубокое изучение'),
        buttons: [
          [action('kashmir', L('⚡ Kashmir Shaivism'), 'prompt', { prompt: 'Kashmir Shaivism overview.', mode: 'scholar' }), action('shiva', L('🌸 Shiva–Shakti'), 'prompt', { prompt: 'Shiva-Shakti cosmology.', mode: 'shiva_shakti' })],
          [action('mantra', L('📿 Mantra'), 'prompt', { prompt: 'Mantra teaching.', mode: 'oracle' }), action('vedanta', L('🌟 Vedanta'), 'prompt', { prompt: 'Non-dual Vedanta.', mode: 'vedanta' })],
          [action('schools', L('🏛️ Schools'), 'prompt', { prompt: 'Compare Tantric streams.', mode: 'school_compare' }), action('history', L('📜 History'), 'prompt', { prompt: 'Tantra history.', mode: 'historian' })],
          [action('osho', L('📖 Osho'), 'prompt', { prompt: 'Osho on Tantra.', mode: 'oracle' }), action('subtle', L('🧬 Subtle Body'), 'prompt', { prompt: 'Complete subtle body map.', mode: 'scholar' })],
          [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tantra:root' })],
        ],
      },
    }
    return tantraScreens[menuKey] ?? tantraScreens['tantra:root']
  }

  if (pack === 'entheogen') {
    const prompt = (text: string, mode: OracleMode, labelText?: string) => action(text, L(labelText ?? text), 'prompt', { prompt: text, mode })
    const entheogenScreens: Record<string, MenuScreen> = {
      'entheogen:root': {
        title: L('🍄 Esoteric Entheogen', '🍄 Ezoterik Entheogen', '🍄 Эзотерический Энтеоген'),
        buttons: [
          [action('daily', L('🍄 Daily', '🍄 Günlük', '🍄 Ежедневно'), 'prompt', { prompt: 'Draw one entheogenic contemplation from the archive. Blend phenomenology, history, and one practical integration question.', mode: 'oracle', displayText: L('🍄 Daily contemplation') }), action('maps', L('🧠 Consciousness Maps', '🧠 Bilinç Haritaları', '🧠 Карты сознания'), 'submenu', { nextMenu: 'entheogen:maps' })],
          [action('shamanism', L('🪶 Shamanic Streams', '🪶 Şamanik Akımlar', '🪶 Шаманские потоки'), 'submenu', { nextMenu: 'entheogen:shamanism' }), action('ethno', L('🌿 Ethnobotany', '🌿 Etnobotanik', '🌿 Этноботаника'), 'submenu', { nextMenu: 'entheogen:ethno' })],
          [action('pharma', L('🔬 Pharmacopoeia', '🔬 Farmakopoia', '🔬 Фармакопея'), 'submenu', { nextMenu: 'entheogen:pharma' }), action('safety', L('⚠️ Harm Reduction', '⚠️ Zarar Azaltma', '⚠️ Снижение вреда'), 'submenu', { nextMenu: 'entheogen:safety' })],
          [action('entities', L('👁 DMT Entity Atlas', '👁 DMT Varlık Atlası', '👁 Атлас DMT-сущностей'), 'submenu', { nextMenu: 'entheogen:entities' }), action('guides', L('🧭 Set & Setting', '🧭 Set ve Setting', '🧭 Set & Setting'), 'submenu', { nextMenu: 'entheogen:guides' })],
          [action('corr', L('🕸 Correspondences', '🕸 Eşleştirmeler', '🕸 Соответствия'), 'submenu', { nextMenu: 'entheogen:corr' }), action('study', L('📚 Deep Study', '📚 Derin İnceleme', '📚 Глубокое изучение'), 'submenu', { nextMenu: 'entheogen:study' })],
          [action('history', L('🏛 History & Philosophy', '🏛 Tarih ve Felsefe', '🏛 История и философия'), 'submenu', { nextMenu: 'entheogen:history' }), action('question', L('🤔 Provoking Questions', '🤔 Kışkırtıcı Sorular', '🤔 Провокационные вопросы'), 'prompt', { prompt: 'Develop a mystery-school style entheogenic question seed around consciousness, initiation, risk, integration, and revelation.', mode: 'scholar', displayText: L('🤔 Provoking Question') })],
          ...genericRows,
        ],
      },
      'entheogen:maps': { title: L('🧠 Maps of Consciousness'), buttons: [
        [action('grof', L('🌀 Grof · Holotropic'), 'prompt', { prompt: `Explain Stanislav Grof's map of the psyche: biographical, perinatal, transpersonal, and implications for psychedelic states.`, mode: 'scholar' })],
        [action('wilber', L('🏔 Wilber · Spectrum'), 'prompt', { prompt: `Explain Ken Wilber's transpersonal spectrum and how psychedelic states fit or fail to fit it.`, mode: 'scholar' })],
        [action('tart', L('🧭 Tart · States of Consciousness'), 'prompt', { prompt: `Explain Charles Tart's state-specific sciences and altered states framework for psychedelics.`, mode: 'scholar' })],
        [action('lilly', L('🐬 Lilly · Metaprogramming'), 'prompt', { prompt: `Explain John C. Lilly's metaprogramming and inner-space model in relation to psychedelic exploration.`, mode: 'scholar' })],
        [action('shanon', L('🌿 Shanon · Ayahuasca Phenomenology'), 'prompt', { prompt: `Explain Benny Shanon's phenomenology of ayahuasca from The Antipodes of the Mind.`, mode: 'scholar' })],
        [action('compare', L('⚖️ Compare Thinkers'), 'prompt', { prompt: `Compare Grof, Wilber, Tart, Lilly, and Shanon as maps of consciousness for psychedelic states.`, mode: 'school_compare' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:shamanism': { title: L('🪶 Shamanic Streams'), buttons: [
        [action('amazonian', L('🌿 Amazonian Ayahuasca'), 'prompt', { prompt: `Teach the Amazonian ayahuasca stream: vegetalismo, healing, visions, songs, and ritual container.`, mode: 'historian' })],
        [action('mesoamerican', L('🌵 Mesoamerican & Peyote'), 'prompt', { prompt: `Teach the Mesoamerican peyote and mushroom streams: sacred use, vision, pilgrimage, and healing context.`, mode: 'historian' })],
        [action('siberian', L('🦌 Siberian & Circumpolar'), 'prompt', { prompt: `Teach Siberian and circumpolar shamanic themes in the archive and how altered states are framed there.`, mode: 'historian' })],
        [action('norse', L('ᚠ Norse / Seidr'), 'prompt', { prompt: `Explain Norse and seidr-oriented shamanic themes represented in the archive.`, mode: 'historian' })],
        [action('modern', L('⚡ Modern Shamanism'), 'prompt', { prompt: `Compare modern shamanism approaches in the archive: Phil Hine, Jan Fries, Ingerman, Winkelman, and DeKorne.`, mode: 'school_compare' })],
        [action('compare', L('⚖️ Compare Streams'), 'prompt', { prompt: `Compare Amazonian, Mesoamerican, Siberian, Norse, and modern shamanic streams in relation to entheogens.`, mode: 'school_compare' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:ethno': { title: L('🌿 Ethnobotany'), buttons: [
        [action('mushrooms', L('🍄 Sacred Mushrooms'), 'prompt', { prompt: `Teach sacred mushrooms through ethnobotany, history, and meaning: Wasson, Schultes, Hofmann, Rätsch, Gartz, McKenna.`, mode: 'historian' })],
        [action('ayahuasca', L('🍃 Ayahuasca Plants'), 'prompt', { prompt: `Teach the ayahuasca botanical matrix: vines, admixtures, traditions, ritual and ethnobotany.`, mode: 'historian' })],
        [action('peyote', L('🌵 Peyote / Mescaline'), 'prompt', { prompt: `Teach peyote and mescaline from ethnobotanical, historical, and ceremonial perspectives.`, mode: 'historian' })],
        [action('salvia', L('🌀 Salvia divinorum'), 'prompt', { prompt: `Teach Salvia divinorum through ethnobotany, phenomenology, and distinctiveness from serotonergic psychedelics.`, mode: 'historian' })],
        [action('cannabis', L('🌿 Cannabis'), 'prompt', { prompt: `Teach cannabis in the archive as medicine, ritual plant, contemplative aid, and cultural force.`, mode: 'historian' })],
        [action('ancient', L('🏺 Ancient sacred plants'), 'prompt', { prompt: `Teach ancient sacred plants, mystery religions, and entheogens in relation to religion and myth.`, mode: 'historian' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:pharma': { title: L('🔬 Pharmacopoeia'), buttons: [
        [action('tryptamines', L('🧬 Tryptamines'), 'prompt', { prompt: `Explain the tryptamine family in the archive: DMT, psilocybin, analogues, phenomenology, duration, and key thinkers.`, mode: 'scholar' })],
        [action('lysergamides', L('🧪 Lysergamides'), 'prompt', { prompt: `Explain LSD and the lysergamide family from chemistry, pharmacology, history, and therapeutic use perspectives.`, mode: 'scholar' })],
        [action('phenethylamines', L('💠 Phenethylamines'), 'prompt', { prompt: `Explain mescaline and the Shulgin phenethylamine world as represented in the archive.`, mode: 'scholar' })],
        [action('dissociatives', L('🫧 Dissociatives'), 'prompt', { prompt: `Explain ketamine and related dissociative territory in the archive, including how it differs phenomenologically from classic psychedelics.`, mode: 'scholar' })],
        [action('analogues', L('🔁 Ayahuasca analogues'), 'prompt', { prompt: `Explain ayahuasca analogues and plant-based tryptamine pathways in a historical and comparative way, without recipes or extraction details.`, mode: 'scholar' })],
        [action('correspond', L('🕸 Plant ↔ Molecule'), 'prompt', { prompt: `Map plants, principal alkaloids, chemical families, and experiential signatures across the entheogen archive.`, mode: 'school_compare' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:safety': { title: L('⚠️ Harm Reduction'), buttons: [
        [action('set-setting', L('🧭 Set & Setting'), 'prompt', { prompt: `Give a careful set and setting guide for entheogenic work: mindset, environment, intentions, and support.`, mode: 'seeker' })],
        [action('contra', L('🚫 Contraindications'), 'prompt', { prompt: `Explain major contraindication domains for entheogens in a harm reduction frame: psychiatric risk, medical risk, and when not to proceed.`, mode: 'scholar' })],
        [action('interactions', L('⚠️ Interactions'), 'prompt', { prompt: `Give a harm reduction overview of major entheogen interaction categories and why combinations can become risky.`, mode: 'scholar' })],
        [action('difficult', L('🌧 Difficult Experiences'), 'prompt', { prompt: `Give a grounded harm reduction guide for difficult psychedelic experiences: recognition, de-escalation, support, and aftercare.`, mode: 'scholar' })],
        [action('integration', L('🪞 Integration'), 'prompt', { prompt: `Teach psychedelic integration: journaling, therapy, ritual closure, embodiment, and how to discern signal from inflation.`, mode: 'seeker' })],
        [action('sitter', L('🤝 Trip Sitter Guide'), 'prompt', { prompt: `Give a practical trip sitter guide: presence, language, boundaries, safety, escalation, and what not to do.`, mode: 'seeker' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:entities': { title: L('👁 DMT Entity Atlas'), buttons: [
        [action('trickster', L('🃏 Trickster / Jester'), 'prompt', { prompt: `Describe trickster or jester-like DMT entities as reported in the archive, framing them as phenomenological motifs rather than objective proof.`, mode: 'scholar' })],
        [action('teacher', L('📚 Teachers / Instructors'), 'prompt', { prompt: `Describe teacher-like, guide-like, or initiatory DMT entities in the archive as phenomenological motifs.`, mode: 'scholar' })],
        [action('machine', L('⚙️ Machine / Geometry beings'), 'prompt', { prompt: `Describe machine-like, geometric, or hyperdimensional intelligences in DMT reports from the archive.`, mode: 'scholar' })],
        [action('ancestor', L('🕯 Ancestor / spirit presences'), 'prompt', { prompt: `Describe ancestor-like, spirit-like, or death-rebirth presences reported in entheogenic literature in the archive.`, mode: 'scholar' })],
        [action('compare', L('⚖️ McKenna vs Strassman vs Shanon'), 'prompt', { prompt: `Compare how McKenna, Strassman, and Shanon describe entities, presences, and autonomous seeming intelligences.`, mode: 'school_compare' })],
        [action('question', L('❓ What are entities?'), 'prompt', { prompt: `What are DMT entities according to the archive? Compare phenomenological, psychological, spiritual, and skeptical frames without claiming certainty.`, mode: 'scholar' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:guides': { title: L('🧭 Set, Setting & Guides'), buttons: [
        [action('first', L('🌱 First Journey'), 'prompt', { prompt: `Give a grounded guide for a first entheogenic journey, emphasizing preparation, support, pacing, and integration.`, mode: 'seeker' })],
        [action('ritual', L('🕯 Ritual Container'), 'prompt', { prompt: `Teach how ritual container shapes entheogenic work: intention, boundary, music, invocation, closure, and aftercare.`, mode: 'seeker' })],
        [action('after', L('🌄 The Morning After'), 'prompt', { prompt: `Teach the morning-after integration frame for a powerful entheogenic experience.`, mode: 'seeker' })],
        [action('micro', L('🫧 Microdosing frame'), 'prompt', { prompt: `Give a careful, non-prescriptive philosophical frame for thinking about microdosing: intention, observation, ethics, and self-honesty.`, mode: 'seeker' })],
        [action('when-not', L('🛑 When not to proceed'), 'prompt', { prompt: `Explain when not to proceed with entheogenic work, in a careful harm-reduction frame.`, mode: 'scholar' })],
        [action('questions', L('🤔 Pre-trip questions'), 'prompt', { prompt: `Give a set of pre-trip questions to ask before entheogenic work: motive, fear, support, timing, and integration capacity.`, mode: 'seeker' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:corr': { title: L('🕸 Correspondence Web'), buttons: [
        [action('correspond', L('🌿 Plant ↔ Molecule'), 'prompt', { prompt: `Map plants, principal alkaloids, chemical families, ritual contexts, and experiential signatures across the archive.`, mode: 'school_compare' })],
        [action('analogues', L('🍃 Ayahuasca analogues'), 'prompt', { prompt: `Explain ayahuasca analogues and plant-based tryptamine pathways in a historical and comparative way, without recipes or extraction details.`, mode: 'scholar' })],
        [action('pathways', L('⚖️ Compare classic pathways'), 'prompt', { prompt: `Compare psilocybin, LSD, mescaline, ayahuasca, salvia, and ketamine across duration, tone, symbolism, body-load, and integration challenges.`, mode: 'school_compare' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:study': { title: L('📚 Deep Study'), buttons: [
        [action('transpersonal', L('🧠 Transpersonal Psychology'), 'prompt', { prompt: `Teach transpersonal psychology as it appears across the entheogen archive.`, mode: 'scholar' })],
        [action('therapy', L('🛋 Psychedelic Therapy'), 'prompt', { prompt: `Teach psychedelic therapy in the archive: healing, preparation, setting, transference, integration, and caution.`, mode: 'scholar' })],
        [action('religion', L('⛩ Religion & Mysticism'), 'prompt', { prompt: `Teach religion and mysticism in relation to entheogens: sacrament, revelation, gnosis, and disciplined interpretation.`, mode: 'scholar' })],
        [action('creativity', L('🎨 Creativity & Novelty'), 'prompt', { prompt: `Teach creativity, novelty, and imagination in the entheogen archive.`, mode: 'scholar' })],
        [action('ecology', L('🌎 Ecology & plant intelligence'), 'prompt', { prompt: `Teach ecology and plant intelligence as they appear in the entheogen archive.`, mode: 'scholar' })],
        [action('compare', L('⚖️ Compare schools'), 'prompt', { prompt: `Compare the major schools in the entheogen archive: transpersonal, shamanic, clinical, philosophical, and skeptical.`, mode: 'school_compare' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
      'entheogen:history': { title: L('🏛 History & Philosophy'), buttons: [
        [action('ancient', L('🏺 Ancient Mysteries'), 'prompt', { prompt: `Teach the ancient mysteries and sacred plants in the entheogen archive.`, mode: 'historian' })],
        [action('modern', L('📻 20th-century revival'), 'prompt', { prompt: `Teach the 20th-century revival of psychedelic and entheogenic culture.`, mode: 'historian' })],
        [action('ethics', L('⚖️ Ethics of entheogens'), 'prompt', { prompt: `Teach the ethics of entheogens: appropriation, commercialization, harm, reverence, and responsibility.`, mode: 'scholar' })],
        [action('reality', L('🪞 What is revealed?'), 'prompt', { prompt: `What is revealed in entheogenic states according to the archive? Compare mystical, phenomenological, and skeptical frames.`, mode: 'scholar' })],
        [action('death', L('☥ Death & rebirth'), 'prompt', { prompt: `Teach death and rebirth themes across the entheogen archive.`, mode: 'scholar' })],
        [action('questions', L('❓ Provoking questions'), 'prompt', { prompt: `Develop a set of provoking philosophical questions around entheogens, mystery, psyche, and revelation.`, mode: 'scholar' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'entheogen:root' })],
      ]},
    }
    return entheogenScreens[menuKey] ?? entheogenScreens['entheogen:root']
  }

  const tarotRoot: MenuScreen = {
    title: L('🎴 The Cartomancer', '🎴 Kartomans', '🎴 Картомант'),
    buttons: [
      [action('daily-card', L('🃏 Daily Card', '🃏 Günlük Kart', '🃏 Карта дня'), 'prompt', { prompt: 'Draw one tarot card for my current situation and interpret it as The Cartomancer.', mode: 'reading', displayText: L('🃏 Daily Card') }), action('readings', L('🔮 Readings', '🔮 Okumalar', '🔮 Расклады'), 'submenu', { nextMenu: 'tarot:spreads' })],
      [action('study', L('📚 Deep Study', '📚 Derin İnceleme', '📚 Глубокое изучение'), 'submenu', { nextMenu: 'tarot:study' }), action('shadow', L('🌑 Shadow Work', '🌑 Gölge Çalışması', '🌑 Теневая работа'), 'submenu', { nextMenu: 'tarot:shadow' })],
      [action('arcana', L('✨ Browse Arcana', '✨ Arkanayı Gez', '✨ Просмотреть Арканы'), 'submenu', { nextMenu: 'tarot:arcana' }), action('learn', L('🎓 Learning', '🎓 Öğrenme', '🎓 Обучение'), 'submenu', { nextMenu: 'tarot:learn' })],
      ...genericRows,
    ],
  }

  const tarotScreens: Record<string, MenuScreen> = {
    'tarot:root': tarotRoot,
    'tarot:spreads': {
      title: L('🔮 Choose your spread', '🔮 Açılım seç', '🔮 Выбери расклад'),
      buttons: [
        [action('single', L('🃏 Single Card'), 'prompt', { prompt: 'Perform a single-card Tarot reading for my current situation as The Cartomancer.', mode: 'reading' })],
        [action('three', L('🔮 Past·Present·Future'), 'prompt', { prompt: 'Perform a Past, Present, Future Tarot reading for my current situation as The Cartomancer.', mode: 'reading' })],
        [action('shadow-spread', L('🌗 Shadow & Light'), 'prompt', { prompt: 'Perform a Shadow and Light Tarot reading for my current situation as The Cartomancer.', mode: 'reading' })],
        [action('crossroads', L('⚔️ Crossroads (4)'), 'prompt', { prompt: 'Perform a four-card Crossroads Tarot reading for my current situation as The Cartomancer.', mode: 'reading' })],
        [action('horseshoe', L('🌙 Horseshoe (5)'), 'prompt', { prompt: 'Perform a five-card Horseshoe Tarot reading for my current situation as The Cartomancer.', mode: 'reading' })],
        [action('celtic', L('✡️ Celtic Cross (10)'), 'prompt', { prompt: 'Perform a Celtic Cross Tarot reading for my current situation as The Cartomancer.', mode: 'reading' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tarot:root' })],
      ],
    },
    'tarot:study': {
      title: L('📚 Deep Study'),
      buttons: [
        [action('qabalah', L('⚗️ Qabalah & Tree of Life'), 'prompt', { prompt: 'What is the structure of the Qabalistic Tarot system? Give an overview of how the Tree of Life maps to the 78 cards, citing Wang, Case, and Mathers.', mode: 'qabalah' })],
        [action('astro', L('🌟 Astrology Correspondences'), 'prompt', { prompt: 'Give an overview of astrological correspondences in the Tarot — planets to Major Arcana, decans to pips, and the four suits to elements. Reference Anthony Louis and the Golden Dawn system.', mode: 'astro' })],
        [action('numerology', L('🔢 Numerology & Number Keys'), 'prompt', { prompt: 'Give an overview of Tarot numerology — how numbers 1–10 function across the four suits and Major Arcana. Reference Paul Foster Case and Greer\'s Constellations.', mode: 'numerology' })],
        [action('deck-compare', L('🗃️ Deck Comparison'), 'prompt', { prompt: 'Compare the three major Tarot traditions — RWS, Thoth, and Marseille — in terms of their philosophy, symbolism, and reading approach. What does each tradition uniquely offer?', mode: 'deck_compare' })],
        [action('schools', L('🏛️ Reading Schools'), 'prompt', { prompt: 'Compare the three primary Tarot reading schools: Traditional/Divinatory, Esoteric/Initiatic, and Psychological/Intuitive. Include the Marseille Intuitive school.', mode: 'school_compare' })],
        [action('history', L('📜 History & Origins'), 'prompt', { prompt: 'Give a complete overview of the documented history and transmission of the Tarot from the Visconti-Sforza decks to the present.', mode: 'historian' })],
        [action('talisman', L('🔮 Magic & Talismans'), 'prompt', { prompt: 'Give an overview of how the Tarot is used in magical and ritual practice — from Eliphas Levi and the Golden Dawn to Tyson\'s Portable Magic and the Ciceros\' Tarot Talismans.', mode: 'talisman' })],
        [action('geomancy', L('🌿 Geomancy & Tarot'), 'prompt', { prompt: 'Explain how geomancy and Tarot are integrated in Anthony Louis\'s Geomantic Tarot Spread system. Give an overview of the sixteen geomantic figures and their Tarot correspondences.', mode: 'geomancy' })],
        [action('pathwork', L('🧘 Pathworking'), 'prompt', { prompt: 'Introduce the practice of Tarot pathworking — what it is, how it works, and how to begin. Reference Gareth Knight, Bill Heidrick, and Mouni Sadhu.', mode: 'pathwork' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tarot:root' })],
      ],
    },
    'tarot:shadow': {
      title: L('🌑 Shadow Work'),
      buttons: [
        [action('devil', L('🌑 The Devil'), 'prompt', { prompt: 'Shadow work for The Devil: shadow aspect, the question it holds, integration path, journaling prompt. Jette/Greer.', mode: 'shadow' })],
        [action('tower', L('🌑 The Tower'), 'prompt', { prompt: 'Shadow work for The Tower: shadow aspect, the question it holds, integration path, journaling prompt. Jette/Greer.', mode: 'shadow' })],
        [action('death', L('🌑 Death'), 'prompt', { prompt: 'Shadow work for Death: shadow aspect, the question it holds, integration path, journaling prompt. Jette/Greer.', mode: 'shadow' })],
        [action('moon', L('🌑 The Moon'), 'prompt', { prompt: 'Shadow work for The Moon: shadow aspect, the question it holds, integration path, journaling prompt. Jette/Greer.', mode: 'shadow' })],
        [action('five-cups', L('🌑 Five of Cups'), 'prompt', { prompt: 'Shadow work for Five of Cups: shadow aspect, the question it holds, integration path, journaling prompt. Jette/Greer.', mode: 'shadow' })],
        [action('nine-swords', L('🌑 Nine of Swords'), 'prompt', { prompt: 'Shadow work for Nine of Swords: shadow aspect, the question it holds, integration path, journaling prompt. Jette/Greer.', mode: 'shadow' })],
        [action('random-shadow', L('🎲 Random Shadow Card'), 'prompt', { prompt: 'Draw a powerful shadow-work Tarot card and offer a shadow reading with integration and a journaling prompt.', mode: 'shadow' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tarot:root' })],
      ],
    },
    'tarot:learn': {
      title: L('🎓 Learning Paths'),
      buttons: [
        [action('beginner', L('🌱 Absolute Beginner'), 'prompt', { prompt: 'Create a structured Tarot learning path for an absolute beginner. Use Joan Bunning, Biddy Tarot, and Rachel Pollack as anchors. Include clear stages and next steps.', mode: 'teacher' })],
        [action('intermediate', L('🔥 Intermediate Practitioner'), 'prompt', { prompt: 'Create an intermediate Tarot study path for a working reader. Include Greer, court cards, reversals, spreads, and the Celtic Cross.', mode: 'teacher' })],
        [action('esoteric', L('⚗️ Esoteric & Initiatic'), 'prompt', { prompt: 'Create an esoteric Tarot study path focused on Golden Dawn, Case, Wang, Thoth, Tree of Life, and astrological correspondences.', mode: 'teacher' })],
        [action('shadow-psych', L('🌑 Shadow & Psychology'), 'prompt', { prompt: 'Create a shadow-and-psychology Tarot study path using Greer, Jette, and depth-psychology reading approaches.', mode: 'teacher' })],
        [action('magical', L('🔮 Magical & Ritual Arts'), 'prompt', { prompt: 'Create a magical-and-ritual Tarot study path using Tyson, the Ciceros, De Biasi, and Gareth Knight.', mode: 'teacher' })],
        [action('historian', L('📜 Historical Research'), 'prompt', { prompt: 'Create a historical Tarot research path from the early decks through Marseille, occult revival, RWS, and Thoth.', mode: 'teacher' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tarot:root' })],
      ],
    },
    'tarot:arcana': {
      title: L('✨ Browse the Arcana'),
      buttons: [
        [action('majors', L('✨ Major Arcana (22)'), 'submenu', { nextMenu: 'tarot:majors' })],
        [action('cups', L('🌊 Cups (14)'), 'submenu', { nextMenu: 'tarot:suit:Cups' }), action('pentacles', L('🌿 Pentacles (14)'), 'submenu', { nextMenu: 'tarot:suit:Pentacles' })],
        [action('swords', L('💨 Swords (14)'), 'submenu', { nextMenu: 'tarot:suit:Swords' }), action('wands', L('🔥 Wands (14)'), 'submenu', { nextMenu: 'tarot:suit:Wands' })],
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tarot:root' })],
      ],
    },
    'tarot:majors': {
      title: L('✨ The 22 Major Arcana'),
      buttons: [
        ...Array.from({ length: Math.ceil(tarotMajors.length / 2) }, (_, i) => {
          const pair = tarotMajors.slice(i * 2, i * 2 + 2)
          return pair.map((card) => action(`card:${card}`, L(card), 'submenu', { nextMenu: `tarot:card:${card}` }))
        }),
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tarot:arcana' })],
      ],
    },
  }

  for (const suit of ['Cups', 'Pentacles', 'Swords', 'Wands']) {
    tarotScreens[`tarot:suit:${suit}`] = {
      title: L(`✨ ${suit}`),
      buttons: [
        ...Array.from({ length: 7 }, (_, i) => {
          const pair = suitCards(suit).slice(i * 2, i * 2 + 2)
          return pair.map((card) => action(`card:${card}`, L(card), 'submenu', { nextMenu: `tarot:card:${card}` }))
        }),
        [action('back', L('« Back', '« Geri', '« Назад'), 'back', { nextMenu: 'tarot:arcana' })],
      ],
    }
  }

  if (menuKey.startsWith('tarot:card:')) {
    const card = currentCard || menuKey.replace('tarot:card:', '')
    return {
      title: L(`🎴 ${card}`),
      buttons: cardAnalysisButtons(card),
    }
  }

  return tarotScreens[menuKey] ?? tarotRoot
}
