
export type OraclePack = 'tao' | 'tarot' | 'tantra' | 'entheogen' | 'sufi' | 'dreamwalker' | 'spiritual_sovereign' 
export type UiLang = 'en' | 'tr' | 'ru'

export type OracleMode =
  | 'oracle'
  | 'seeker'
  | 'scholar'
  | 'quote'
  | 'reading'
  | 'contemplation'
  | 'practice'
  | 'teacher'
  | 'historian'
  | 'deck_compare'
  | 'qabalah'
  | 'shadow'
  | 'pathwork'
  | 'astro'
  | 'numerology'
  | 'talisman'
  | 'geomancy'
  | 'school_compare'
  | 'dharana'
  | 'chakra'
  | 'kundalini'
  | 'shiva_shakti'
  | 'vedanta'
  | 'surrender'
  | 'transpersonal'
  | 'shamanic'
  | 'ethnobotany'
  | 'pharmacology'
  | 'harm_reduction'
  | 'entity'
  | 'guide'
  | 'philosophy'
  | 'correspondence'
  | 'tariqa'
  | 'maqam'
  | 'dhikr'
  | 'poetry'
  | 'metaphysics'
  | 'saint'
  | 'adab'
  | 'dreamwork'
  | 'lucid'
  | 'dream_yoga'
  | 'astral'
  | 'remote_viewing'
  | 'interpretation'
  | 'sleep_practice'
  | 'checklist'
  | 'blessing'
  | 'symbology'
  | 'magick'
  | 'affirmation'
  | 'recitation'
  | 'theurgy'

export type MessageRole = 'user' | 'oracle' | 'system'

export interface ChatMessage {
  id: string
  role: MessageRole
  text: string
  audioUrl?: string | null
  mode?: OracleMode
  pack?: OraclePack
}

export interface AskResponse {
  answer: string
  pack: OraclePack
  mode: OracleMode
  sources?: Array<{
    source: string
    chunk?: number | null
    distance?: number | null
    text?: string | null
  }>
}

export interface OracleModeOption {
  value: OracleMode
  label: Record<UiLang, string>
  voiceEnabled: boolean
}

export interface OraclePackConfig {
  key: OraclePack
  emoji: string
  title: Record<UiLang, string>
  subtitle: Record<UiLang, string>
  onlineLabel: Record<UiLang, string>
  starterPrompts: Record<UiLang, string[]>
  defaultMode: OracleMode
  modes: OracleModeOption[]
}

const label = (en: string, tr: string, ru: string) => ({ en, tr, ru })

export const ORACLE_CONFIG: Record<OraclePack, OraclePackConfig> = {
  tao: {
    key: 'tao',
    emoji: '☯️',
    title: label('Tao Oracle', 'Tao Kehaneti', 'Оракул Дао'),
    subtitle: label('Flow with the uncarved block', 'Yontulmamış blok gibi ak', 'Следуй потоку неразделанного блока'),
    onlineLabel: label('Live', 'Canlı', 'Онлайн'),
    defaultMode: 'oracle',
    starterPrompts: {
      en: ['What does the Tao say about patience?', 'Why do obstacles appear?', 'How should I approach a difficult decision?', 'Share wisdom for today.'],
      tr: ['Tao sabır hakkında ne söylüyor?', 'Engeller neden ortaya çıkar?', 'Zor bir karara nasıl yaklaşmalıyım?', 'Bugün için bir bilgelik paylaş.'],
      ru: ['Что Дао говорит о терпении?', 'Почему появляются препятствия?', 'Как подойти к трудному решению?', 'Поделись мудростью на сегодня.'],
    },
    modes: [
      { value: 'oracle', label: label('Oracle', 'Kehanet', 'Оракул'), voiceEnabled: true },
      { value: 'seeker', label: label('Seeker', 'Arayıcı', 'Искатель'), voiceEnabled: true },
      { value: 'scholar', label: label('Scholar', 'Bilgin', 'Учёный'), voiceEnabled: false },
      { value: 'quote', label: label('Quote', 'Alıntı', 'Цитата'), voiceEnabled: true },
    ],
  },
  tarot: {
    key: 'tarot',
    emoji: '🎴',
    title: label('Tarot Oracle', 'Tarot Kehaneti', 'Оракул Таро'),
    subtitle: label('The archetypal journey', 'Arketipsel yolculuk', 'Архетипическое путешествие'),
    onlineLabel: label('Live', 'Canlı', 'Онлайн'),
    defaultMode: 'oracle',
    starterPrompts: {
      en: ['Draw a card for my current situation.', 'Interpret The High Priestess for me.', 'Give me a shadow reading.', 'Compare Marseille and Rider-Waite on The Fool.'],
      tr: ['Şu anki durumum için bir kart çek.', 'Başrahibe kartını yorumla.', 'Bana bir gölge okuması ver.', 'Deli kartında Marsilya ile Rider-Waite farkını karşılaştır.'],
      ru: ['Вытяни карту для моей текущей ситуации.', 'Истолкуй для меня Верховную Жрицу.', 'Сделай для меня теневое чтение.', 'Сравни Марсель и Райдера-Уэйта по карте Шут.'],
    },
    modes: [
      { value: 'oracle', label: label('Oracle', 'Kehanet', 'Оракул'), voiceEnabled: true },
      { value: 'seeker', label: label('Seeker', 'Arayıcı', 'Искатель'), voiceEnabled: true },
      { value: 'reading', label: label('Reading', 'Okuma', 'Чтение'), voiceEnabled: true },
      { value: 'shadow', label: label('Shadow', 'Gölge', 'Тень'), voiceEnabled: true },
      { value: 'pathwork', label: label('Pathwork', 'Yol Çalışması', 'Путевая работа'), voiceEnabled: true },
      { value: 'teacher', label: label('Teacher', 'Öğretmen', 'Учитель'), voiceEnabled: false },
      { value: 'historian', label: label('Historian', 'Tarihçi', 'Историк'), voiceEnabled: false },
      { value: 'deck_compare', label: label('Deck Compare', 'Deste Karşılaştır', 'Сравнить колоды'), voiceEnabled: false },
      { value: 'qabalah', label: label('Qabalah', 'Kabala', 'Каббала'), voiceEnabled: false },
      { value: 'astro', label: label('Astrology', 'Astroloji', 'Астрология'), voiceEnabled: false },
      { value: 'numerology', label: label('Numerology', 'Numeroloji', 'Нумерология'), voiceEnabled: false },
      { value: 'talisman', label: label('Talisman', 'Tılsım', 'Талисман'), voiceEnabled: false },
      { value: 'geomancy', label: label('Geomancy', 'Geomansi', 'Геомантия'), voiceEnabled: false },
      { value: 'school_compare', label: label('School Compare', 'Okul Karşılaştır', 'Сравнить школы'), voiceEnabled: false },
      { value: 'quote', label: label('Quote', 'Alıntı', 'Цитата'), voiceEnabled: true },
    ],
  },
  tantra: {
    key: 'tantra',
    emoji: '🔥',
    title: label('Tantra Oracle', 'Tantra Kehaneti', 'Оракул Тантры'),
    subtitle: label('Tantra · Vedanta · Samadhi · Kundalini', 'Tantra · Vedanta · Samadhi · Kundalini', 'Тантра · Веданта · Самадхи · Кундалини'),
    onlineLabel: label('Live', 'Canlı', 'Онлайн'),
    defaultMode: 'oracle',
    starterPrompts: {
      en: ['Give me a dharana for today.', 'Explain kundalini safely and clearly.', 'Teach me about Shiva and Shakti.', 'Offer one practice for surrender.'],
      tr: ['Bugün için bana bir dharana ver.', 'Kundaliniyi güvenli ve açık şekilde açıkla.', 'Bana Şiva ve Şaktiyi öğret.', 'Teslimiyet için bir pratik öner.'],
      ru: ['Дай мне одну дхарану на сегодня.', 'Объясни кундалини ясно и безопасно.', 'Научи меня о Шиве и Шакти.', 'Предложи одну практику surrender.'],
    },
    modes: [
      { value: 'oracle', label: label('Oracle', 'Kehanet', 'Оракул'), voiceEnabled: true },
      { value: 'seeker', label: label('Seeker', 'Arayıcı', 'Искатель'), voiceEnabled: true },
      { value: 'dharana', label: label('Dharana', 'Dharana', 'Дхарана'), voiceEnabled: true },
      { value: 'surrender', label: label('Surrender', 'Teslimiyet', 'Сдача'), voiceEnabled: true },
      { value: 'chakra', label: label('Chakra', 'Çakra', 'Чакра'), voiceEnabled: false },
      { value: 'kundalini', label: label('Kundalini', 'Kundalini', 'Кундалини'), voiceEnabled: false },
      { value: 'shiva_shakti', label: label('Shiva–Shakti', 'Şiva–Şakti', 'Шива–Шакти'), voiceEnabled: false },
      { value: 'vedanta', label: label('Vedanta', 'Vedanta', 'Веданта'), voiceEnabled: false },
      { value: 'scholar', label: label('Scholar', 'Bilgin', 'Учёный'), voiceEnabled: false },
      { value: 'teacher', label: label('Teacher', 'Öğretmen', 'Учитель'), voiceEnabled: false },
      { value: 'historian', label: label('Historian', 'Tarihçi', 'Историк'), voiceEnabled: false },
      { value: 'school_compare', label: label('School Compare', 'Okul Karşılaştır', 'Сравнить школы'), voiceEnabled: false },
      { value: 'quote', label: label('Quote', 'Alıntı', 'Цитата'), voiceEnabled: true },
    ],
  },
  entheogen: {
    key: 'entheogen',
    emoji: '🍄',
    title: label('Esoteric Entheogen', 'Ezoterik Entheogen', 'Эзотерический Энтеоген'),
    subtitle: label('Entheogens · Mysticism · Shamanism · Consciousness', 'Entheogenler · Mistisizm · Şamanizm · Bilinç', 'Энтеогены · Мистицизм · Шаманизм · Сознание'),
    onlineLabel: label('Live', 'Canlı', 'Онлайн'),
    defaultMode: 'oracle',
    starterPrompts: {
      en: ['What can plant wisdom teach about fear?', 'Offer a reflection on ego dissolution.', 'Speak about integration after a profound experience.', 'Give a short contemplative quote.'],
      tr: ['Bitki bilgeliği korku hakkında ne öğretebilir?', 'Ego çözülmesi üzerine bir düşünce sun.', 'Derin bir deneyimden sonra entegrasyon hakkında konuş.', 'Kısa bir tefekkür alıntısı ver.'],
      ru: ['Чему мудрость растений может научить о страхе?', 'Дай размышление о растворении эго.', 'Поговори об интеграции после глубокого опыта.', 'Дай короткую созерцательную цитату.'],
    },
    modes: [
      { value: 'oracle', label: label('Oracle', 'Kehanet', 'Оракул'), voiceEnabled: true },
      { value: 'seeker', label: label('Seeker', 'Arayıcı', 'Искатель'), voiceEnabled: true },
      { value: 'reading', label: label('Reading', 'Okuma', 'Чтение'), voiceEnabled: true },
      { value: 'guide', label: label('Guide', 'Rehber', 'Проводник'), voiceEnabled: true },
      { value: 'quote', label: label('Quote', 'Alıntı', 'Цитата'), voiceEnabled: true },
      { value: 'transpersonal', label: label('Transpersonal', 'Transpersonel', 'Трансперсональный'), voiceEnabled: false },
      { value: 'shamanic', label: label('Shamanic', 'Şamanik', 'Шаманский'), voiceEnabled: false },
      { value: 'ethnobotany', label: label('Ethnobotany', 'Etnobotanik', 'Этноботаника'), voiceEnabled: false },
      { value: 'pharmacology', label: label('Pharmacology', 'Farmakoloji', 'Фармакология'), voiceEnabled: false },
      { value: 'harm_reduction', label: label('Harm Reduction', 'Zarar Azaltma', 'Снижение вреда'), voiceEnabled: false },
      { value: 'entity', label: label('Entities', 'Varlıklar', 'Сущности'), voiceEnabled: false },
      { value: 'philosophy', label: label('Philosophy', 'Felsefe', 'Философия'), voiceEnabled: false },
      { value: 'correspondence', label: label('Correspondence', 'Korespondans', 'Соответствия'), voiceEnabled: false },
      { value: 'school_compare', label: label('School Compare', 'Okul Karşılaştır', 'Сравнить школы'), voiceEnabled: false },
      { value: 'scholar', label: label('Scholar', 'Bilgin', 'Учёный'), voiceEnabled: false },
    ],
  },
  sufi: {
    key: 'sufi',
    emoji: '🌙',
    title: label('Sufi Mystic', 'Sufi Mistiği', 'Суфийский Мистик'),
    subtitle: label('Sufism · Dhikr · Heart Knowledge · Poetry', 'Tasavvuf · Zikir · Kalp Bilgisi · Şiir', 'Суфизм · Зикр · Знание сердца · Поэзия'),
    onlineLabel: label('Live', 'Canlı', 'Онлайн'),
    defaultMode: 'oracle',
    starterPrompts: {
      en: ['What is the difference between maqam and hal in Sufism?', 'Compare the Naqshbandi, Mevlevi, Chishti, Qadiri, and Shadhili paths.', 'How do fana and baqa differ from ordinary ego-loss talk?', 'Explain Sufi symbolism of the Beloved, wine, the reed flute, and the moth.'],
      tr: ['Sufizmde makam ile hal arasındaki fark nedir?', 'Nakşibendi, Mevlevi, Çişti, Kadiri ve Şazeli yollarını karşılaştır.', 'Fena ve beka sıradan ego kaybı söyleminden nasıl ayrılır?', 'Mahbub, şarap, ney ve pervane sembollerini açıkla.'],
      ru: ['В чём разница между макамом и халем в суфизме?', 'Сравни пути Накшбанди, Мевлеви, Чишти, Кадири и Шазили.', 'Чем фана и бака отличаются от обычных разговоров о потере эго?', 'Объясни суфийскую символику Возлюбленного, вина, тростниковой флейты и мотылька.'],
    },
    modes: [
      { value: 'oracle', label: label('Oracle', 'Kehanet', 'Оракул'), voiceEnabled: true },
      { value: 'seeker', label: label('Seeker', 'Arayıcı', 'Искатель'), voiceEnabled: true },
      { value: 'reading', label: label('Reading', 'Okuma', 'Чтение'), voiceEnabled: true },
      { value: 'quote', label: label('Quote', 'Alıntı', 'Цитата'), voiceEnabled: true },
      { value: 'poetry', label: label('Poetry', 'Şiir', 'Поэзия'), voiceEnabled: true },
      { value: 'metaphysics', label: label('Metaphysics', 'Metafizik', 'Метафизика'), voiceEnabled: true },
      { value: 'dhikr', label: label('Dhikr', 'Zikir', 'Зикр'), voiceEnabled: false },
      { value: 'tariqa', label: label('Tariqa', 'Tarikat', 'Тарика'), voiceEnabled: false },
      { value: 'maqam', label: label('Maqam', 'Makam', 'Макам'), voiceEnabled: false },
      { value: 'saint', label: label('Saint', 'Veliler', 'Святые'), voiceEnabled: false },
      { value: 'adab', label: label('Adab', 'Edep', 'Адаб'), voiceEnabled: false },
      { value: 'dreamwork', label: label('Dreamwork', 'Rüya Çalışması', 'Работа со снами'), voiceEnabled: false },
      { value: 'teacher', label: label('Teacher', 'Öğretmen', 'Учитель'), voiceEnabled: false },
      { value: 'historian', label: label('Historian', 'Tarihçi', 'Историк'), voiceEnabled: false },
      { value: 'school_compare', label: label('School Compare', 'Okul Karşılaştır', 'Сравнить школы'), voiceEnabled: false },
      { value: 'scholar', label: label('Scholar', 'Bilgin', 'Учёный'), voiceEnabled: false },
    ],
  },

  dreamwalker: {
    key: 'dreamwalker',
    emoji: '🌌',
    title: label('Dreamwalker', 'Rüya Gezgini', 'Путник Снов'),
    subtitle: label('Lucid Dreaming · Dream Yoga · Astral · Remote Viewing', 'Bilinçli Rüya · Rüya Yogası · Astral · Uzak Görüş', 'Осознанные сны · Йога сна · Астрал · Дистанционное видение'),
    onlineLabel: label('Archive live', 'Arşiv canlı', 'Архив онлайн'),
    defaultMode: 'oracle',
    starterPrompts: {
      en: ['How do I start lucid dreaming safely?', 'Explain dream yoga in a grounded way.', 'What is the difference between astral projection and lucid dreaming?', 'Help me interpret a recurring dream symbol.'],
      tr: ['Bilinçli rüyaya güvenli şekilde nasıl başlarım?', 'Rüya yogasını sağlam bir dille açıkla.', 'Astral projeksiyon ile bilinçli rüya arasındaki fark nedir?', 'Tekrarlayan bir rüya sembolünü yorumlamama yardım et.'],
      ru: ['Как безопасно начать практику осознанных снов?', 'Объясни йогу сна приземлённо и ясно.', 'В чём разница между астральной проекцией и осознанным сном?', 'Помоги истолковать повторяющийся символ сна.'],
    },
    modes: [
      { value: 'oracle', label: label('Oracle', 'Kehanet', 'Оракул'), voiceEnabled: true },
      { value: 'seeker', label: label('Seeker', 'Arayıcı', 'Искатель'), voiceEnabled: true },
      { value: 'reading', label: label('Reading', 'Okuma', 'Чтение'), voiceEnabled: true },
      { value: 'quote', label: label('Quote', 'Alıntı', 'Цитата'), voiceEnabled: true },
      { value: 'dreamwork', label: label('Dreamwork', 'Rüya Çalışması', 'Работа со сном'), voiceEnabled: true },
      { value: 'lucid', label: label('Lucid Dreaming', 'Bilinçli Rüya', 'Осознанные сны'), voiceEnabled: true },
      { value: 'dream_yoga', label: label('Dream Yoga', 'Rüya Yogası', 'Йога сна'), voiceEnabled: false },
      { value: 'checklist', label: label('Checklist', 'Kontrol Listesi', 'Чеклист'), voiceEnabled: false },
      { value: 'astral', label: label('Astral', 'Astral', 'Астрал'), voiceEnabled: false },
      { value: 'remote_viewing', label: label('Remote Viewing', 'Uzak Görüş', 'Дистанционное видение'), voiceEnabled: false },
      { value: 'interpretation', label: label('Interpretation', 'Yorumlama', 'Толкование'), voiceEnabled: false },
      { value: 'sleep_practice', label: label('Practice', 'Pratik', 'Практика'), voiceEnabled: false },
      { value: 'teacher', label: label('Teacher', 'Öğretmen', 'Учитель'), voiceEnabled: false },
      { value: 'historian', label: label('Historian', 'Tarihçi', 'Историк'), voiceEnabled: false },
      { value: 'school_compare', label: label('School Compare', 'Okul Karşılaştır', 'Сравнить школы'), voiceEnabled: false },
      { value: 'scholar', label: label('Scholar', 'Bilgin', 'Учёный'), voiceEnabled: false },
    ],
  },

  spiritual_sovereign: {
    key: 'spiritual_sovereign',
    emoji: '⚡',
    title: label('Spiritual Sovereignty', 'Manevi Egemenlik', 'Духовный Суверенитет'),
    subtitle: label('Sanctuary · Autonomy · Sacred Law · Gnosis', 'H sanctuary · Özerklik · Kutsal Hukuk · Gnosis', 'Санктуарий · Автономия · Священный Закон · Гнозис'),
    onlineLabel: label('Live', 'Canlı', 'Онлайн'),
    defaultMode: 'oracle',
    starterPrompts: {
      en: ['What does spiritual sovereignty mean in practice?', 'How do I discern my own authority in spiritual matters?', 'Teach me about sacred law and conscience.', 'What is the relationship between autonomy and surrender?'],
      tr: ['Manevi egemenlik pratikte ne anlama gelir?', 'Manevi konularda kendi otoritemi nasıl belirlerim?', 'Bana kutsal hukuk ve vicdan hakkında öğret.', 'Özerklik ve teslimiyet arasındaki ilişki nedir?'],
      ru: ['Что духовный суверенитет означает на практике?', 'Как мне различить собственный авторитет в духовных делах?', 'Научи меня священному закону и совести.', 'Каково отношение между автономией и сдачей?'],
    },
    modes: [
      { value: 'oracle', label: label('Oracle', 'Kehanet', 'Оракул'), voiceEnabled: true },
      { value: 'seeker', label: label('Seeker', 'Arayıcı', 'Искатель'), voiceEnabled: true },
      { value: 'reading', label: label('Reading', 'Okuma', 'Чтение'), voiceEnabled: true },
      { value: 'quote', label: label('Quote', 'Alıntı', 'Цитата'), voiceEnabled: true },
      { value: 'guide', label: label('Guide', 'Rehber', 'Проводник'), voiceEnabled: true },
      { value: 'correspondence', label: label('Correspondence', 'Korespondans', 'Соответствия'), voiceEnabled: true },
      { value: 'blessing', label: label('Blessing', 'Bereket', 'Благословение'), voiceEnabled: true },
      { value: 'affirmation', label: label('Affirmation', 'Tekit', 'Аффирмация'), voiceEnabled: true },
      { value: 'recitation', label: label('Recitation', 'Tilavet', 'Чтение'), voiceEnabled: false },
      { value: 'philosophy', label: label('Philosophy', 'Felsefe', 'Философия'), voiceEnabled: false },
      { value: 'theurgy', label: label('Theurgy', 'Theourgia', 'Теургия'), voiceEnabled: false },
      { value: 'magick', label: label('Magick', 'Büyü', 'Магия'), voiceEnabled: false },
      { value: 'symbology', label: label('Symbology', 'Sembololoji', 'Симвология'), voiceEnabled: false },
      { value: 'teacher', label: label('Teacher', 'Ögretmen', 'Учитель'), voiceEnabled: false },
      { value: 'scholar', label: label('Scholar', 'Bilgin', 'Учёный'), voiceEnabled: false },
    ],
  },
}


export const UI_COPY = {
  title: label('Select Oracle', 'Kehaneti Seç', 'Выберите Оракула'),
  subtitle: label(
    'Speak or type your question. Curated archives and living oracle packs power this portal.',
    'Sorunu konuş ya da yaz. Bu portalı küratörlü arşivler ve yaşayan kahin paketleri güçlendiriyor.',
    'Говорите или печатайте вопрос. Этот портал питается кураторскими архивами и живыми пакетами оракулов.'
  ),
  language: label('Language', 'Dil', 'Язык'),
  mode: label('Mode', 'Mod', 'Режим'),
  voiceReply: label('Voice reply', 'Sesli yanıt', 'Голосовой ответ'),
  voiceAvailable: label('Voice available', 'Ses mevcut', 'Голос доступен'),
  voiceUnavailable: label('No voice for this mode', 'Bu mod için ses yok', 'Для этого режима нет голоса'),
  placeholder: label('Ask the oracle…', 'Kehanete sor…', 'Спроси оракула…'),
  send: label('Send', 'Gönder', 'Отправить'),
  clear: label('Clear Chat', 'Sohbeti Temizle', 'Очистить чат'),
  online: label('Online', 'Çevrimiçi', 'Онлайн'),
  offline: label('Offline', 'Çevrimdışı', 'Оффлайн'),
  thinking: label('Sacred transmission in progress', 'Kutsal aktarım sürüyor', 'Идёт священная передача'),
  record: label('Record', 'Kaydet', 'Записать'),
  transcribing: label('Transcribing voice…', 'Ses yazıya çevriliyor…', 'Голос расшифровывается…'),
  failed: label('The oracle could not be reached.', 'Kehanete ulaşılamadı.', 'Не удалось связаться с оракулом.'),
  browserMicUnsupported: label('This browser does not support microphone recording.', 'Bu tarayıcı mikrofon kaydını desteklemiyor.', 'Этот браузер не поддерживает запись с микрофона.'),
  emptyState: label('Choose a tradition and begin your inquiry.', 'Bir gelenek seç ve sorgunu başlat.', 'Выберите традицию и начните свой вопрос.'),
  answerLanguage: label('Answer language', 'Yanıt dili', 'Язык ответа'),
}

export const FOLLOWUPS: Record<OraclePack, Record<UiLang, string[]>> = {
  tao: {
    en: ['Go deeper.', 'Give me a practical step.', 'Turn that into a daily reflection.'],
    tr: ['Daha derine in.', 'Bunu pratik bir adıma çevir.', 'Bunu günlük bir tefekküre dönüştür.'],
    ru: ['Углуби это.', 'Дай мне практический шаг.', 'Преврати это в ежедневное размышление.'],
  },
  tarot: {
    en: ['Clarify the symbolism.', 'How would this read in shadow mode?', 'Relate this to the querent’s next step.'],
    tr: ['Sembolizmi netleştir.', 'Bu gölge modunda nasıl okunur?', 'Bunu danışanın bir sonraki adımıyla ilişkilendir.'],
    ru: ['Проясни символизм.', 'Как это читалось бы в теневом режиме?', 'Свяжи это со следующим шагом вопрошающего.'],
  },
  tantra: {
    en: ['Offer a simple practice.', 'Explain the subtle-body layer.', 'Make this safer and more grounded.'],
    tr: ['Basit bir pratik öner.', 'Süptil beden katmanını açıkla.', 'Bunu daha güvenli ve daha sağlam hale getir.'],
    ru: ['Предложи простую практику.', 'Объясни слой тонкого тела.', 'Сделай это более безопасным и заземлённым.'],
  },
  entheogen: {
    en: ['Focus on integration.', 'Compare plant, molecule, and ritual context.', 'Turn this into a concise quote.'],
    tr: ['Entegrasyona odaklan.', 'Bitki, molekül ve ritüel bağlamını karşılaştır.', 'Bunu kısa bir alıntıya dönüştür.'],
    ru: ['Сфокусируйся на интеграции.', 'Сравни растение, молекулу и ритуальный контекст.', 'Преврати это в краткую цитату.'],
  },
  sufi: {
    en: ['Offer a daily contemplation.', 'Compare lineages.', 'Make this more practical and heart-centered.'],
    tr: ['Günlük bir tefekkür ver.', 'Yolları karşılaştır.', 'Bunu daha pratik ve kalp merkezli yap.'],
    ru: ['Дай ежедневное созерцание.', 'Сравни линии передачи.', 'Сделай это более практичным и сердечным.'],
  },
  dreamwalker: {
    en: ['Give me one lucid-dream practice for tonight.', 'Interpret this as dream symbolism, not omen literalism.', 'Compare dream yoga, astral projection, and remote viewing.'],
    tr: ['Bu gece için bir bilinçli rüya pratiği ver.', 'Bunu kehanet değil rüya sembolizmi olarak yorumla.', 'Rüya yogası, astral projeksiyon ve uzak görüş karşılaştır.'],
    ru: ['Дай одну практику осознанного сна на эту ночь.', 'Истолкуй это как символику сна, а не буквальное знамение.', 'Сравни йогу сна, астральную проекцию и дистанционное видение.'],
  },
  spiritual_sovereign: {
    en: ['Give me a daily sovereignty practice.', 'Teach me the Kybalion principle behind this.', 'Make this practical for today.'],
    tr: ['Günlük bir egemenlik pratiği ver.', 'Bunun arkasındaki Kybalion ilkesini öğret.', 'Bunu bugün için pratik hale getir.'],
    ru: ['Дай практику духовного суверенитета на каждый день.', 'Преподай принцип Кибalion, стоящий за этим.', 'Сделай это практичным для сегодня.'],
  },


};


export function t(lang: UiLang, value: Record<UiLang, string>): string {
  return value[lang] ?? value.en
}

export function getModeConfig(pack: OraclePack, mode: OracleMode): OracleModeOption | undefined {
  return ORACLE_CONFIG[pack].modes.find((entry) => entry.value === mode)
}

export function supportsVoiceReply(pack: OraclePack, mode: OracleMode): boolean {
  return Boolean(getModeConfig(pack, mode)?.voiceEnabled)
}

export function nextFollowups(pack: OraclePack, lang: UiLang): string[] {
  return FOLLOWUPS[pack][lang]
}
