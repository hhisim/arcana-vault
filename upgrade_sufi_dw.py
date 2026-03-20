with open('/home/prime/.openclaw/workspace/arcana-vault-real/lib/oracle-menu.ts', 'r') as f:
    content = f.read()

menus_start = 7841
menus_end = 40342
sufi_idx = 37649

new_tail = r"""
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
"""

# Replace everything from sufi:root to end of MENUS object (exclusive of the closing brace)
new_content = content[:sufi_idx] + new_tail

with open('/home/prime/.openclaw/workspace/arcana-vault-real/lib/oracle-menu.ts', 'w') as f:
    f.write(new_content)

print(f"Original: {len(content)} chars")
print(f"New: {len(new_content)} chars")
print(f"Added: {len(new_content) - len(content)} chars")
print("SUCCESS")
