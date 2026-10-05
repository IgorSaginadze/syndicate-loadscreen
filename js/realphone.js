/* КОПИЯ С САЙТА (site/js/realphone.js) - build/lssite.py; здесь не править, cqw переведены в px */
/* realphone.js - телефон из игры на сайте: настоящие экраны (build/sitephone.py снимает их кодом
 * самого телефона, тем же шрифтом и теми же значками) и анимации, повторённые по коду игры:
 *   раскрытие приложения из значка - cl_os.lua draw_app_layer: 0,40 с, D.EaseOut (1 - (1-t)^3),
 *     стол позади растёт на 8 % и темнеет до 170/255, значок тает за первые 40 % хода;
 *   переход внутри Синуслуг - cl_gov.lua APP:Draw: 0,32 с, старый экран отходит на треть
 *     ширины и темнеет до 110/255, новый въезжает справа; панель вкладок стоит;
 *   снятие блокировки - 0,38 с вверх.
 * Координаты - точки экрана телефона (390 x 843), как в Lua.
 * VIG.phone - рабочий стол: автопоказ, а нажал посетитель на значок - открывается его экран.
 * VIG.gov - Синуслуги: кабинет -> выборы мэра -> голос. Оба - HTML-витрины (V.box).
 */
var REALPHONE = (function () {
  'use strict';
  var P = window.SYN_PHONE, W = P.W, H = P.H, IMG = 'img/phone/';
  var STATUS_H = 46;                       // полоса часов и батареи: её рисует оболочка, она не ездит
  function eout(t) { t = 1 - Math.max(0, Math.min(1, t)); return 1 - t * t * t; }
  function eio(t) { t = Math.max(0, Math.min(1, t)); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function px(v) { return (v / W * 100).toFixed(3) + '%'; }     // точки по ширине -> %
  function py(v) { return (v / H * 100).toFixed(3) + '%'; }     // точки по высоте -> %
  function $(r, s) { return r.querySelector(s); }
  // адрес картинки с меткой версии (md5 из sitephone.py): nginx держит картинки неделю
  function U(n) { return IMG + n + '.webp' + (P.v && P.v[n] ? '?v=' + P.v[n] : ''); }

  // ── один «кадр» экрана: снимок сверху и, если экран длинный, окно с полосой прокрутки ──
  // живой экран «один раз» (загрузка даркнета): каждое открытие - заново. Тот же адрес картинки
  // браузер не перезапускает, поэтому картинку берём один раз и даём ей новый blob-адрес.
  var blobs = {};
  function playOnce(img) {
    var url = img.getAttribute('data-once');
    if (!blobs[url]) blobs[url] = fetch(url).then(function (r) { return r.blob(); });
    blobs[url].then(function (b) {
      if (img.src && img.src.indexOf('blob:') === 0) URL.revokeObjectURL(img.src);
      img.src = URL.createObjectURL(b);
    }, function () { img.src = url; });
  }
  function page(name) {
    var a = P.anim && P.anim[name.replace(/^app_/, '')], once = a && a.once;
    var s = P.strips[name], k = W / P.px, o = '<div class="rp-pg" data-n="' + name + '"><img ' +
      (once ? 'data-once="' + U(name) + '"' : 'src="' + U(name) + '"') + ' alt="" draggable="false">';
    if (s) {
      o += '<div class="rp-win" style="top:' + py(s.y0 * k) + ';height:' + py((s.y1 - s.y0) * k) + '">' +
        '<img src="' + U(name + '_strip') + '" alt="" draggable="false"></div>';
    }
    return o + '</div>';
  }

  function html(o) {
    o = o || {};
    var r = '<div class="rph' + (o.cls ? ' ' + o.cls : '') + '"><div class="rp-scr" style="--cr:' + (P.corner * 730).toFixed(2) + 'px">' +
      '<img class="rp-home" src="' + U('home') + '" alt="" draggable="false"><div class="rp-dim"></div>' +
      '<div class="rp-app"><div class="rp-in"></div><img class="rp-ic" alt=""></div>';
    P.banners.forEach(function (b, i) {
      r += '<img class="rp-ban rp-ban' + i + '" src="' + U(b.name) + '" alt="" style="top:' + py(b.y0 * W / P.px) + ';height:' + py((b.y1 - b.y0) * W / P.px) + '">';
    });
    if (o.lock) r += '<img class="rp-lock" src="' + U('lock') + '" alt="" draggable="false">';
    if (o.hits) {
      r += '<div class="rp-hits">';
      P.layout.forEach(function (it) {
        r += '<button class="rp-hit" data-id="' + it.id + '" title="' + it.name + '" style="left:' + px(it.x - 6) + ';top:' + py(it.y - 6) +
          ';width:' + px(it.s + 12) + ';height:' + py(it.s + (it.dock ? 12 : 30)) + '"></button>';
      });
      r += '<button class="rp-bar" title="Домой" style="top:' + py(H - 40) + ';height:' + py(40) + '"></button></div>';
    }
    return r + '<i class="rp-tap"></i></div></div>';
  }

  // ── управление: каждое действие - сразу; когда - решает тот, кто зовёт (Timeline сайта) ──
  function ctl(root) {
    var scr = $(root, '.rp-scr'), home = $(root, '.rp-home'), dim = $(root, '.rp-dim');
    var app = $(root, '.rp-app'), inn = $(root, '.rp-in'), ic = $(root, '.rp-ic'), tapEl = $(root, '.rp-tap');
    var gen = 0, st = { open: null, from: null, page: null, scroll: 0 };
    function run(dur, fn, ease, done) {
      var my = ++gen, t0 = performance.now();
      (function step() {
        if (my !== gen) return;                                   // новое движение отменяет старое
        var k = Math.min(1, (performance.now() - t0) / dur);
        fn((ease || eout)(k), k);
        if (k < 1) requestAnimationFrame(step); else if (done) done();
      })();
    }
    // отдельный счётчик для прокрутки и баннера: они идут поверх открытия
    function runFree(dur, fn, ease, done) {
      var t0 = performance.now();
      (function step() {
        if (!root.isConnected) return;
        var k = Math.min(1, (performance.now() - t0) / dur);
        fn((ease || eout)(k), k);
        if (k < 1) requestAnimationFrame(step); else if (done) done();
      })();
    }
    function layer(f, fr) {
      // f = 0: приложение - это значок fr; f = 1: весь экран
      var x = lerp(fr.x, 0, f), y = lerp(fr.y, 0, f), w = lerp(fr.s, W, f), h = lerp(fr.s, H, f);
      var r = lerp(fr.s * 0.225, W * P.corner, f), k = scr.clientWidth / W;
      app.style.left = px(x); app.style.top = py(y); app.style.width = px(w); app.style.height = py(h);
      app.style.borderRadius = (r * k).toFixed(1) + 'px';
      ic.style.opacity = Math.max(0, 1 - f * 2.5).toFixed(3);
      var s = 1 + 0.08 * f;
      home.style.transform = 'scale(' + s.toFixed(4) + ')';
      dim.style.opacity = (170 / 255 * f).toFixed(3);
    }
    function iconOf(id) { for (var i = 0; i < P.layout.length; i++) if (P.layout[i].id === id) return P.layout[i]; return null; }
    var api = {
      root: root,
      state: st,
      // приложение id (экран name, по умолчанию app_<id>) раскрывается из своего значка
      open: function (id, name, done) {
        var it = iconOf(id) || { x: W / 2 - 31, y: H / 2 - 31, s: 62, icon: id };
        st.open = id; st.from = it; st.scroll = 0;
        inn.innerHTML = page(name || 'app_' + id); st.page = name || 'app_' + id;
        [].forEach.call(inn.querySelectorAll('img[data-once]'), playOnce);
        ic.src = U('ic_' + (it.icon || id));
        app.classList.add('on'); root.classList.add('is-app');
        run(400, function (f) { layer(f, it); }, eout, done);
      },
      // сразу открытое (Синуслуги начинаются уже внутри приложения)
      show: function (name) {
        st.open = name; st.from = { x: W / 2 - 31, y: H / 2 - 31, s: 62 }; st.page = name; st.scroll = 0;
        inn.innerHTML = page(name); app.classList.add('on'); root.classList.add('is-app');
        gen++; layer(1, st.from);
      },
      close: function (done) {
        if (!st.open) return;
        var fr = st.from;
        run(400, function (f) { layer(1 - f, fr); }, eout, function () {
          app.classList.remove('on'); root.classList.remove('is-app'); st.open = null; inn.innerHTML = '';
          home.style.transform = ''; dim.style.opacity = 0;
          if (done) done();
        });
      },
      unlock: function () {
        var lk = $(root, '.rp-lock');
        if (!lk) return;
        home.style.opacity = 0;
        runFree(380, function (e) { lk.style.transform = 'translateY(' + (-100 * e).toFixed(2) + '%)'; home.style.opacity = Math.min(1, e * 1.6).toFixed(3); }, eout,
          function () { lk.style.display = 'none'; });
      },
      lock: function () {
        var lk = $(root, '.rp-lock');
        if (!lk) return;
        lk.style.display = ''; lk.style.transform = 'none'; home.style.opacity = 1;
      },
      // палец: кружок, как OS.DrawFinger (r 15, белый 70/255 и обводка)
      tap: function (x, y, toY) {
        // кадрами из JS, не CSS-анимацией: та в безголовой проверке (siteshot) залипает на старте
        tapEl.style.left = px(x); tapEl.style.top = py(y);
        runFree(550, function (e, k) {
          var a = k < 0.2 ? k / 0.2 : k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
          tapEl.style.opacity = a.toFixed(3);
          tapEl.style.transform = 'scale(' + (k < 0.2 ? 0.73 + 0.27 * k / 0.2 : 1).toFixed(3) + ')';
          if (toY != null) tapEl.style.top = py(lerp(y, toY, eio(Math.min(1, k / 0.55))));
        }, function (k) { return k; });
      },
      banner: function (i, ms) {
        var b = $(root, '.rp-ban' + i);
        if (!b) return;
        b.classList.add('on');
        setTimeout(function () { b.classList.remove('on'); }, ms || 2400);
      },
      // прокрутка длинного экрана до y точек
      scroll: function (y, ms) {
        var win = $(inn, '.rp-pg:last-child .rp-win img'), s = P.strips[st.page];
        if (!win || !s) return;
        y = Math.max(0, Math.min(s.max, y));
        var y0 = st.scroll, k = 100 / ((s.y1 - s.y0) * W / P.px + s.max);   // % высоты полосы на точку
        st.scroll = y;
        runFree(ms || 900, function (e) { win.style.transform = 'translateY(' + (-lerp(y0, y, e) * k).toFixed(3) + '%)'; }, eio);
      },
      // переход вперёд (как APP:Push): новый экран справа, старый отходит на треть и темнеет
      push: function (name, ms) {
        var old = $(inn, '.rp-pg:last-child'), s = P.strips[name];
        var bot = s ? s.y1 * W / P.px : H;
        inn.insertAdjacentHTML('beforeend', page(name));
        var nw = $(inn, '.rp-pg:last-child');
        var clip = 'inset(' + py(STATUS_H) + ' 0 ' + py(H - bot) + ' 0)';
        nw.style.clipPath = clip;
        var sh = document.createElement('div'); sh.className = 'rp-pdim'; sh.style.clipPath = clip; old.appendChild(sh);
        old.style.clipPath = clip;
        // часы и панель старого экрана остаются на месте: под ними его же снимок без движения
        var keep = document.createElement('img'); keep.className = 'rp-keep'; keep.src = old.querySelector('img').src;
        inn.insertBefore(keep, old);
        st.page = name; st.scroll = 0;
        runFree(ms || 320, function (e) {
          nw.style.transform = 'translateX(' + (100 * (1 - e)).toFixed(2) + '%)';
          old.style.transform = 'translateX(' + (-30 * e).toFixed(2) + '%)';
          sh.style.opacity = (110 / 255 * e).toFixed(3);
        }, eout, function () { old.remove(); keep.remove(); nw.style.clipPath = ''; nw.style.transform = ''; });
      },
      // тот же экран с новыми данными (голос учтён): смена без движения, на той же прокрутке
      swap: function (name, ms) {
        var old = $(inn, '.rp-pg:last-child');
        inn.insertAdjacentHTML('beforeend', page(name));
        var nw = $(inn, '.rp-pg:last-child'), s = P.strips[name], y = Math.min(st.scroll, s ? s.max : 0);
        if (s) $(nw, '.rp-win img').style.transform = 'translateY(' + (-y * 100 / ((s.y1 - s.y0) * W / P.px + s.max)).toFixed(3) + '%)';
        st.page = name; st.scroll = y;
        nw.style.opacity = 0;
        runFree(ms || 260, function (e) { nw.style.opacity = e.toFixed(3); }, eout, function () { old.remove(); });
      }
    };
    return api;
  }

  return { html: html, ctl: ctl, page: page };
})();

(function () {
  'use strict';
  var P = window.SYN_PHONE;
  if (!P || !window.VIG) return;
  var RP = REALPHONE;

  // что делает каждое приложение - одной строкой (подпись справа от телефона)
  var ABOUT = {
    bank: 'Счёт, карта, переводы и кредит', exchange: 'Акции компаний города, цены идут живьём',
    social: 'Молва: что говорят в городе', navigator: 'Карта города и маршрут до места',
    darknet: 'Вход через три узла, без имён', taxi: 'Такси: водитель — живой игрок',
    food: 'Доставка еды от повара-игрока', weapons: 'Оружие с доставкой', gov: 'Синуслуги: штрафы, лицензии, выборы',
    jobs: 'Центр занятости: вакансии', casino: 'Краш, рулетка, слоты, блэкджек, покер, дурак',
    garage: 'Свои машины: где стоят, бак, состояние', calculator: 'Калькулятор', contacts: 'Телефонная книжка',
    npp: 'Пульт АЭС: выработка и деньги смены', business: 'Доля с оборота отраслей города',
    phone: 'Звонки и вызов 112', messages: 'СМС с эмодзи и ответом', camera: 'Снимки — в галерею и в Молву',
    gallery: 'Снимки с камеры'
  };
  function nameOf(id) { for (var i = 0; i < P.layout.length; i++) if (P.layout[i].id === id) return P.layout[i].name; return id; }

  // ── ТЕЛЕФОН: стол, уведомления, приложения; посетитель может жать сам ──
  VIG.phone = {
    box: function () {
      return '<div class="rpw rpw-phone">' +
        '<div class="rpn rpn-l"><s>ТЕЛЕФОН В ИГРЕ</s><b>' + P.layout.length + ' приложений</b>' +
        '<p>Экраны — из самой игры: тот же интерфейс, те же значки, те же кнопки.</p>' +
        '<p class="rpn-k">Уведомления приходят, даже когда телефон в кармане.</p></div>' +
        RP.html({ lock: true, hits: true }) +
        '<div class="rpn rpn-r"><s>СЕЙЧАС ОТКРЫТО</s><b class="rp-now">Рабочий стол</b><p class="rp-about">Свайп вверх — и город в кармане.</p></div>' +
        '<div class="rp-hint"><i></i>Нажми на значок — откроется экран приложения</div></div>';
    },
    run: function (root, T) {
      var C = RP.ctl(root), now = root.querySelector('.rp-now'), about = root.querySelector('.rp-about'), user = false;
      function say(id) {
        now.textContent = id ? nameOf(id) : 'Рабочий стол';
        about.textContent = id ? (ABOUT[id] || '') : 'Экраны и анимации — из самой игры.';
        root.querySelector('.rpn-r').classList.remove('flash'); void root.offsetWidth; root.querySelector('.rpn-r').classList.add('flash');
      }
      function openApp(id) { var it = null; P.layout.forEach(function (l) { if (l.id === id) it = l; }); if (it) C.tap(it.x + it.s / 2, it.y + it.s / 2); C.open(id); say(id); }
      function closeApp() { C.tap(W2, P.H - 8); C.close(); say(null); }
      var W2 = P.W / 2;
      // посетитель сам: автопоказ больше ничего не трогает
      root.addEventListener('click', function (e) {
        var b = e.target.closest('.rp-hit, .rp-bar');
        if (!b) return;
        if (!user) { user = true; T.kill(); C.lock(); root.querySelector('.rp-lock').style.display = 'none'; root.querySelector('.rp-home').style.opacity = 1; root.classList.add('user'); }
        if (b.classList.contains('rp-bar')) { if (C.state.open) closeApp(); return; }
        var id = b.getAttribute('data-id');
        if (C.state.open === id) return;
        if (C.state.open) C.close(function () { openApp(id); }); else openApp(id);
      });
      // автопоказ
      // [приложение, баннер перед ним (-1 - нет), сколько держать открытым, мс]
      var SHOW = [['bank', 0, 1800], ['casino', -1, 3200], ['darknet', -1, 4400], ['social', -1, 2200], ['gov', 2, 1800],
        ['jobs', -1, 1800], ['weapons', -1, 2000], ['gallery', -1, 1800], ['exchange', 1, 1800]];
      T.at(700, function () { C.tap(W2, 700, 300); C.unlock(); });
      function cycle(t) {
        var at = t;
        SHOW.forEach(function (s) {
          var t0 = at;
          if (s[1] >= 0) T.at(t0, function () { C.banner(s[1], 1700); });
          T.at(t0 + 1400, function () { openApp(s[0]); });
          T.at(t0 + 1400 + s[2], function () { closeApp(); });
          at = t0 + 1400 + s[2] + 400;
        });
        T.at(at, function () { cycle(0); });
      }
      cycle(1500);
    }
  };

  // ── СИНУСЛУГИ: кабинет -> выборы мэра -> голос -> итоги ──
  function note(cls, title, l1, l2) {
    return '<div class="rpc ' + cls + '"><s>' + title + '</s><p>' + l1 + '</p>' + (l2 ? '<p>' + l2 + '</p>' : '') + '</div>';
  }
  VIG.gov = {
    box: function () {
      return '<div class="rpw rpw-gov">' +
        '<div class="rpcol rpcol-l">' + note('g1', 'ЛИЧНЫЙ КАБИНЕТ', 'Паспорт, штрафы и лицензии', 'жителя — в одной карточке.') +
        note('g2', 'ВЫБОРЫ МЭРА', 'Голосуют только здесь:', 'один житель — один голос.') + '</div>' +
        RP.html({}) +
        '<div class="rpcol rpcol-r">' + note('g3', 'БЮЛЛЕТЕНЬ', 'Кандидаты с программой,', 'проценты считает сервер.') +
        note('g4', 'ЕЩЁ В ПРИЛОЖЕНИИ', 'Законы, мэрия, обращения,', 'досье, суд и выборы судьи.') + '</div></div>';
    },
    run: function (root, T) {
      var C = RP.ctl(root), W2 = P.W / 2;
      function co(n) { [].forEach.call(root.querySelectorAll('.rpc'), function (e, i) { e.classList.toggle('on', i === n); }); }
      C.show('gov_home'); co(0);
      T.at(900, function () { C.scroll(101, 1200); });
      T.at(2400, function () { C.scroll(0, 900); });
      T.at(3500, function () { C.tap(W2, 378); });
      T.at(3750, function () { C.push('gov_vote'); co(1); });
      T.at(5000, function () { co(2); C.scroll(260, 1500); });
      T.at(6900, function () { C.scroll(0, 800); });
      T.at(8000, function () { C.tap(W2, 515); });
      T.at(8200, function () { C.swap('gov_voted'); co(1); });
      T.at(9300, function () { co(3); C.scroll(440, 2600); });
    }
  };
})();
