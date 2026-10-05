/* slides.js - что рассказывает экран загрузки и в каком порядке.
 *
 * Порядок - «по крутизне», первым судмедэксперт (заказчик, 29.09.2026); с 05.10
 * - как дела на сайте (СМЭ, АЭС, шахта, метлаба, цех, телефон, банк...), тексты
 * шахты, метлабы, цеха, казны и навыков - с сайта, их схемы - js/vig_site.js и
 * js/realphone.js (копия с сайта: python build/lssite.py).
 * Каждая цифра в фактах взята из кода сервера или из памяти проекта, не
 * придумана: 31 гильза - sh_casings.lua, 3,0 МВт и 12 ТВЭЛ - NCT/NC пульта,
 * 327 листов/ч - H.T линии HELIX, 10 000 $ - A.TAPMAX терминала, 10 000 л -
 * AddFuel ядра АЗС, 25 % и 150 000 $ - sh_business.lua, 120 с - выборы мэра.
 *
 * Пример на каждом слайде (VIG[id]) - живая схема того, как это устроено в
 * игре. Разметка SVG + таймлайн: run(root, T) расставляет классы p1, p2, ...
 * по времени, CSS в css/vig.css делает остальное.
 */
var SLIDES = [
  { id: 'forensic', chap: 'СМЭ', kick: 'РАССЛЕДОВАНИЕ', title: 'СУДМЕДЭКСПЕРТ',
    lead: 'Каждый выстрел оставляет гильзу, каждое касание — отпечаток. Эксперт изымает улики на месте, а в <em>своей лаборатории</em> проявляет следы парами клея, гоняет центрифугу и ПЦР, ищет кровь реактивом — и называет виновного.',
    facts: [['9', 'приборов на столе: центрифуга,<br>ПЦР, секвенатор, микроскопы'], ['31', 'калибр гильз<br>в настоящих размерах'], ['10<small>+ДНК</small>', 'пальцев со своим узором<br>у каждого жителя']],
    loc: { x: -8775, y: 9987, z: 0.105, r: 0, name: 'Лаборатория СМЭ', sub: 'Полицейский участок' },
    cap: 'Стол эксперта: пары клея, реактив на кровь, центрифуга, ПЦР — и совпадение отпечатка', dur: 13000 },

  { id: 'npp', chap: 'АЭС', kick: 'ЭНЕРГЕТИКА', title: 'АТОМНАЯ СТАНЦИЯ',
    lead: 'Реактор ИР-60 и турбина К-2,5-35 кормят весь город. Инженеры выводят мощность, меняют отработанные ТВЭЛы, следят за маслом и вакуумом. Встала станция — город сидит на дизеле.',
    facts: [['3,0<small>МВт</small>', 'номинал турбины<br>на ваттметре пульта'], ['12', 'ТВЭЛов<br>в активной зоне'], ['5<small>мин</small>', 'живёт стержень<br>на пиковой нагрузке']],
    loc: { x: -176, y: 11672, z: 0.095, r: -6, name: 'АЭС', sub: 'Электростанция' },
    cap: 'Реактор, турбина и ваттметр — так станция устроена в игре', dur: 22500 },

  { id: 'mine', chap: 'ШАХТА', kick: 'ДОБЫЧА', title: 'ШАХТА',
    lead: 'Простучал забой молотком, взял керн, отдал в лабораторию — и знаешь, что в пласте. Шесть шпуров перфоратором, заряды, сирена, взрыв. Вагонетку катишь <em>своими ногами</em>, а руду перерабатывает завод, который ты сам собрал на участке. Уран уходит на АЭС города.',
    facts: [['5', 'руд: медь, железо, свинец<br>с серебром, золото, уран'], ['9<small>т</small>', 'руды в куче<br>одного взрыва'], ['12', 'машин на участке —<br>свой завод']],
    loc: { x: 7136, y: 1614, z: 0.1, r: 0, name: 'Шахта', sub: 'Горный синдикат' },
    cap: 'Забой, взрыв, вагонетка, завод — и бочка урана для АЭС', dur: 15500 },

  { id: 'meth', chap: 'МЕТЛАБА', kick: 'ТЕНЕВАЯ ХИМИЯ', title: 'МЕТЛАБОРАТОРИЯ',
    lead: 'Начинаешь с Кухни: походная плитка, баллон, кастрюля и вентиль. Дальше — цепочка станков до Голубого: промыть основу в воронке, держать реактор в окне температуры, ловить пену и клапан, затравить кристалл в шкафу. Пять сортов, и <em>сорт решает результат</em>: не дотянул Голубой — получишь Лёд.',
    facts: [['5', 'сортов: от Кухни<br>на плитке до Голубого'], ['97<small>%</small>', 'чистоты нужно<br>для Голубого'], ['4<small>$/г</small>', 'платит скупщик<br>за Голубой']],
    loc: { x: -9609, y: 7273, z: 0.105, r: 3, name: 'Скупщик мета', sub: 'Лабораторию ставишь сам' },
    cap: 'От Кухни на плитке до Голубого: воронка, реактор, тележка, шкаф и стол фасовки', dur: 29500 },

  { id: 'press', chap: 'ЦЕХ', kick: 'ФАЛЬШИВЫЕ ДЕНЬГИ', title: 'ДЕНЕЖНЫЙ ЦЕХ',
    lead: 'Не коробка, из которой капают деньги, а цех из трёх станков. P-40 печатает лист с пластины, D-20 ставит номера и вдавливает голограмму, C-15 режет и пакует в бандероль. А водяной знак сидит в самой бумаге — <em>пластиной его не подделать</em>.',
    facts: [['327', 'листов в час —<br>потолок линии'], ['4', 'пластины: $100, $500,<br>$1000 и $5000'], ['88<small>%</small>', 'качества листа<br>для пятитысячной']],
    loc: { x: -9913, y: 3682, z: 0.105, r: -4, name: 'Скупщик фальшивых денег', sub: 'Цех ставишь сам — пачки сдаёшь здесь' },
    cap: 'Настоящая купюра сервера: печать, водяной знак, номер, голограмма — и пачка', dur: 11500 },

  // казино только в телефоне, на карте его нет (владелец 05.10): у телефона нет своего места - весь город
  { id: 'phone', chap: 'ТЕЛЕФОН', kick: 'В КАРМАНЕ', title: 'ТЕЛЕФОН',
    lead: 'Хочешь в казино? <em>Открой приложение.</em> Такси, доставка еды, банк, биржа, даркнет, звонки, СМС и навигатор по настоящим улицам города — всё в одном телефоне.',
    facts: [['20', 'приложений<br>в телефоне'], ['6', 'игр в казино: краш, рулетка,<br>слоты, блэкджек, покер, дурак'], ['7,3<small>км</small>', 'улиц в навигаторе —<br>маршрут по дорогам']],
    loc: { x: -3200, y: 1800, z: 0.036, r: 0, name: 'Телефон', sub: 'Весь город в кармане', wide: true },
    cap: 'Настоящий телефон из игры: нажми на любой значок — откроется его экран', dur: 16000 },

  { id: 'atm', chap: 'БАНКОМАТ', kick: 'БАНК', title: 'БАНКОМАТЫ',
    lead: 'Вставляешь свою карту, набираешь ПИН на настоящих кнопках, выбираешь сумму — шторка открывается и отдаёт пачку, следом возвращается карта. Всё движется, как у живого банкомата.',
    facts: [['30', 'подвижных деталей: клавиши,<br>шторка, лоток, сейф'], ['4', 'цифры ПИН-кода —<br>сбросить можно в F4'], ['1', 'карта на все банкоматы<br>и терминалы города']],
    loc: { x: -9776, y: 1451, z: 0.105, r: -5, name: 'Банкомат', sub: 'Центр города' },
    cap: 'Карта Синдикат Банка — в щель, ПИН, сумма, пачка и карта обратно', dur: 11000 },

  { id: 'term', chap: 'ТЕРМИНАЛ', kick: 'БАНК', title: 'ОПЛАТА КАРТОЙ',
    lead: 'Зарплата приходит на счёт, а платишь картой: в магазине, на заправке, у торговца. Честные деньги живут на карте, <em>наличные — для тёмных дел</em>.',
    facts: [['10 000<small>$</small>', 'оплата касанием,<br>без ПИН-кода'], ['1,2<small>с</small>', 'на чтение карты<br>терминалом'], ['15', 'товаров F4 продаются<br>только по карте']],
    loc: { x: -11338, y: 8038, z: 0.105, r: 3, name: 'Оплата картой', sub: 'Ресторан' },
    cap: 'Терминал: касанием до 10 000 $, дороже — карту в щель и ПИН', dur: 11000 },

  { id: 'fuel', chap: 'АЗС', kick: 'ТРАНСПОРТ', title: 'ЗАПРАВКИ',
    lead: 'Машины жгут бензин, а бензин не берётся из воздуха: город держит запас, дальнобойщики везут его на АЗС, колонка отпускает литры за деньги. Пустой бак — иди пешком.',
    facts: [['4', 'сорта: АИ-92, АИ-95,<br>АИ-100 и ДТ'], ['10 000<small>л</small>', 'бак АЗС<br>на каждый сорт'], ['3', 'заправки: город,<br>трасса, пригород']],
    loc: { x: -9574, y: 2676, z: 0.1, r: -8, name: 'АЗС', sub: 'Город' },
    cap: 'Расход в пути, заправка у колонки, подвоз бензовозом', dur: 10000 },

  { id: 'gov', chap: 'СИНУСЛУГИ', kick: 'ГОСУДАРСТВО', title: 'СИНУСЛУГИ',
    lead: 'Паспорт, штрафы, лицензии, законы и выборы мэра — в приложении на телефоне. Голосуют только здесь, и каждый голос считает сервер, а не чат.',
    facts: [['120<small>с</small>', 'идёт голосование —<br>успей достать телефон'], ['8', 'разделов: паспорт, штрафы,<br>лицензии, законы, мэрия…'], ['2', 'голосования: выборы мэра<br>и вотум недоверия']],
    loc: { x: -11077, y: 13370, z: 0.105, r: 5, name: 'Мэрия', sub: 'Синуслуги' },
    cap: 'Синуслуги из игры: кабинет, выборы мэра, голос и итоги', dur: 12500 },

  { id: 'biz', chap: 'БИЗНЕС', kick: 'СОБСТВЕННОСТЬ', title: 'БИЗНЕСЫ',
    lead: 'Выкупи отрасль — и получай долю с каждого настоящего платежа в ней: заправки, нефть, ферма, шахта, логистика. Деньги идут с живого оборота игроков, а не по таймеру.',
    facts: [['5', 'отраслей<br>в продаже'], ['25<small>%</small>', 'доля владельца<br>с каждого платежа'], ['150 000<small>$</small>', 'лицензия — один раз<br>и навсегда']],
    loc: { x: -10644, y: 9733, z: 0.105, r: -4, name: 'Бизнес-центр', sub: 'Лицензии и выкуп' },
    cap: 'Выкупил заправки — получаешь четверть с каждого литра', dur: 10000 },

  { id: 'eco', chap: 'КАЗНА', kick: 'КАЗНА ГОРОДА', title: 'ЖИВАЯ ЭКОНОМИКА',
    lead: 'Казна — не число из воздуха. Девять налогов в коридорах, которые двигает мэр; оклад из казны получает только госслужба, частник живёт своей работой, а тёмная сделка за наличные налога не платит. Каждый доллар записан в статью — откуда пришёл и куда ушёл.',
    facts: [['9', 'налогов — ставки<br>двигает мэр'], ['28', 'статей казны:<br>15 доходов, 13 расходов'], ['+14,7<small>тыс $/ч</small>', 'сальдо при 20 игроках<br>по модели бюджета']],
    loc: { x: -12080, y: 14603, z: 0.105, r: 6, name: 'Центральный банк', sub: 'Казна и кредиты' },
    cap: 'Казна за час игры: настоящие статьи и ставки, суммы — модель бюджета при 20 игроках', dur: 11500 },

  { id: 'skills', chap: 'НАВЫКИ', kick: 'ПЕРСОНАЖ', title: 'НАВЫКИ',
    lead: 'Пятнадцать навыков, и каждый растёт от дела, а не от часов в игре. Уровень не открывает доступ — всё доступно с первого дня; он делает тебя быстрее, точнее и богаче. У каждой ступени своё звание: от Практиканта до Главного инженера, от Кухаря до <em>Хайзенберга</em>.',
    facts: [['15', 'навыков: 10 законных,<br>4 теневых, выживание'], ['79', 'уровней в сумме —<br>путь к мастерству'], ['×1,5', 'опыта с VIP —<br>мастер на треть быстрее']],
    loc: { x: -3200, y: 1800, z: 0.036, r: 0, name: 'rp_syndicate', sub: 'Весь город', wide: true },
    cap: 'Вкладка «Навыки» из меню F4: те же сцены, звания и ступени, что в игре', dur: 14500 },

  { id: 'grid', chap: 'СЕТЬ', kick: 'ГОРОДСКАЯ СЕТЬ', title: 'БЕЗ РОЗЕТКИ — НИЧЕГО',
    lead: 'Станок, принтер, плита — всё работает, только пока воткнуто в розетку. Свет стоит денег, а если город берёт больше, чем даёт станция, гаснет <em>весь город разом</em>.',
    facts: [['5<small>кВт</small>', 'берёт каждый<br>прибор в розетке'], ['400<small>кВт</small>', 'дизельный резерв мэрии<br>на случай остановки АЭС'], ['50<small>кВт</small>', 'аварийный минимум —<br>хватит на 10 приборов']],
    loc: { x: -7600, y: 6400, z: 0.052, r: 4, name: 'Городская сеть', sub: 'Весь город на одной станции', wide: true },
    cap: 'Вилка, розетка и нагрузка сети: что будет, если перегрузить город', dur: 10000 },

  { id: 'more', chap: 'И ЕЩЁ', kick: 'И ЕЩЁ', title: 'И ЭТО НЕ ВСЁ',
    lead: 'Ограбления банка и ювелирного, суд и тюрьма, наручники и конвой, радиация, логистика, ферма, нокауты и добивание — ещё два десятка систем, которых нет больше нигде.',
    facts: [['24', 'системы на листе —<br>и это только выборка'], ['41', 'место в навигаторе<br>телефона'], ['1', 'город, в котором<br>всё связано']],
    loc: { x: -3200, y: 1800, z: 0.036, r: 0, name: 'rp_syndicate', sub: 'Весь город', wide: true, gps: true },
    cap: 'Далеко не полный список', dur: 10500 }
];

/* ── общие куски примеров ───────────────────────────────────────────────── */
var VIG = {};
var VK = (function () {
  'use strict';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  // знак сервера в SVG - те же доли R, что в build/syndlogo.py (mono_svg)
  function mark(cx, cy, r, col, bg) {
    var c30 = Math.cos(Math.PI / 6), ro = r, ri = r - 0.052 * r / c30, i, a, o = '', n = '';
    for (i = 0; i < 6; i++) { a = i * Math.PI / 3; o += (i ? 'L' : 'M') + (cx + ro * Math.cos(a)).toFixed(2) + ' ' + (cy + ro * Math.sin(a)).toFixed(2); n += (i ? 'L' : 'M') + (cx + ri * Math.cos(a)).toFixed(2) + ' ' + (cy + ri * Math.sin(a)).toFixed(2); }
    var sw = 0.17 * r, ar = 0.54 * r - sw / 2, ax = cx - 0.04 * r;
    var x0 = ax + ar * Math.cos(36 * Math.PI / 180), y0 = cy + ar * Math.sin(36 * Math.PI / 180), y1 = cy - ar * Math.sin(36 * Math.PI / 180);
    var dx = cx + 0.46 * r, dw = 0.15 * r, dh = 0.23 * r;
    return (bg ? '<path d="' + o + 'Z" fill="' + bg + '"/>' : '') +
      '<path fill="' + col + '" fill-rule="evenodd" d="' + o + 'Z' + n + 'Z"/>' +
      '<path fill="none" stroke="' + col + '" stroke-width="' + sw.toFixed(2) + '" d="M' + x0.toFixed(2) + ' ' + y0.toFixed(2) + 'A' + ar.toFixed(2) + ' ' + ar.toFixed(2) + ' 0 1 1 ' + x0.toFixed(2) + ' ' + y1.toFixed(2) + '"/>' +
      '<path fill="' + col + '" d="M' + dx.toFixed(2) + ' ' + (cy - dh).toFixed(2) + 'L' + (dx + dw).toFixed(2) + ' ' + cy + 'L' + dx.toFixed(2) + ' ' + (cy + dh).toFixed(2) + 'L' + (dx - dw).toFixed(2) + ' ' + cy + 'Z"/>';
  }
  // банковская карта «СИНДИКАТ БАНК» (как synd_card: зелёная планка слева, чип, волна)
  function card(w, num, name) {
    var h = w * 54 / 85.6, s = w / 290;
    return '<g class="card">' +
      '<rect width="' + w + '" height="' + h.toFixed(1) + '" rx="' + (11 * s).toFixed(1) + '" fill="url(#cardBg)" stroke="#2B3B33" stroke-width="1"/>' +
      '<rect width="' + (14 * s).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="' + (6 * s).toFixed(1) + '" fill="#2ECC71"/>' +
      '<rect x="' + (8 * s).toFixed(1) + '" width="' + (8 * s).toFixed(1) + '" height="' + h.toFixed(1) + '" fill="#2ECC71"/>' +
      '<g opacity=".16" fill="none" stroke="#2ECC71" stroke-width="1">' +
      [0, 1, 2, 3, 4, 5].map(function (k) { return '<path d="M' + (30 * s) + ' ' + (40 + k * 22) * s + ' C ' + (110 * s) + ' ' + (10 + k * 22) * s + ', ' + (190 * s) + ' ' + (70 + k * 22) * s + ', ' + (w - 10) + ' ' + (30 + k * 22) * s + '"/>'; }).join('') + '</g>' +
      '<g transform="translate(' + (34 * s).toFixed(1) + ',' + (22 * s).toFixed(1) + ')">' + mark(12 * s, 12 * s, 12 * s, '#2ECC71', '#0B100D') + '</g>' +
      '<text x="' + (62 * s).toFixed(1) + '" y="' + (39 * s).toFixed(1) + '" class="cd-bank" font-size="' + (15 * s).toFixed(1) + '">СИНДИКАТ БАНК</text>' +
      '<rect x="' + (38 * s).toFixed(1) + '" y="' + (70 * s).toFixed(1) + '" width="' + (40 * s).toFixed(1) + '" height="' + (31 * s).toFixed(1) + '" rx="' + (5 * s).toFixed(1) + '" fill="url(#chipG)"/>' +
      '<path d="M' + (38 * s) + ' ' + (85.5 * s) + 'h' + (40 * s) + 'M' + (58 * s) + ' ' + (70 * s) + 'v' + (31 * s) + 'M' + (48 * s) + ' ' + (70 * s) + 'v' + (9 * s) + 'M' + (48 * s) + ' ' + (92 * s) + 'v' + (9 * s) + 'M' + (68 * s) + ' ' + (70 * s) + 'v' + (9 * s) + 'M' + (68 * s) + ' ' + (92 * s) + 'v' + (9 * s) + '" stroke="#8A6D1F" stroke-width="' + (1.2 * s).toFixed(2) + '" fill="none"/>' +
      '<g fill="none" stroke="#C9D3CD" stroke-width="' + (2 * s).toFixed(2) + '" stroke-linecap="round" opacity=".8">' +
      '<path d="M' + (95 * s) + ' ' + (78 * s) + 'a' + (8 * s) + ' ' + (8 * s) + ' 0 0 1 0 ' + (16 * s) + '"/><path d="M' + (101 * s) + ' ' + (73 * s) + 'a' + (14 * s) + ' ' + (14 * s) + ' 0 0 1 0 ' + (26 * s) + '"/><path d="M' + (107 * s) + ' ' + (68 * s) + 'a' + (20 * s) + ' ' + (20 * s) + ' 0 0 1 0 ' + (36 * s) + '"/></g>' +
      '<text x="' + (36 * s).toFixed(1) + '" y="' + (135 * s).toFixed(1) + '" class="cd-num" font-size="' + (21 * s).toFixed(1) + '">' + num + '</text>' +
      '<text x="' + (36 * s).toFixed(1) + '" y="' + (164 * s).toFixed(1) + '" class="cd-name" font-size="' + (12 * s).toFixed(1) + '">' + name + '</text>' +
      '<text x="' + (w - 16 * s).toFixed(1) + '" y="' + (164 * s).toFixed(1) + '" class="cd-exp" font-size="' + (12 * s).toFixed(1) + '" text-anchor="end">09/29</text>' +
      '</g>';
  }
  var DEFS = '<defs>' +
    '<linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16201B"/><stop offset=".55" stop-color="#0C1210"/><stop offset="1" stop-color="#121B16"/></linearGradient>' +
    '<linearGradient id="chipG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8C766"/><stop offset=".5" stop-color="#B8912E"/><stop offset="1" stop-color="#F0D98A"/></linearGradient>' +
    '<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D1CD"/><stop offset="1" stop-color="#8E9994"/></linearGradient>' +
    '<linearGradient id="body" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1A2320"/><stop offset=".5" stop-color="#222D29"/><stop offset="1" stop-color="#161E1B"/></linearGradient>' +
    '<linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0D1A14"/><stop offset="1" stop-color="#07100C"/></linearGradient>' +
    '<radialGradient id="cher" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#7FD8FF" stop-opacity=".95"/><stop offset=".5" stop-color="#2F8FE0" stop-opacity=".45"/><stop offset="1" stop-color="#1B4F8A" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="rodG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3FA6F0"/><stop offset=".5" stop-color="#C9F0FF"/><stop offset="1" stop-color="#3FA6F0"/></linearGradient>' +
    '<linearGradient id="paperG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ECE8DC"/><stop offset="1" stop-color="#D9D3C4"/></linearGradient>' +
    '<linearGradient id="scanG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ECC71" stop-opacity="0"/><stop offset=".85" stop-color="#2ECC71" stop-opacity=".22"/><stop offset="1" stop-color="#2ECC71" stop-opacity=".9"/></linearGradient>' +
    '<linearGradient id="wall" x1="0" y1="0" x2=".4" y2="1"><stop offset="0" stop-color="#10241B"/><stop offset=".6" stop-color="#08120E"/><stop offset="1" stop-color="#040806"/></linearGradient>' +
    '</defs>';

  // значки приложений телефона: одна линия, белым по цвету плитки
  var ICON = {
    phone: 'M13 11c0 9 7 16 16 16l3-4-5-3-2 2c-3-1-6-4-7-7l2-2-3-5z',
    sms: 'M10 12h20v13H18l-5 4v-4h-3z',
    contacts: 'M20 20a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM11 30c1-5 5-7 9-7s8 2 9 7',
    camera: 'M10 15h5l2-3h6l2 3h5v14H10zM20 26a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z',
    bank: 'M10 16l10-6 10 6zM12 18v9M17 18v9M23 18v9M28 18v9M10 29h20',
    stocks: 'M10 27l6-7 4 4 9-11M24 13h5v5',
    biz: 'M11 16h18v12H11zM16 16v-3h8v3M11 21h18',
    casino: 'M20 10a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM20 15a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM20 10v4M20 26v4M10 20h4M26 20h4',
    taxi: 'M11 25v-5l3-6h12l3 6v5zM11 25v3M29 25v3M14 22h2M24 22h2M17 14l1-3h4l1 3',
    food: 'M14 10v8a3 3 0 0 0 6 0v-8M17 10v20M26 10c-3 2-3 8 0 10v10',
    garage: 'M10 18l10-7 10 7v11H10zM14 21h12M14 24h12M14 27h12',
    nav: 'M20 10l8 20-8-5-8 5z',
    gov: 'M20 10l9 4v6c0 5-4 9-9 11-5-2-9-6-9-11v-6zM16 20l3 3 5-6',
    work: 'M12 28l9-9M19 13a5 5 0 0 0 7 7l3-3-3-1-1-3-3-3z',
    npp: 'M20 20m-2.5 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0M20 17l-4-7a11 11 0 0 1 8 0zM17.4 21.5l-8 1a11 11 0 0 0 4 7zM22.6 21.5l4 6.5a11 11 0 0 0 4-7z',
    social: 'M20 29s-9-5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 11-9 11z',
    dark: 'M9 20s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zM20 23a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    guns: 'M20 11v6M20 23v6M11 20h6M23 20h6M20 13a7 7 0 1 0 0 14 7 7 0 0 0 0-14z',
    gallery: 'M10 12h20v16H10zM10 25l6-6 5 5 3-3 6 6M24 16h1',
    calc: 'M12 10h16v20H12zM15 13h10v4H15zM15 21h2M19 21h2M23 21h2M15 25h2M19 25h2M23 25h2'
  };
  var APPS = [
    ['phone', 'Телефон', '#27AE60'], ['sms', 'СМС', '#1E8449'], ['contacts', 'Контакты', '#5D6D7E'], ['camera', 'Камера', '#34495E'],
    ['bank', 'Банк', '#138D75'], ['stocks', 'Биржа', '#196F3D'], ['biz', 'Бизнес', '#9A7D0A'], ['casino', 'Казино', '#B03A2E'],
    ['taxi', 'Такси', '#D4AC0D'], ['food', 'Еда', '#CA6F1E'], ['garage', 'Гараж', '#4D5656'], ['nav', 'Навигатор', '#2471A3'],
    ['gov', 'Синуслуги', '#2E5CB8'], ['work', 'Работа', '#935116'], ['npp', 'АЭС', '#0E6655'], ['social', 'Соцсеть', '#7D3C98'],
    ['dark', 'Даркнет', '#17202A'], ['guns', 'Оружие', '#78281F'], ['gallery', 'Галерея', '#BA4A00'], ['calc', 'Калькулятор', '#424949']
  ];
  function appIcon(key, x, y, col, size) {
    var s = (size || 40) / 40;
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
      '<rect width="40" height="40" rx="11" fill="' + col + '"/>' +
      '<rect width="40" height="20" rx="11" fill="#fff" opacity=".07"/>' +
      '<path d="' + ICON[key] + '" fill="none" stroke="' + (key === 'taxi' ? '#1A1A1A' : '#fff') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>';
  }
  // корпус телефона: экран 210 x 452 от (x+10, y+10)
  function phone(x, y, inner) {
    return '<g class="ph" transform="translate(' + x + ',' + y + ')">' +
      '<rect x="-3" y="-3" width="236" height="478" rx="36" fill="#0B0F0D" stroke="#34443C" stroke-width="1.5"/>' +
      '<rect width="230" height="472" rx="33" fill="#141B18"/>' +
      '<rect x="-5" y="92" width="3" height="46" rx="1.5" fill="#2A3731"/><rect x="233" y="118" width="3" height="70" rx="1.5" fill="#2A3731"/>' +
      '<clipPath id="phClip' + x + '"><rect x="10" y="10" width="210" height="452" rx="25"/></clipPath>' +
      '<g clip-path="url(#phClip' + x + ')"><rect x="10" y="10" width="210" height="452" fill="#07100C"/>' + inner + '</g>' +
      '<rect x="10" y="10" width="210" height="452" rx="25" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="2"/>' +
      '<circle cx="115" cy="24" r="5" fill="#000"/><circle cx="115" cy="24" r="2" fill="#15202A"/>' +
      '</g>';
  }
  function statusBar(t) {
    return '<text x="26" y="29" class="ph-time">' + (t || '21:47') + '</text>' +
      '<g transform="translate(166,20)" fill="#DDE6E1"><rect x="0" y="6" width="2.5" height="4"/><rect x="4" y="4" width="2.5" height="6"/><rect x="8" y="2" width="2.5" height="8"/><rect x="12" y="0" width="2.5" height="10"/>' +
      '<rect x="20" y="1" width="16" height="8" rx="2" fill="none" stroke="#DDE6E1" stroke-width="1.2"/><rect x="22" y="3" width="10" height="4"/><rect x="36.5" y="3.5" width="1.5" height="3"/></g>';
  }
  function homeGrid() {
    var o = '<g class="home"><rect x="10" y="10" width="210" height="452" fill="url(#wall)"/>' +
      '<g opacity=".08" transform="translate(115,300)">' + mark(0, 0, 70, '#2ECC71') + '</g>' + statusBar();
    for (var i = 0; i < APPS.length; i++) {
      var c = i % 4, r = (i / 4) | 0, x = 21 + c * 50, y = 58 + r * 70;
      o += '<g class="app app-' + APPS[i][0] + '">' + appIcon(APPS[i][0], x + 3, y, APPS[i][2]) +
        '<text x="' + (x + 23) + '" y="' + (y + 54) + '" class="app-l" text-anchor="middle">' + APPS[i][1] + '</text></g>';
    }
    return o + '<rect x="85" y="446" width="60" height="4" rx="2" fill="#DDE6E1" opacity=".5"/></g>';
  }
  function tap(id, x, y) { return '<g class="tap ' + id + '" transform="translate(' + x + ',' + y + ')"><circle r="16" class="tap-r"/><circle r="7" class="tap-d"/></g>'; }
  function head(l, r) {
    return '<g class="vh"><text x="22" y="27" class="vh-l">' + l + '</text><text x="708" y="27" class="vh-r" text-anchor="end">' + r + '</text>' +
      '<path d="M0 40.5H730" stroke="#22302A"/></g>';
  }

  // таймеры примера: снимаются при уходе со слайда
  function Timeline() { this.ids = []; this.raf = []; this.dead = false; }
  // VK.speed < 1 - ролик (?reel): те же шаги примера плотнее; в игре всегда 1
  Timeline.prototype.at = function (ms, fn) { var s = this; this.ids.push(setTimeout(function () { if (!s.dead) fn(); }, ms * VK.speed)); };
  Timeline.prototype.cls = function (el, ms, c) { this.at(ms, function () { el.classList.add(c); }); };
  Timeline.prototype.anim = function (ms, dur, fn, ease) { // fn(k 0..1) каждый кадр
    var s = this;
    dur = dur * VK.speed;
    this.at(ms, function () {
      var t0 = performance.now();
      function step() {
        if (s.dead) return;
        var k = Math.max(0, Math.min(1, (performance.now() - t0) / dur)), e = ease ? ease(k) : k;
        fn(e, k);
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  };
  Timeline.prototype.count = function (el, ms, dur, a, b, fmt, ease) {
    this.anim(ms, dur, function (e) { el.textContent = fmt(a + (b - a) * e); }, ease || eout);
  };
  Timeline.prototype.kill = function () { this.dead = true; this.ids.forEach(clearTimeout); this.ids = []; };
  function eout(t) { return 1 - Math.pow(1 - t, 3); }
  function eio(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function money(v) { return Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function dec(v, n, sep) { return v.toFixed(n).replace('.', sep || ','); }

  return { esc: esc, mark: mark, card: card, DEFS: DEFS, ICON: ICON, APPS: APPS, appIcon: appIcon, phone: phone,
    statusBar: statusBar, homeGrid: homeGrid, tap: tap, head: head, Timeline: Timeline, eout: eout, eio: eio,
    money: money, dec: dec, speed: 1 };
})();
