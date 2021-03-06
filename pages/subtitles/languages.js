const obj = {
    // ISO 639-1 Codes

    'aa':           {name: 'Afar', dir: 'ltr'},
    'ab':           {name: 'Аҧсуа', dir: 'ltr'},
    'af':           {name: 'Afrikaans', dir: 'ltr'},
    'ak':           {name: 'Akana', dir: 'ltr'},
    'als':          {name: 'Alemannisch', dir: 'ltr'},
    'am':           {name: 'አማርኛ', dir: 'ltr'},
    'an':           {name: 'Aragonés', dir: 'ltr'},
    'ang':          {name: 'Englisc', dir: 'ltr'},
    'ar':           {name: 'العربية', dir: 'rtl'},
    'arc':          {name: 'ܣܘܪܬ', dir: 'rtl'},
    'as':           {name: 'অসমীয়া', dir: 'ltr'},
    'ast':          {name: 'Asturianu', dir: 'ltr'},
    'av':           {name: 'Авар', dir: 'ltr'},
    'ay':           {name: 'Aymar', dir: 'ltr'},
    'az':           {name: 'Azərbaycanca / آذربايجان', dir: 'ltr'},
    'ba':           {name: 'Башҡорт', dir: 'ltr'},
    'bar':          {name: 'Boarisch', dir: 'ltr'},
    'bat-smg':      {name: 'Žemaitėška', dir: 'ltr'},
    'bcl':          {name: 'Bikol Central', dir: 'ltr'},
    'be':           {name: 'Беларуская', dir: 'ltr'},
    'be-x-old':     {name: 'Беларуская (тарашкевіца)', dir: 'ltr'},
    'bg':           {name: 'Български', dir: 'ltr'},
    'bh':           {name: 'भोजपुरी', dir: 'ltr'},
    'bi':           {name: 'Bislama', dir: 'ltr'},
    'bm':           {name: 'Bamanankan', dir: 'ltr'},
    'bn':           {name: 'বাংলা', dir: 'ltr'},
    'bo':           {name: 'བོད་ཡིག / Bod skad', dir: 'ltr'},
    'bpy':          {name: 'ইমার ঠার/বিষ্ণুপ্রিয়া মণিপুরী', dir: 'ltr'},
    'br':           {name: 'Brezhoneg', dir: 'ltr'},
    'bs':           {name: 'Bosanski', dir: 'ltr'},
    'bug':          {name: 'ᨅᨔ ᨕᨘᨁᨗ / Basa Ugi', dir: 'ltr'},
    'bxr':          {name: 'Буряад хэлэн', dir: 'ltr'},
    'ca':           {name: 'Català', dir: 'ltr'},
    'cdo':          {name: 'Mìng-dĕ̤ng-ngṳ̄ / 閩東語', dir: 'ltr'},
    'ce':           {name: 'Нохчийн', dir: 'ltr'},
    'ceb':          {name: 'Sinugboanong Binisaya', dir: 'ltr'},
    'ch':           {name: 'Chamoru', dir: 'ltr'},
    'cho':          {name: 'Choctaw', dir: 'ltr'},
    'chr':          {name: 'ᏣᎳᎩ', dir: 'ltr'},
    'chy':          {name: 'Tsetsêhestâhese', dir: 'ltr'},
    'closed-zh-tw': {name: '‪中文(台灣)‬', dir: 'ltr'},
    'co':           {name: 'Corsu', dir: 'ltr'},
    'cr':           {name: 'Nehiyaw', dir: 'ltr'},
    'cs':           {name: 'Česky', dir: 'ltr'},
    'csb':          {name: 'Kaszëbsczi', dir: 'ltr'},
    'cu':           {name: 'словѣньскъ / slověnĭskŭ', dir: 'ltr'},
    'cv':           {name: 'Чăваш', dir: 'ltr'},
    'cy':           {name: 'Cymraeg', dir: 'ltr'},
    'da':           {name: 'Dansk', dir: 'ltr'},
    'de':           {name: 'Deutsch', dir: 'ltr'},
    'diq':          {name: 'Zazaki', dir: 'ltr'},
    'dsb':          {name: 'Dolnoserbski', dir: 'ltr'},
    'dv':           {name: 'ދިވެހިބަސް', dir: 'rtl'},
    'dz':           {name: 'ཇོང་ཁ', dir: 'ltr'},
    'ee':           {name: 'Ɛʋɛ', dir: 'ltr'},
    'el':           {name: 'Ελληνικά', dir: 'ltr'},
    'en':           {name: 'English', dir: 'ltr'},
    'eo':           {name: 'Esperanto', dir: 'ltr'},
    'es':           {name: 'Español', dir: 'ltr'},
    'et':           {name: 'Eesti', dir: 'ltr'},
    'eu':           {name: 'Euskara', dir: 'ltr'},
    'ext':          {name: 'Estremeñu', dir: 'ltr'},
    'fa':           {name: 'فارسی', dir: 'rtl'},
    'ff':           {name: 'Fulfulde', dir: 'ltr'},
    'fi':           {name: 'Suomi', dir: 'ltr'},
    'fiu-vro':      {name: 'Võro', dir: 'ltr'},
    'fj':           {name: 'Na Vosa Vakaviti', dir: 'ltr'},
    'fo':           {name: 'Føroyskt', dir: 'ltr'},
    'fr':           {name: 'Français', dir: 'ltr'},
    'frp':          {name: 'Arpitan / francoprovençal', dir: 'ltr'},
    'fur':          {name: 'Furlan', dir: 'ltr'},
    'fy':           {name: 'Frysk', dir: 'ltr'},
    'ga':           {name: 'Gaeilge', dir: 'ltr'},
    'gan':          {name: '贛語', dir: 'ltr'},
    'gbm':          {name: 'गढ़वळी', dir: 'ltr'},
    'gd':           {name: 'Gàidhlig', dir: 'ltr'},
    'gil':          {name: 'Taetae ni kiribati', dir: 'ltr'},
    'gl':           {name: 'Galego', dir: 'ltr'},
    'gn':           {name: 'Avañe\'ẽ', dir: 'ltr'},
    'got':          {name: 'gutisk', dir: 'ltr'},
    'gu':           {name: 'ગુજરાતી', dir: 'ltr'},
    'gv':           {name: 'Gaelg', dir: 'ltr'},
    'ha':           {name: 'هَوُسَ', dir: 'rtl'},
    'hak':          {name: '客家語/Hak-kâ-ngî', dir: 'ltr'},
    'haw':          {name: 'Hawai`i', dir: 'ltr'},
    'he':           {name: 'עברית', dir: 'rtl'},
    'hi':           {name: 'हिन्दी', dir: 'ltr'},
    'ho':           {name: 'Hiri Motu', dir: 'ltr'},
    'hr':           {name: 'Hrvatski', dir: 'ltr'},
    'ht':           {name: 'Krèyol ayisyen', dir: 'ltr'},
    'hu':           {name: 'Magyar', dir: 'ltr'},
    'hy':           {name: 'Հայերեն', dir: 'ltr'},
    'hz':           {name: 'Otsiherero', dir: 'ltr'},
    'ia':           {name: 'Interlingua', dir: 'ltr'},
    'id':           {name: 'Bahasa Indonesia', dir: 'ltr'},
    'ie':           {name: 'Interlingue', dir: 'ltr'},
    'ig':           {name: 'Igbo', dir: 'ltr'},
    'ii':           {name: 'ꆇꉙ / 四川彝语', dir: 'ltr'},
    'ik':           {name: 'Iñupiak', dir: 'ltr'},
    'ilo':          {name: 'Ilokano', dir: 'ltr'},
    'inh':          {name: 'ГӀалгӀай', dir: 'ltr'},
    'io':           {name: 'Ido', dir: 'ltr'},
    'is':           {name: 'Íslenska', dir: 'ltr'},
    'it':           {name: 'Italiano', dir: 'ltr'},
    'iu':           {name: 'ᐃᓄᒃᑎᑐᑦ', dir: 'ltr'},
    'ja':           {name: '日本語', dir: 'ltr'},
    'jbo':          {name: 'Lojban', dir: 'ltr'},
    'jv':           {name: 'Basa Jawa', dir: 'ltr'},
    'ka':           {name: 'ქართული', dir: 'ltr'},
    'kg':           {name: 'KiKongo', dir: 'ltr'},
    'khw':          {name: 'کھوار', dir: 'rtl'},
    'ki':           {name: 'Gĩkũyũ', dir: 'ltr'},
    'kj':           {name: 'Kuanyama', dir: 'ltr'},
    'kk':           {name: 'Қазақша', dir: 'ltr'},
    'kl':           {name: 'Kalaallisut', dir: 'ltr'},
    'km':           {name: 'ភាសាខ្មែរ', dir: 'ltr'},
    'kn':           {name: 'ಕನ್ನಡ', dir: 'ltr'},
    'ko':           {name: '한국어', dir: 'ltr'},
    'kr':           {name: 'Kanuri', dir: 'ltr'},
    'ks':           {name: 'कश्मीरी / كشميري', dir: 'rtl'},
    'ksh':          {name: 'Ripoarisch', dir: 'ltr'},
    'ku':           {name: 'Kurdî / كوردی', dir: 'rtl'},
    'kv':           {name: 'Коми', dir: 'ltr'},
    'kw':           {name: 'Kernewek', dir: 'ltr'},
    'ky':           {name: 'Kırgızca / Кыргызча', dir: 'ltr'},
    'la':           {name: 'Latina', dir: 'ltr'},
    'lad':          {name: 'Dzhudezmo / Djudeo-Espanyol', dir: 'ltr'},
    'lan':          {name: 'Leb Lango / Luo', dir: 'ltr'},
    'lb':           {name: 'Lëtzebuergesch', dir: 'ltr'},
    'lg':           {name: 'Luganda', dir: 'ltr'},
    'li':           {name: 'Limburgs', dir: 'ltr'},
    'lij':          {name: 'Líguru', dir: 'ltr'},
    'lmo':          {name: 'Lumbaart', dir: 'ltr'},
    'ln':           {name: 'Lingála', dir: 'ltr'},
    'lo':           {name: 'ລາວ / Pha xa lao', dir: 'ltr'},
    'lt':           {name: 'Lietuvių', dir: 'ltr'},
    'lv':           {name: 'Latviešu', dir: 'ltr'},
    'lzz':          {name: 'Lazuri / ლაზური', dir: 'ltr'},
    'man':          {name: '官話/官话', dir: 'ltr'},
    'map-bms':      {name: 'Basa Banyumasan', dir: 'ltr'},
    'mg':           {name: 'Malagasy', dir: 'ltr'},
    'mh':           {name: 'Kajin Majel / Ebon', dir: 'ltr'},
    'mi':           {name: 'Māori', dir: 'ltr'},
    'min':          {name: 'Minangkabau', dir: 'ltr'},
    'mk':           {name: 'Македонски', dir: 'ltr'},
    'ml':           {name: 'മലയാളം', dir: 'ltr'},
    'mn':           {name: 'Монгол', dir: 'ltr'},
    'mo':           {name: 'Moldovenească', dir: 'ltr'},
    'mr':           {name: 'मराठी', dir: 'ltr'},
    'ms':           {name: 'Bahasa Melayu', dir: 'ltr'},
    'mt':           {name: 'bil-Malti', dir: 'ltr'},
    'mus':          {name: 'Mvskoke', dir: 'ltr'},
    'mwl':          {name: 'Mirandés', dir: 'ltr'},
    'my':           {name: 'Myanmasa', dir: 'ltr'},
    'na':           {name: 'Dorerin Naoero', dir: 'ltr'},
    'nah':          {name: 'Nahuatl', dir: 'ltr'},
    'nap':          {name: 'Nnapulitano', dir: 'ltr'},
    'nb':           {name: 'Norsk (bokmål)', dir: 'ltr'},
    'nd':           {name: 'Sindebele', dir: 'ltr'},
    'nds':          {name: 'Plattdüütsch', dir: 'ltr'},
    'nds-nl':       {name: 'Nedersaksisch', dir: 'ltr'},
    'ne':           {name: 'नेपाली', dir: 'ltr'},
    'new':          {name: 'नेपालभाषा / Newah Bhaye', dir: 'ltr'},
    'ng':           {name: 'Oshiwambo', dir: 'ltr'},
    'nl':           {name: 'Nederlands', dir: 'ltr'},
    'nn':           {name: 'Norsk (nynorsk)', dir: 'ltr'},
    'no':           {name: 'Norsk (bokmål / riksmål)', dir: 'ltr'},
    'nr':           {name: 'isiNdebele', dir: 'ltr'},
    'nrm':          {name: 'Nouormand / Normaund', dir: 'ltr'},
    'nso':          {name: 'Sesotho sa Leboa / Sepedi', dir: 'ltr'},
    'nv':           {name: 'Diné bizaad', dir: 'ltr'},
    'ny':           {name: 'Chi-Chewa', dir: 'ltr'},
    'oc':           {name: 'Occitan', dir: 'ltr'},
    'oj':           {name: 'ᐊᓂᔑᓈᐯᒧᐎᓐ / Anishinaabemowin', dir: 'ltr'},
    'om':           {name: 'Oromoo', dir: 'ltr'},
    'or':           {name: 'ଓଡ଼ିଆ', dir: 'ltr'},
    'os':           {name: 'Иронау', dir: 'ltr'},
    'pa':           {name: 'ਪੰਜਾਬੀ / पंजाबी / پنجابي', dir: 'ltr'},
    'pag':          {name: 'Pangasinan', dir: 'ltr'},
    'pam':          {name: 'Kapampangan', dir: 'ltr'},
    'pap':          {name: 'Papiamentu', dir: 'ltr'},
    'pdc':          {name: 'Deitsch', dir: 'ltr'},
    'pi':           {name: 'Pāli / पाऴि', dir: 'ltr'},
    'pih':          {name: 'Norfuk', dir: 'ltr'},
    'pl':           {name: 'Polski', dir: 'ltr'},
    'pms':          {name: 'Piemontèis', dir: 'ltr'},
    'ps':           {name: 'پښتو', dir: 'rtl'},
    'pt':           {name: 'Português', dir: 'ltr'},
    'qu':           {name: 'Runa Simi', dir: 'ltr'},
    'rm':           {name: 'Rumantsch', dir: 'ltr'},
    'rmy':          {name: 'Romani / रोमानी', dir: 'ltr'},
    'rn':           {name: 'Kirundi', dir: 'ltr'},
    'ro':           {name: 'Română', dir: 'ltr'},
    'roa-rup':      {name: 'Armâneashti', dir: 'ltr'},
    'ru':           {name: 'Русский', dir: 'ltr'},
    'rw':           {name: 'Kinyarwandi', dir: 'ltr'},
    'sa':           {name: 'संस्कृतम्', dir: 'ltr'},
    'sc':           {name: 'Sardu', dir: 'ltr'},
    'scn':          {name: 'Sicilianu', dir: 'ltr'},
    'sco':          {name: 'Scots', dir: 'ltr'},
    'sd':           {name: 'सिनधि', dir: 'ltr'},
    'se':           {name: 'Davvisámegiella', dir: 'ltr'},
    'sg':           {name: 'Sängö', dir: 'ltr'},
    'sh':           {name: 'Srpskohrvatski / Српскохрватски', dir: 'ltr'},
    'si':           {name: 'සිංහල', dir: 'ltr'},
    'simple':       {name: 'Simple English', dir: 'ltr'},
    'sk':           {name: 'Slovenčina', dir: 'ltr'},
    'sl':           {name: 'Slovenščina', dir: 'ltr'},
    'sm':           {name: 'Gagana Samoa', dir: 'ltr'},
    'sn':           {name: 'chiShona', dir: 'ltr'},
    'so':           {name: 'Soomaaliga', dir: 'ltr'},
    'sq':           {name: 'Shqip', dir: 'ltr'},
    'sr':           {name: 'Српски', dir: 'ltr'},
    'ss':           {name: 'SiSwati', dir: 'ltr'},
    'st':           {name: 'Sesotho', dir: 'ltr'},
    'su':           {name: 'Basa Sunda', dir: 'ltr'},
    'sv':           {name: 'Svenska', dir: 'ltr'},
    'sw':           {name: 'Kiswahili', dir: 'ltr'},
    'ta':           {name: 'தமிழ்', dir: 'ltr'},
    'te':           {name: 'తెలుగు', dir: 'ltr'},
    'tet':          {name: 'Tetun', dir: 'ltr'},
    'tg':           {name: 'Тоҷикӣ', dir: 'ltr'},
    'th':           {name: 'ไทย / Phasa Thai', dir: 'ltr'},
    'ti':           {name: 'ትግርኛ', dir: 'ltr'},
    'tk':           {name: 'Туркмен / تركمن', dir: 'ltr'},
    'tl':           {name: 'Tagalog', dir: 'ltr'},
    'tlh':          {name: 'tlhIngan-Hol', dir: 'ltr'},
    'tn':           {name: 'Setswana', dir: 'ltr'},
    'to':           {name: 'Lea Faka-Tonga', dir: 'ltr'},
    'tokipona':     {name: 'tokipona', dir: 'ltr'},
    'tpi':          {name: 'Tok Pisin', dir: 'ltr'},
    'tr':           {name: 'Türkçe', dir: 'ltr'},
    'ts':           {name: 'Xitsonga', dir: 'ltr'},
    'tt':           {name: 'Tatarça', dir: 'ltr'},
    'tum':          {name: 'chiTumbuka', dir: 'ltr'},
    'tw':           {name: 'Twi', dir: 'ltr'},
    'ty':           {name: 'Reo Mā`ohi', dir: 'ltr'},
    'udm':          {name: 'Удмурт кыл', dir: 'ltr'},
    'ug':           {name: 'Uyƣurqə / ئۇيغۇرچە', dir: 'ltr'},
    'uk':           {name: 'Українська', dir: 'ltr'},
    'ur':           {name: 'اردو', dir: 'rtl'},
    'uz':           {name: 'Ўзбек', dir: 'ltr'},
    've':           {name: 'Tshivenḓa', dir: 'ltr'},
    'vec':          {name: 'Vèneto', dir: 'ltr'},
    'vi':           {name: 'Việtnam', dir: 'ltr'},
    'vls':          {name: 'West-Vlaoms', dir: 'ltr'},
    'vo':           {name: 'Volapük', dir: 'ltr'},
    'wa':           {name: 'Walon', dir: 'ltr'},
    'war':          {name: 'Winaray / Binisaya Lineyte-Samarnon', dir: 'ltr'},
    'wo':           {name: 'Wollof', dir: 'ltr'},
    'xal':          {name: 'Хальмг', dir: 'ltr'},
    'xh':           {name: 'isiXhosa', dir: 'ltr'},
    'xmf':          {name: 'მარგალური', dir: 'ltr'},
    'yi':           {name: 'ייִדיש', dir: 'rtl'},
    'yo':           {name: 'Yorùbá', dir: 'ltr'},
    'za':           {name: 'Cuengh / Tôô / 壮语', dir: 'ltr'},
    'zh':           {name: '中文', dir: 'ltr'},
    'zh-classical': {name: '文言', dir: 'ltr'},
    'zh-min-nan':   {name: 'Bân-lâm-gú', dir: 'ltr'},
    'zh-tw':        {name: '‪中文(台灣)‬', dir: 'ltr'},
    'zh-yue':       {name: '粵語 / 粤语', dir: 'ltr'},
    'zu':           {name: 'isiZulu', dir: 'ltr'},
};

// Sort alphabetically
const keys = Object.keys(obj).sort();
const sortedLanguages = {};
for(let i = 0; i < keys.length; i++) {
    sortedLanguages[keys[i]] = obj[keys[i]];
}

export default sortedLanguages;
