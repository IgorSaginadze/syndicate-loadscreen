/* ls.js - экран загрузки: масштаб макета, вызовы игры, ход загрузки,
 * вступление знака, смена слайдов и камера над картой.
 *
 * Игра зовёт глобальные функции (так было и в старом экране):
 *   GameDetails(server, url, map, maxplayers, steamid, gamemode, volume, language)
 *   SetFilesTotal(n), SetFilesNeeded(n), DownloadingFile(name), SetStatusChanged(text)
 * Показ без игры: ?demo - имитация загрузки, ?s=5 - сразу слайд 5, ?hold - не листать.
 */
(function () {
  'use strict';
  function $(s) { return document.querySelector(s); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  var Q = {};
  location.search.replace(/[?&]([^=&]+)(?:=([^&]*))?/g, function (_, k, v) { Q[k] = v === undefined ? '1' : decodeURIComponent(v); });

  if (Q.still !== undefined) document.documentElement.className += ' still';
  if (Q.maponly !== undefined) document.documentElement.className += ' maponly';
  var body = document.body, ui = $('#ui'), emb = $('#emb'), slideBox = $('#slide'), chap = $('#chap');
  var pin = $('#pin'), shadeEl = $('#shade');
  var dpr = window.devicePixelRatio || 1;
  var S = { s: 1, ox: 0, oy: 0, W: 1920, H: 1080 };
  var INTRO_SCALE = 1.35, EMB_CX = 304, EMB_CY = 304, PIN_X = 760, PIN_Y = 846;
  var cur = -1, docked = false, nextT = null, pinT = null, TL = null, hold = !!Q.hold;
  // ?reel - ролик на 30 с: [слайд, длительность мс, скорость шагов примера]
  var REEL = Q.reel !== undefined ? [[0, 7800, 0.62], [1, 4300, 0.5], [4, 4300, 0.5], [5, 4900, 0.55], [6, 3900, 0.5]] : null, reelI = 0;
  var FLY = REEL ? 1600 : 2600, PIN_WAIT = REEL ? 1500 : 2500;

  // ── макет 1920x1080 целиком в окно, карта на весь экран ─────────────────
  function fit() {
    var W = window.innerWidth || 1920, H = window.innerHeight || 1080;
    var s = Math.min(W / 1920, H / 1080), ox = (W - 1920 * s) / 2, oy = (H - 1080 * s) / 2;
    S = { s: s, ox: ox, oy: oy, W: W, H: H };
    ui.style.transform = 'translate(' + ox.toFixed(2) + 'px,' + oy.toFixed(2) + 'px) scale(' + s.toFixed(5) + ')';
    var lx = ox + 600 * s;
    shadeEl.style.background =
      'linear-gradient(90deg,rgba(5,7,6,.97) 0,rgba(5,7,6,.93) ' + (lx - 150 * s).toFixed(0) + 'px,rgba(5,7,6,.6) ' + (lx + 30 * s).toFixed(0) + 'px,' +
      'rgba(5,7,6,.42) ' + (lx + 480 * s).toFixed(0) + 'px,rgba(5,7,6,.12) ' + (ox + 1500 * s).toFixed(0) + 'px,rgba(5,7,6,.3) 100%),' +
      'linear-gradient(0deg,rgba(5,7,6,.9) 0,rgba(5,7,6,.3) ' + (oy + 150 * s).toFixed(0) + 'px,rgba(5,7,6,0) ' + (oy + 330 * s).toFixed(0) + 'px,' +
      'rgba(5,7,6,0) ' + (H - oy - 900 * s).toFixed(0) + 'px,rgba(5,7,6,.5) 100%)';
    MAP.resize(W, H, dpr);
    EMB.resize(s * dpr * (docked ? 1 : INTRO_SCALE));
    if (cur >= 0) camTo(SLIDES[cur], true);
    else MAP.set(overview());
  }
  function overview() {
    return { x: -2400, y: 600, z: 0.030 * S.s, r: 0, ax: S.ox + 1256 * S.s, ay: S.oy + 540 * S.s };
  }

  // ── зерно плёнки: одна плитка шума на всё окно ─────────────────────────
  (function () {
    var c = document.createElement('canvas'); c.width = c.height = 180;
    var x = c.getContext('2d'), d = x.createImageData(180, 180);
    for (var i = 0; i < d.data.length; i += 4) { var v = (Math.random() * 255) | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0);
    $('#grain').style.backgroundImage = 'url(' + c.toDataURL('image/png') + ')';
  })();

  // ── кольцо загрузки вокруг знака ────────────────────────────────────────
  var RING_LEN = 0;
  (function () {
    var r = 208, c = 220, d = '', t = '', i, a;
    for (i = 0; i <= 6; i++) {
      a = (180 + i * 60) * Math.PI / 180;
      d += (i ? 'L' : 'M') + (c + r * Math.cos(a)).toFixed(2) + ' ' + (c + r * Math.sin(a)).toFixed(2);
      if (i < 6) {
        var x1 = c + (r + 6) * Math.cos(a), y1 = c + (r + 6) * Math.sin(a), x2 = c + (r + 16) * Math.cos(a), y2 = c + (r + 16) * Math.sin(a);
        t += '<line data-k="' + i + '" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
      }
    }
    RING_LEN = 6 * r;
    $('#ringTrack').setAttribute('d', d);
    var f = $('#ringFill');
    f.setAttribute('d', d);
    f.style.strokeDasharray = RING_LEN;
    f.style.strokeDashoffset = RING_LEN;
    $('#ringTicks').innerHTML = t;
  })();

  // ── ход загрузки ────────────────────────────────────────────────────────
  var prog = { target: 0.02, shown: 0, cap: 0.08, total: 0, needed: 0, t: performance.now() };
  var STAGES = [
    [/retrieving server info/i, 0.05, 0.10, 'Получаем данные сервера'],
    [/sending client info/i, 0.70, 0.86, 'Отправляем данные игрока'],
    [/client info sent/i, 0.88, 0.92, 'Данные игрока приняты'],
    [/mounting addons/i, 0.08, 0.60, 'Подключаем аддоны'],
    [/workshop complete/i, 0.66, 0.84, 'Мастерская загружена'],
    [/received all lua files/i, 0.93, 0.96, 'Скрипты получены'],
    [/starting lua/i, 0.96, 0.985, 'Запускаем скрипты'],
    [/lua started/i, 0.99, 0.995, 'Скрипты запущены'],
    [/parsing game info/i, 0.9, 0.95, 'Читаем данные игры'],
    [/sending client file/i, 0.8, 0.9, 'Отправляем файлы игрока']
  ];
  function stage(v, cap) { prog.target = Math.max(prog.target, v); prog.cap = Math.max(prog.cap, cap, prog.target); }
  function tr(s) {
    var t = String(s || '').replace(/\s+/g, ' ').trim();
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i][0].test(t)) { stage(STAGES[i][1], STAGES[i][2]); return STAGES[i][3]; }
    var m = t.match(/(\d+)\s*(?:\/|of|из)\s*(\d+)/i);
    if (m && /workshop|download|addon|мастерск|скачив/i.test(t)) {
      var a = +m[1], b = +m[2];
      if (b > 0) stage(0.10 + 0.55 * Math.min(1, (a - 1) / b), 0.10 + 0.55 * Math.min(1, a / b));
    } else if (/workshop|mount/i.test(t)) stage(0.10, 0.62);
    else if (/download/i.test(t)) stage(0.12, 0.66);
    return t.replace(/^Downloading/i, 'Скачиваем').replace(/^Loading/i, 'Загружаем').replace(/^Mounting/i, 'Подключаем')
      .replace(/Workshop Addons?/gi, 'аддоны мастерской').replace(/\bof\b/g, 'из');
  }
  function files() {
    if (prog.total > 0) {
      var done = Math.max(0, prog.total - prog.needed);
      stage(0.66 + 0.2 * done / prog.total, 0.66 + 0.2 * Math.min(prog.total, done + 1) / prog.total);
      $('#mFiles').textContent = 'файлов ' + done + ' / ' + prog.total;
    }
  }
  var lastPct = -1;
  function progTick() {
    var now = performance.now(), dt = Math.min(0.5, (now - prog.t) / 1000); prog.t = now;
    // ползём к цели, а за целью - медленно к потолку этапа, чтобы не стоять колом
    if (prog.shown < prog.target) prog.shown += (prog.target - prog.shown) * Math.min(1, dt * 2.2) + 0.0005;
    else if (prog.shown < prog.cap) prog.shown += (prog.cap - prog.shown) * dt * 0.035;
    prog.shown = Math.min(0.999, prog.shown);
    var p = Math.floor(prog.shown * 100);
    if (p !== lastPct) {
      lastPct = p;
      $('#pct').innerHTML = p + '<small>%</small>';
      $('#bar').style.transform = 'scaleX(' + prog.shown.toFixed(4) + ')';
      $('#ringFill').style.strokeDashoffset = (RING_LEN * (1 - prog.shown)).toFixed(1);
      var ticks = document.querySelectorAll('#ringTicks line');
      for (var i = 0; i < ticks.length; i++) ticks[i].setAttribute('class', prog.shown >= i / 6 ? 'on' : '');
    }
  }
  setInterval(progTick, 100);

  // настоящий вызов игры гасит показ без игры: демо больше ничего не пишет,
  // ход загрузки начинается заново с настоящих чисел
  var real = false, demoOn = false, inDemo = false;
  function mark() {
    if (inDemo || real) return;
    real = true;
    if (demoT) { clearTimeout(demoT); demoT = null; }
    if (demoOn) { demoOn = false; prog.target = 0.02; prog.cap = 0.08; prog.shown = 0; prog.total = 0; prog.needed = 0; $('#mFiles').textContent = ''; $('#file').innerHTML = '&nbsp;'; }
  }
  window.GameDetails = function (server, url, map, maxp, steamid, gm, volume, lang) {
    mark();
    if (map) $('#mMap').textContent = String(map);
    if (maxp) $('#mSlots').textContent = 'мест ' + maxp;
    // volume - snd_musicvolume игрока (menu/loading.lua). Громкость им НЕ умножаем: у многих он
    // убавлен под музыку HL2 (у владельца 0.01) - музыка играла 2 с и глохла. Только 0 - выключить
    if (volume !== undefined && volume !== null && isFinite(+volume) && +volume <= 0) mute(true);
    stage(0.04, 0.09);
  };
  window.SetFilesTotal = function (n) { mark(); prog.total = +n || 0; files(); };
  window.SetFilesNeeded = function (n) { mark(); prog.needed = +n || 0; files(); };
  window.DownloadingFile = function (f) {
    mark();
    $('#file').textContent = String(f || '').replace(/\\/g, '/');
    if (!prog.total) stage(prog.target, Math.min(0.9, prog.cap + 0.004));
  };
  window.SetStatusChanged = function (s) { mark(); $('#status').textContent = tr(s); };

  // ── музыка: JoelFazhari - Synthetic Deception (Pixabay, без указания автора;
  // заказчик 05.10.2026). RMS -13.5 дБ, пик 0 дБ (декодер браузера) - на 3.5 дБ
  // тише прежнего I'm Reborn (-10 дБ при 18 %); 05.10 заказчик «погромче» - 40 %
  // (+3.4 дБ к 27 %); вход за 3 с; кнопка - выкл/вкл (в игре мышь на экране
  // загрузки выключена: loading.lua SetMouseInputEnabled(false))
  var mus = $('#music'), muted = false, VOL = 0.40, fadeT0 = 0;
  mus.volume = 0;
  function mute(on) { muted = on; mus.muted = on; $('#snd').className = on ? 'off' : ''; }
  function play() {
    try { var p = mus.play(); if (p && p.catch) p.catch(function () { }); } catch (e) { }
    if (!fadeT0) fadeT0 = performance.now();
  }
  setInterval(function () {
    if (!fadeT0) return;
    var k = Math.min(1, (performance.now() - fadeT0) / 3000);
    mus.volume = Math.max(0, Math.min(1, VOL * k));
    // встала сама (сбой потока, конец без loop) - запустить снова
    if (!muted && (mus.paused || mus.ended)) play();
  }, 100);
  play();
  $('#snd').addEventListener('click', function (e) { e.stopPropagation(); mute(!muted); if (!muted) play(); });
  document.addEventListener('mousedown', function () { if (!muted && mus.paused) play(); });

  // ── советы: только то, что проверено по коду сервера ─────────────────
  var TIPS = [
    'Кольцо на <b>ALT</b>: контакт, торговля, багажник машины. У полиции — обыск, арест, штраф, конвой и изъятие оружия для судмеда.',
    'На <b>C</b> — колесо: энергетика АЭС, ресурсы и налоги города, законы, база розыска, передача денег.',
    'Меню <b>F4</b>: работы, магазин и настройки — там же сброс ПИН-кода карты.',
    'Звонок на <b>112</b> с телефона уходит дежурным полиции, скорой и судмеда.',
    'В машине телефон открывается на <b>M</b>.',
    'Честные деньги — на карте. Наличные — для тёмных дел.',
    'Пополнить счёт и купить VIP — <b>F1</b>, прямо в игре. С VIP навыки растут в полтора раза быстрее.',
    'Наш Discord — <b>discord.gg/KKFJRjKgUy</b>.'
  ];
  var tipI = Math.floor(Math.random() * TIPS.length), tipEl = $('#tipText');
  tipEl.innerHTML = TIPS[tipI];
  setInterval(function () {
    tipEl.className = 'hide';
    setTimeout(function () { tipI = (tipI + 1) % TIPS.length; tipEl.innerHTML = TIPS[tipI]; tipEl.className = ''; }, 480);
  }, 7000);

  // ── слайды ──────────────────────────────────────────────────────────────
  chap.innerHTML = SLIDES.map(function (sl, i) {
    return '<button class="ch" type="button" data-i="' + i + '"><i></i><b>' + pad2(i + 1) + '</b><span>' + sl.chap + '</span></button>';
  }).join('');
  chap.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.ch') : null;
    if (b && docked) show(+b.getAttribute('data-i'));
  });
  document.addEventListener('keydown', function (e) {
    if (!docked) return;
    if (e.keyCode === 39) show((cur + 1) % SLIDES.length);
    else if (e.keyCode === 37) show((cur + SLIDES.length - 1) % SLIDES.length);
    else if (e.keyCode === 32) { hold = !hold; if (!hold) schedule(); else clearTimeout(nextT); }
  });

  function slideHTML(i) {
    var sl = SLIDES[i], t = '', k, ch;
    for (k = 0; k < sl.title.length; k++) {
      ch = sl.title.charAt(k);
      t += ch === ' ' ? '<span class="sp"></span>' : '<span class="tl" style="transition-delay:' + (k * 26) + 'ms">' + ch + '</span>';
    }
    var facts = sl.facts.map(function (f, j) {
      return '<li style="transition-delay:' + (430 + j * 90) + 'ms"><b>' + f[0] + '</b><span>' + f[1] + '</span></li>';
    }).join('');
    var V = VIG[sl.id];
    return '<div class="sl" data-id="' + sl.id + '">' +
      '<div class="kick"><b>' + pad2(i + 1) + '</b><i></i><span>' + sl.kick + '</span></div>' +
      '<h1 class="ttl"><span class="tt">' + t + '</span></h1>' +
      '<div class="txt"><p class="lead">' + sl.lead + '</p><ul class="facts">' + facts + '</ul></div>' +
      '<figure class="vig v-' + sl.id + '"><div class="vig-in">' + vigBody(V) + '</div>' +
      '<span class="cn a"></span><span class="cn b"></span><span class="cn c"></span><span class="cn d"></span>' +
      '<figcaption><b>РИС. ' + (i + 1) + '</b>' + sl.cap + '</figcaption></figure></div>';
  }
  // схема - SVG 730x530; телефон, Синуслуги и навыки с сайта - HTML-витрина (V.box)
  function vigBody(V) {
    if (V && V.box) return V.box();
    return '<svg viewBox="0 0 730 530" xmlns="http://www.w3.org/2000/svg">' + (V ? V.html() : '') + '</svg>';
  }
  function vigRoot(el) { var b = el.querySelector('.vig-in'); return b ? b.firstElementChild : null; }
  function fitTitle(el) {
    var h = el.querySelector('.ttl'), tt = el.querySelector('.tt');
    h.style.fontSize = '120px';
    var w = tt.offsetWidth;
    if (w > 1180) h.style.fontSize = Math.max(70, Math.floor(120 * 1180 / w)) + 'px';
  }
  function camTo(sl, instant) {
    var L = sl.loc, s = S.s, ax, ay, fx = L.x, fy = L.y, z = L.z;
    MAP.labelZ(0.05 * s);
    if (L.frame && window.SYN_MAPDATA) {
      // маршрут целиком в свободном окне над картой (правее заголовка)
      var R = window.SYN_MAPDATA.route, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, F = L.frame;
      for (var i = 0; i < R.length; i += 2) { x0 = Math.min(x0, R[i]); x1 = Math.max(x1, R[i]); y0 = Math.min(y0, R[i + 1]); y1 = Math.max(y1, R[i + 1]); }
      fx = (x0 + x1) / 2; fy = (y0 + y1) / 2;
      z = Math.min((F[2] - F[0]) / (x1 - x0 || 1), (F[3] - F[1]) / (y1 - y0 || 1));
      ax = S.ox + (F[0] + F[2]) / 2 * s; ay = S.oy + (F[1] + F[3]) / 2 * s;
    } else if (L.wide) { ax = S.ox + 1256 * s; ay = S.oy + 560 * s; }
    else { ax = S.ox + (L.ax || PIN_X) * s; ay = S.oy + (L.ay || PIN_Y) * s; }
    var tg = { x: fx, y: fy, z: z * s, r: (L.r || 0) * Math.PI / 180, ax: ax, ay: ay };
    if (instant) MAP.set(tg); else MAP.fly(tg, FLY);
  }
  function pinFor(sl) {
    var L = sl.loc;
    pin.style.left = (L.ax || PIN_X) + 'px';
    pin.style.top = (L.ay || PIN_Y) + 'px';
    pin.className = 'pin' + (L.secret ? ' secret' : '');
    if (L.secret) {
      $('#pinName').textContent = 'Адрес засекречен';
      $('#pinSub').textContent = L.sub;
      $('#pinXY').innerHTML = 'X <span class="rd" style="width:46px"></span> Y <span class="rd" style="width:40px"></span>';
    } else {
      $('#pinName').textContent = L.name;
      $('#pinSub').textContent = L.sub;
      $('#pinXY').textContent = 'X ' + String(L.x).replace('-', '−') + ' · Y ' + String(L.y).replace('-', '−');
    }
  }
  function killVig() {
    if (TL) { TL.kill(); TL = null; }
    for (var id in VIG) if (VIG[id].stop) VIG[id].stop();
    MAP.clearRoute();
    MAP.dots(null);
  }
  function slideDur() { return REEL ? REEL[reelI][1] : SLIDES[cur].dur; }
  function schedule() {
    clearTimeout(nextT);
    if (hold) return;
    if (REEL) {
      nextT = setTimeout(function () { if (reelI + 1 < REEL.length) { reelI++; show(REEL[reelI][0]); } }, slideDur());
      return;
    }
    nextT = setTimeout(function () { show((cur + 1) % SLIDES.length); }, SLIDES[cur].dur);
  }
  function show(i) {
    var old = slideBox.querySelectorAll('.sl');
    for (var k = 0; k < old.length; k++) {
      if (old[k].classList.contains('out')) { old[k].parentNode.removeChild(old[k]); continue; }
      old[k].classList.remove('in'); old[k].classList.add('out');
      (function (el) { setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 800); })(old[k]);
    }
    killVig();
    var first = cur < 0;
    cur = i;
    var sl = SLIDES[i];
    var wrap = document.createElement('div');
    wrap.innerHTML = slideHTML(i);
    var el = wrap.firstChild;
    slideBox.appendChild(el);
    fitTitle(el);
    if (VIG[sl.id] && VIG[sl.id].layout) VIG[sl.id].layout(vigRoot(el));
    // главы
    var cs = chap.querySelectorAll('.ch');
    for (k = 0; k < cs.length; k++) {
      cs[k].className = 'ch' + (k < i ? ' done' : '');
      cs[k].querySelector('i').style.transitionDuration = '0ms';
    }
    var bar = cs[i].querySelector('i');
    void bar.offsetWidth;
    bar.style.transitionDuration = (hold ? 0 : slideDur()) + 'ms';
    cs[i].className = 'ch on';
    $('#count').innerHTML = pad2(i + 1) + ' <em>/ ' + pad2(SLIDES.length) + '</em>';
    // камера и булавка
    pin.classList.remove('on');
    clearTimeout(pinT);
    camTo(sl, false);
    VK.speed = REEL ? REEL[reelI][2] : 1;
    pinT = setTimeout(function () {
      if (cur !== i) return;
      if (!sl.loc.wide && !sl.loc.frame) { pinFor(sl); pin.classList.add('on'); }
      if (sl.loc.route && window.SYN_MAPDATA) MAP.route(window.SYN_MAPDATA.route, 2000);
      if (sl.loc.gps && window.SYN_MAPDATA) MAP.dots(window.SYN_MAPDATA.gps);
    }, PIN_WAIT);
    if (!first) EMB.kick();
    setTimeout(function () { el.classList.add('in'); }, first ? 30 : 200);
    // пример
    var V = VIG[sl.id], root = vigRoot(el);
    TL = new VK.Timeline();
    var myTL = TL;
    if (V && V.run) setTimeout(function () { if (TL === myTL) V.run(root, myTL); }, 450);
    schedule();
  }

  // ── вступление ─────────────────────────────────────────────────────────
  function start() {
    // казино виртуальное (только в телефоне, владелец 05.10) - с плана города его подпись и место убраны, как на сайте
    var D = window.SYN_MAPDATA;
    if (D) {
      D.marks = D.marks.filter(function (m) { return m[2] !== 'casino'; });
      D.gps = D.gps.filter(function (g) { return g[1] !== 'Казино'; });
    }
    MAP.init($('#map'));
    EMB.init($('#emblem'));
    var skip = Q.s !== undefined || Q.nointro !== undefined;
    fit();
    window.addEventListener('resize', fit);
    // окно могли поменять без события resize (эмуляция размера, смена режима игры)
    var lw = window.innerWidth, lh = window.innerHeight;
    setInterval(function () { if (window.innerWidth !== lw || window.innerHeight !== lh) { lw = window.innerWidth; lh = window.innerHeight; fit(); } }, 500);
    if (Q.bench !== undefined) {
      var mb = MAP.bench(20), res = { w: window.innerWidth, h: window.innerHeight, map_full_ms: +mb.full.toFixed(2), map_fly_ms: +mb.fly.toFixed(2), emb_ms: +EMB.bench(60).toFixed(2), faces: EMB.faces() };
      document.body.setAttribute('data-bench', JSON.stringify(res));
      return;
    }
    if (skip) {
      docked = true; body.classList.remove('intro'); body.classList.add('docked', 'glow');
      EMB.resize(S.s * dpr);
      EMB.start(true);
      show(Math.max(0, Math.min(SLIDES.length - 1, (+Q.s || 1) - 1)));
      return;
    }
    emb.style.transition = 'none';
    emb.style.transform = 'translate(' + (960 - EMB_CX) + 'px,' + (540 - EMB_CY) + 'px) scale(' + INTRO_SCALE + ')';
    void emb.offsetWidth;
    emb.style.transition = '';
    MAP.set(overview());
    MAP.reveal(S.ox + 960 * S.s, S.oy + 540 * S.s, 0);
    EMB.start(false);
    setTimeout(function () { MAP.reveal(S.ox + 960 * S.s, S.oy + 540 * S.s, 1900); body.classList.add('glow'); }, 1650);
    setTimeout(function () {
      docked = true;
      body.classList.add('docked');
      emb.style.transform = '';
    }, 3700);
    setTimeout(function () { body.classList.remove('intro'); }, 4100);
    setTimeout(function () { EMB.resize(S.s * dpr); show(REEL ? REEL[0][0] : 0); }, 4700);
  }

  // ── показ без игры ─────────────────────────────────────────────────────
  var demoT = null;
  function demo() {
    var steps = [], t = 300, i, n = 14;
    steps.push([t, function () { window.GameDetails('СИНДИКАТ RP', '', 'rp_syndicate', 64, '76561198000000000', 'darkrp', 1, 'ru'); }]);
    steps.push([t += 900, function () { window.SetStatusChanged('Retrieving server info...'); }]);
    steps.push([t += 1600, function () { window.SetStatusChanged('Mounting Addons'); }]);
    var names = ['Syndicate Energy', 'Syndicate Forensic', 'Синдикат RP | Карта', 'rp_riverden_content', 'Syndicate Phone', 'Syndicate ATM', 'TacRP Weapons', 'LVS Cars', 'Syndicate Models', 'Zeros Farm', 'Zeros Oil', 'Syndicate Sounds', 'Syndicate NPC', 'Syndicate Textures'];
    for (i = 1; i <= n; i++) (function (i) { steps.push([t += 2600, function () { window.SetStatusChanged('Downloading \'' + names[i - 1] + '\' (' + i + ' of ' + n + ')'); }]); })(i);
    steps.push([t += 2000, function () { window.SetStatusChanged('Workshop Complete'); window.SetFilesTotal(48); window.SetFilesNeeded(48); }]);
    for (i = 47; i >= 0; i--) (function (i) {
      steps.push([t += 300, function () { window.DownloadingFile('materials/syndicate/lab/fx_device_' + (48 - i) + '.vtf'); window.SetFilesNeeded(i); }]);
    })(i);
    steps.push([t += 1200, function () { window.SetStatusChanged('Sending client info...'); }]);
    steps.push([t += 2400, function () { window.SetStatusChanged('Client info sent!'); }]);
    steps.push([t += 1500, function () { window.SetStatusChanged('Received all Lua files we needed!'); }]);
    steps.push([t += 1500, function () { window.SetStatusChanged('Starting Lua...'); }]);
    steps.push([t += 4000, function () { window.SetStatusChanged('Lua Started!'); }]);
    demoOn = true;
    // ?demolen=мс - растянуть или сжать показ загрузки (для ролика)
    var k = Q.demolen ? (+Q.demolen) / t : 1;
    steps.forEach(function (s) { setTimeout(function () { if (!demoOn) return; inDemo = true; try { s[1](); } finally { inDemo = false; } }, s[0] * k); });
  }
  if (Q.demo !== undefined && Q.demo !== '0') demo();
  else if (Q.demo === undefined && !/GMod|Valve/i.test(navigator.userAgent)) demoT = setTimeout(function () { if (!real) demo(); }, 2500);

  // вступление первые 4 с - только холсты, текст появляется позже: шрифты
  // грузятся параллельно, а когда пришли - перемеряем заголовок и подписи карты
  start();
  if (document.fonts && document.fonts.load) {
    var fs = ['400 120px "Syn Stencil"', '600 40px "Syn Handjet"', '400 20px "Syn Handjet"', '400 20px "Syn PT"', '700 20px "Syn Narrow"', '400 20px "Syn Narrow"'];
    Promise.all(fs.map(function (f) { return document.fonts.load(f); })).then(function () {
      MAP.labelZ(-1); MAP.labelZ(0.05 * S.s); MAP.redraw();
      var el = slideBox.querySelector('.sl:not(.out)');
      if (el) {
        fitTitle(el);
        var V = VIG[SLIDES[cur].id];
        if (V && V.layout) V.layout(vigRoot(el));
      }
    }, function () { });
  }
})();
