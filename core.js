/* PrepTrack by UD — core: storage, users, timer, goal, accordion, helpers */
(function () {
  'use strict';
  var PT = window.PT = window.PT || {};
  PT.VERSION = '1.0.0';

  /* ---------- tiny helpers ---------- */
  var $ = PT.$ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = PT.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  PT.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  PT.on = function (root, ev, sel, fn) {
    root.addEventListener(ev, function (e) {
      var t = e.target.closest ? e.target.closest(sel) : null;
      if (t && root.contains(t)) fn.call(t, e, t);
    });
  };
  PT.pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  PT.dkey = function (d) { d = d || new Date(); return d.getFullYear() + '-' + PT.pad(d.getMonth() + 1) + '-' + PT.pad(d.getDate()); };
  PT.today = function () { return PT.dkey(new Date()); };
  PT.parseKey = function (k) { var p = k.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
  PT.addDays = function (d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; };
  PT.daysBetween = function (a, b) { return Math.round((PT.parseKey(PT.dkey(b)) - PT.parseKey(PT.dkey(a))) / 86400000); };
  PT.clock = function (sec) { sec = Math.max(0, Math.floor(sec)); return PT.pad(Math.floor(sec / 3600)) + ':' + PT.pad(Math.floor(sec % 3600 / 60)) + ':' + PT.pad(sec % 60); };
  PT.hm = function (sec) {
    sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.round(sec % 3600 / 60);
    if (m === 60) { h++; m = 0; }
    return h ? h + 'h ' + PT.pad(m) + 'm' : m + 'm';
  };
  PT.hrs = function (sec) { return (sec / 3600).toFixed(1) + 'h'; };
  PT.uid = function () { return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); };
  PT.cssVar = function (n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };
  PT.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  PT.DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /* seeded RNG */
  PT.hashStr = function (s) { var h = 1779033703 ^ s.length; for (var i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return (h ^= h >>> 16) >>> 0; };
  PT.rng = function (seed) {
    var a = typeof seed === 'string' ? PT.hashStr(seed) : seed >>> 0;
    var f = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    f.int = function (lo, hi) { return lo + Math.floor(f() * (hi - lo + 1)); };
    f.pick = function (arr) { return arr[Math.floor(f() * arr.length)]; };
    f.shuffle = function (arr) { var a2 = arr.slice(); for (var i = a2.length - 1; i > 0; i--) { var j = Math.floor(f() * (i + 1)); var t = a2[i]; a2[i] = a2[j]; a2[j] = t; } return a2; };
    return f;
  };

  /* sha256 (works in insecure contexts too) */
  PT.sha256 = function (ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var K = [], H = [], isP = {}, c = 0, cand;
    for (cand = 2; c < 64; cand++) { if (!isP[cand]) { for (var i = 0; i < 313; i += cand) isP[i] = cand; H[c] = (Math.pow(cand, .5) * 4294967296) | 0; K[c++] = (Math.pow(cand, 1 / 3) * 4294967296) | 0; } }
    H = H.slice(0, 8);
    ascii = unescape(encodeURIComponent(ascii));
    var l = ascii.length, words = [], j, bl = l * 8;
    ascii += '\x80'; while (ascii.length % 64 - 56) ascii += '\x00';
    for (j = 0; j < ascii.length; j++) { words[j >> 2] = (words[j >> 2] || 0) | (ascii.charCodeAt(j) << ((3 - j) % 4) * 8); }
    words[words.length] = ((bl / 4294967296) | 0); words[words.length] = (bl | 0);
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), old = H.slice(0); H = H.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2], a = H[0], e = H[4];
        var t1 = H[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & H[5]) ^ (~e & H[6])) + K[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & H[1]) ^ (a & H[2]) ^ (H[1] & H[2]));
        H = [(t1 + t2) | 0].concat(H); H[4] = (H[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) H[i] = (H[i] + old[i]) | 0;
    }
    var out = ''; for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (H[i] >> (j * 8)) & 255; out += (b < 16 ? '0' : '') + b.toString(16); }
    return out;
  };

  /* ---------- native bridge (Android WebView / Windows Electron / browser) ---------- */
  var nat = PT.native = {
    kind: window.AndroidBridge ? 'android' : (window.PTNative ? 'desktop' : 'web'),
    notify: function (t, b) {
      try {
        if (nat.kind === 'android') { window.AndroidBridge.notify(t, b); return; }
        if (nat.kind === 'desktop') { window.PTNative.notify(t, b); return; }
        if ('Notification' in window && Notification.permission === 'granted') {
          if (navigator.serviceWorker && navigator.serviceWorker.ready) {
            navigator.serviceWorker.ready.then(function (r) { r.showNotification(t, { body: b, icon: 'icons/icon-192.png', badge: 'icons/notif-96.png', tag: 'pt' }); }).catch(function () { new Notification(t, { body: b }); });
          } else new Notification(t, { body: b });
        }
      } catch (e) { }
    },
    askPermission: function () {
      try {
        if (nat.kind === 'android') { window.AndroidBridge.requestNotifications(); return Promise.resolve(true); }
        if (nat.kind === 'desktop') return Promise.resolve(true);
        if ('Notification' in window) return Promise.resolve(Notification.requestPermission()).then(function (p) { return p === 'granted'; });
      } catch (e) { }
      return Promise.resolve(false);
    },
    canNotify: function () {
      try {
        if (nat.kind === 'android') return !!window.AndroidBridge.hasNotificationPermission();
        if (nat.kind === 'desktop') return true;
        return 'Notification' in window && Notification.permission === 'granted';
      } catch (e) { return false; }
    },
    setReminders: function (list) {
      try {
        var j = JSON.stringify(list);
        if (nat.kind === 'android') window.AndroidBridge.setReminders(j);
        else if (nat.kind === 'desktop') window.PTNative.setReminders(j);
      } catch (e) { }
    },
    share: function (text, filename) {
      try {
        if (nat.kind === 'android') { window.AndroidBridge.shareText(filename || 'PrepTrack backup', text); return; }
        if (nat.kind === 'desktop') { window.PTNative.saveFile(filename, text).then(function (p) { if (p) PT.toast('Saved: ' + p); }); return; }
        var blob = new Blob([text], { type: 'application/json' }), a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = filename || 'preptrack.json'; document.body.appendChild(a); a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      } catch (e) { PT.toast('Could not save file'); }
    },
    /* GET a URL as text, bypassing CORS where the platform allows it */
    get: function (url, timeout) {
      timeout = timeout || 12000;
      if (nat.kind === 'desktop') return window.PTNative.httpGet(url);
      return new Promise(function (res, rej) {
        var done = false, t = setTimeout(function () { if (!done) { done = true; rej(new Error('timeout')); } }, timeout);
        fetch(url, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.text(); })
          .then(function (x) { if (!done) { done = true; clearTimeout(t); res(x); } })
          .catch(function (e) { if (!done) { done = true; clearTimeout(t); rej(e); } });
      });
    }
  };

  /* ---------- storage ---------- */
  var mem = {};
  PT.store = {
    get: function (k) { try { var v = localStorage.getItem(k); return v === null ? (mem[k] === undefined ? null : mem[k]) : v; } catch (e) { return mem[k] === undefined ? null : mem[k]; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { } delete mem[k]; }
  };
  var jget = function (k, d) { try { var v = PT.store.get(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };

  PT.defaults = function () {
    return {
      v: 1,
      settings: {
        lang: 'both', tier: 1, exam: 'cgl1', theme: 'auto', goal: 6, examDate: '', examName: 'SSC CGL — Tier-I',
        remind: [
          { id: 'r1', time: '06:30', label: 'Morning study block — start your timer!', days: [0, 1, 2, 3, 4, 5, 6], on: true },
          { id: 'r2', time: '16:00', label: 'Daily practice: 50 questions + current affairs', days: [0, 1, 2, 3, 4, 5, 6], on: true },
          { id: 'r3', time: '20:00', label: 'Revise flashcards (spaced repetition)', days: [0, 1, 2, 3, 4, 5, 6], on: true }
        ],
        guard: { on: true, time: '21:30' }, tray: true, autostart: false, feedUrl: 'feed.json'
      },
      sessions: [], timer: null, practice: {}, flash: { cards: {}, newDay: '', newCount: 0 }, mocks: [], targets: {}, syll: {},
      newsRead: {}, goalHit: {}, planDone: {}
    };
  };

  PT.users = function () { return jget('ptu_users', []); };
  PT.saveUsers = function (u) { PT.store.set('ptu_users', JSON.stringify(u)); };
  PT.user = null; PT.data = null;
  var saveT = null;
  PT.save = function () {
    if (!PT.user) return;
    clearTimeout(saveT);
    saveT = setTimeout(PT.saveNow, 250);
  };
  PT.saveNow = function () {
    if (!PT.user || !PT.data) return;
    clearTimeout(saveT);
    PT.store.set('ptd_' + PT.user.id, JSON.stringify(PT.data));
  };
  window.addEventListener('pagehide', function () { PT.saveNow(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) PT.saveNow(); });

  function loadData(uid) {
    var d = jget('ptd_' + uid, null) || PT.defaults(), def = PT.defaults();
    d.settings = Object.assign({}, def.settings, d.settings || {});
    ['sessions', 'mocks'].forEach(function (k) { if (!Array.isArray(d[k])) d[k] = []; });
    ['practice', 'targets', 'syll', 'newsRead', 'goalHit', 'planDone'].forEach(function (k) { if (!d[k] || typeof d[k] !== 'object') d[k] = {}; });
    if (!d.flash || !d.flash.cards) d.flash = def.flash;
    PT.data = d;
  }

  /* ---------- subjects ---------- */
  PT.SUBJECTS = [
    { id: 'maths', name: 'Maths (Quant)', hi: 'गणित', c: '--s1' },
    { id: 'reasoning', name: 'Reasoning', hi: 'तर्कशक्ति', c: '--s2' },
    { id: 'english', name: 'English', hi: 'अंग्रेज़ी', c: '--s3' },
    { id: 'gk', name: 'General Awareness (GK)', hi: 'सामान्य जागरूकता', c: '--s4' },
    { id: 'ca', name: 'Current Affairs', hi: 'सामयिकी', c: '--s5' },
    { id: 'mock', name: 'Mock Test', hi: 'मॉक टेस्ट', c: '--s6' },
    { id: 'revision', name: 'Revision', hi: 'पुनरावृत्ति', c: '--s7' },
    { id: 'computer', name: 'Computer Knowledge', hi: 'कंप्यूटर', c: '--s8' },
    { id: 'stats', name: 'Statistics', hi: 'सांख्यिकी', c: '--s8' },
    { id: 'finance', name: 'Finance & Economics', hi: 'वित्त एवं अर्थशास्त्र', c: '--s8' },
    { id: 'descriptive', name: 'Descriptive Writing', hi: 'निबंध/पत्र लेखन', c: '--s8' },
    { id: 'other', name: 'Other', hi: 'अन्य', c: '--s8' }
  ];
  PT.subj = function (id) { for (var i = 0; i < PT.SUBJECTS.length; i++) if (PT.SUBJECTS[i].id === id) return PT.SUBJECTS[i]; return PT.SUBJECTS[11]; };
  PT.subjColor = function (id) { return PT.cssVar(PT.subj(id).c) || '#888'; };
  /* chart groups: first 7 distinct, everything else folds into "Other" */
  PT.CHART_GROUPS = [['maths', 'Maths'], ['reasoning', 'Reasoning'], ['english', 'English'], ['gk', 'GK'], ['ca', 'Current Affairs'], ['mock', 'Mock Test'], ['revision', 'Revision'], ['other', 'Other']];
  PT.chartGroup = function (id) { for (var i = 0; i < 7; i++) if (PT.CHART_GROUPS[i][0] === id) return id; return 'other'; };

  /* ---------- sessions & index ---------- */
  var idx = null;
  PT.invalidate = function () { idx = null; };
  PT.index = function () {
    if (idx) return idx;
    idx = { day: {}, total: 0 };
    PT.data.sessions.forEach(function (s) {
      var o = idx.day[s.d] || (idx.day[s.d] = { total: 0, by: {} });
      o.total += s.sec; o.by[s.subj] = (o.by[s.subj] || 0) + s.sec; idx.total += s.sec;
    });
    return idx;
  };
  PT.logSession = function (subj, startMs, endMs, src) {
    var s = new Date(startMs), left = Math.round((endMs - startMs) / 1000), cur = startMs, n = 0;
    while (left > 0 && n++ < 400) {
      var d = new Date(cur), nextMid = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
      var seg = Math.min(left, Math.round((nextMid - cur) / 1000));
      if (seg > 0) PT.data.sessions.push({ d: PT.dkey(d), subj: subj, sec: seg, t: cur, src: src || 'timer' });
      left -= seg; cur = nextMid;
    }
    PT.invalidate(); PT.save();
  };
  PT.secOn = function (key) { var o = PT.index().day[key]; return o ? o.total : 0; };
  PT.todaySec = function () {
    var t = PT.secOn(PT.today()), tm = PT.data.timer;
    if (tm && tm.cur) { var mid = PT.parseKey(PT.today()).getTime(); t += Math.max(0, (Date.now() - Math.max(tm.cur, mid)) / 1000); }
    return t;
  };
  PT.streak = function () {
    var goal = PT.data.settings.goal * 3600, d = new Date(), n = 0;
    if (PT.secOn(PT.dkey(d)) < goal) d = PT.addDays(d, -1);
    while (PT.secOn(PT.dkey(d)) >= goal && goal > 0 && n < 4000) { n++; d = PT.addDays(d, -1); }
    return n;
  };

  /* ---------- timer ---------- */
  PT.timerElapsed = function () {
    var t = PT.data.timer; if (!t) return 0;
    var s = 0; t.runs.forEach(function (r) { s += (r[1] - r[0]) / 1000; });
    if (t.cur) s += (Date.now() - t.cur) / 1000;
    return s;
  };
  PT.timerStart = function (subj) {
    var t = PT.data.timer;
    if (!t) t = PT.data.timer = { subj: subj, runs: [], cur: null };
    if (!t.cur) t.cur = Date.now();
    PT.save(); PT.updateHero(true);
  };
  PT.timerPause = function () {
    var t = PT.data.timer; if (!t || !t.cur) return;
    t.runs.push([t.cur, Date.now()]); t.cur = null; PT.save(); PT.updateHero(true);
  };
  PT.timerStop = function () {
    var t = PT.data.timer; if (!t) return;
    if (t.cur) { t.runs.push([t.cur, Date.now()]); t.cur = null; }
    var tot = 0; t.runs.forEach(function (r) { tot += (r[1] - r[0]) / 1000; });
    if (tot >= 5) {
      t.runs.forEach(function (r) { PT.logSession(t.subj, r[0], r[1], t.subj === 'mock' ? 'mock' : 'timer'); });
      PT.toast('Saved ' + PT.hm(tot) + ' to ' + PT.subj(t.subj).name + ' ✔');
    } else PT.toast('Session shorter than 5 seconds — not saved');
    PT.data.timer = null; PT.save(); PT.invalidate(); PT.updateHero(true); PT.refreshSummaries();
    if (PT.afterLog) PT.afterLog();
  };

  /* ---------- toast / modal ---------- */
  var toastT;
  PT.toast = function (msg, ms) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.add('hidden'); }, ms || 3200);
  };
  PT.modal = function (html, opts) {
    opts = opts || {};
    var ov = document.createElement('div'); ov.className = 'overlay';
    ov.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + html + '</div>';
    document.body.appendChild(ov);
    var close = function () { ov.remove(); };
    if (!opts.sticky) ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.close = close; return ov;
  };
  PT.confirm = function (msg, yes, no) {
    return new Promise(function (res) {
      var m = PT.modal('<p style="font-size:17px;margin:4px 0 16px">' + PT.esc(msg) + '</p><div class="row" style="justify-content:flex-end"><button class="btn ghost small" data-v="0">' + PT.esc(no || 'Cancel') + '</button><button class="btn small" data-v="1">' + PT.esc(yes || 'OK') + '</button></div>', { sticky: true });
      m.addEventListener('click', function (e) { var b = e.target.closest('button[data-v]'); if (b) { m.close(); res(b.getAttribute('data-v') === '1'); } });
    });
  };
  PT.beep = function () {
    try {
      var A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      var c = new A(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination);
      o.frequency.value = 880; g.gain.value = .15; o.start(); setTimeout(function () { o.stop(); c.close(); }, 350);
    } catch (e) { }
  };

  /* ---------- language helper ---------- */
  PT.L = function (pair, lang) {
    lang = lang || PT.data.settings.lang;
    if (!pair) return '';
    if (typeof pair === 'string') return PT.esc(pair);
    var en = pair[0], hi = pair[1] || pair[0];
    if (lang === 'en') return PT.esc(en);
    if (lang === 'hi') return PT.esc(hi);
    return en === hi ? PT.esc(en) : PT.esc(en) + '<span class="hi">' + PT.esc(hi) + '</span>';
  };

  /* ---------- hero (tracker + timer + goal) ---------- */
  var QUOTES = [
    'Small hours, every single day, beat big hours once in a while.', 'Your future rank is built in today\'s hours.', 'Discipline > motivation. Start the timer.',
    'One more question. One more concept. One step closer.', 'Consistency is the real shortcut in SSC.', 'Don\'t stop till the cutoff looks small.', 'Every mock is a lesson, not a verdict.'
  ];
  PT.renderHero = function () {
    var h = $('#hero'), s = PT.data.settings;
    var opts = PT.SUBJECTS.filter(function (x) { return PT.tierSubjects().indexOf(x.id) >= 0; }).map(function (x) { return '<option value="' + x.id + '">' + PT.esc(x.name) + ' · ' + x.hi + '</option>'; }).join('');
    var goals = [4, 6, 8, 10].map(function (g) { return '<button data-g="' + g + '">' + g + 'h</button>'; }).join('');
    h.innerHTML =
      '<div class="hero-head"><h2>⏱ Study Tracker</h2><span class="badge" id="h-state">Ready</span></div>' +
      '<div class="timer-grid"><div>' +
      '<div class="clock" id="h-clock">00:00:00</div>' +
      '<div class="subj-row"><select id="h-subj" aria-label="Subject">' + opts + '</select></div>' +
      '<div class="btns"><button class="btn big green" id="h-start">▶ Start</button><button class="btn red hidden" id="h-stop">■ Stop &amp; save</button></div>' +
      '<div class="quote" id="h-quote"></div></div>' +
      '<div class="goalbox"><div class="goalrow"><div class="ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="11"/><circle id="h-arc" cx="50" cy="50" r="42" fill="none" stroke="#f5a623" stroke-width="11" stroke-linecap="round" stroke-dasharray="264" stroke-dashoffset="264"/></svg><div class="pct" id="h-pct">0%</div></div>' +
      '<div class="goalinfo"><b id="h-done">0m</b> of <b id="h-goal">6h</b> today<div id="h-left"></div><div id="h-streak"></div></div></div>' +
      '<div class="bar" id="h-bar"><i style="width:0"></i></div>' +
      '<div class="goalbtns"><span>Daily target:</span>' + goals + '<button data-g="custom">custom</button></div>' +
      '<div class="todaysplit" id="h-split"></div></div></div>';
    $('#h-quote').textContent = '“' + QUOTES[PT.hashStr(PT.today()) % QUOTES.length] + '”';
    var sel = $('#h-subj');
    sel.value = (PT.data.timer && PT.data.timer.subj) || PT.data.lastSubj || 'maths';
    if (!sel.value) sel.value = 'maths';
    sel.addEventListener('change', function () { PT.data.lastSubj = sel.value; PT.save(); });
    $('#h-start').addEventListener('click', function () {
      var t = PT.data.timer;
      if (t && t.cur) PT.timerPause(); else { PT.data.lastSubj = sel.value; if (!t) PT.timerStart(sel.value); else PT.timerStart(t.subj); }
    });
    $('#h-stop').addEventListener('click', function () { PT.timerStop(); });
    h.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-g]'); if (!b) return;
      var g = b.getAttribute('data-g');
      if (g === 'custom') {
        var m = PT.modal('<h2>Daily target</h2><p class="sub">Hours you want to study each day (0.5 – 16)</p><input id="cg" type="number" min="0.5" max="16" step="0.5" value="' + s.goal + '"><div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn small" id="cgok">Set target</button></div>');
        $('#cgok', m).onclick = function () { var v = parseFloat($('#cg', m).value); if (v >= .5 && v <= 16) { PT.setGoal(v); m.close(); } };
      } else PT.setGoal(+g);
    });
    PT.updateHero(true);
  };
  PT.setGoal = function (g) { PT.data.settings.goal = g; PT.save(); PT.updateHero(true); PT.refreshSummaries(); if (PT.onGoalChange) PT.onGoalChange(); PT.toast('Daily target set to ' + g + ' hours'); };
  var lastSplit = 0;
  PT.updateHero = function (force) {
    if (!$('#h-clock') || !PT.data) return;
    var t = PT.data.timer, running = !!(t && t.cur), el = PT.timerElapsed(), s = PT.data.settings;
    $('#h-clock').textContent = PT.clock(el);
    $('#h-clock').classList.toggle('run', running);
    var st = $('#h-state'); st.textContent = running ? '● Running — ' + PT.subj(t.subj).name : (t ? '⏸ Paused — ' + PT.subj(t.subj).name : 'Ready'); st.classList.toggle('run', running);
    var start = $('#h-start');
    start.textContent = running ? '⏸ Pause' : (t ? '▶ Resume' : '▶ Start');
    start.className = 'btn big ' + (running ? '' : 'green');
    $('#h-stop').classList.toggle('hidden', !t);
    var sel = $('#h-subj'); sel.disabled = !!t; if (t) sel.value = t.subj;
    var tot = PT.todaySec(), goal = s.goal * 3600, p = goal ? Math.min(1, tot / goal) : 0;
    $('#h-arc').setAttribute('stroke-dashoffset', (264 * (1 - p)).toFixed(1));
    $('#h-pct').textContent = Math.round(p * 100) + '%';
    $('#h-done').textContent = PT.hm(tot); $('#h-goal').textContent = (s.goal % 1 ? s.goal : s.goal) + 'h';
    var left = Math.max(0, goal - tot);
    $('#h-left').textContent = left > 0 ? '⏳ ' + PT.clock(left) + ' left to hit your target' : '🎉 Target complete! +' + PT.hm(tot - goal) + ' bonus';
    var sk = PT.streak(); $('#h-streak').textContent = '🔥 ' + sk + '-day streak' + (sk ? '' : ' — hit today\'s target to start one');
    var bar = $('#h-bar'); bar.firstChild.style.width = (p * 100).toFixed(1) + '%'; bar.classList.toggle('done', p >= 1);
    $$('.goalbtns button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-g') === String(s.goal)); });
    if (p >= 1 && !PT.data.goalHit[PT.today()]) { PT.data.goalHit[PT.today()] = 1; PT.save(); PT.toast('🎉 Daily target achieved! Great work.', 5000); $('#hero').classList.add('celebrate'); setTimeout(function () { $('#hero').classList.remove('celebrate'); }, 700); }
    document.title = running ? PT.clock(el) + ' · PrepTrack' : 'PrepTrack by UD';
    if (force || Date.now() - lastSplit > 5000) {
      lastSplit = Date.now();
      var day = PT.index().day[PT.today()], by = day ? Object.assign({}, day.by) : {};
      if (t && t.cur) by[t.subj] = (by[t.subj] || 0) + (Date.now() - Math.max(t.cur, PT.parseKey(PT.today()).getTime())) / 1000;
      var parts = Object.keys(by).sort(function (a, b) { return by[b] - by[a]; }).map(function (k) { return '<span><i class="dot" style="background:' + PT.subjColor(k) + '"></i>' + PT.esc(PT.subj(k).name.split(' (')[0]) + ' ' + PT.hm(by[k]) + '</span>'; });
      $('#h-split').innerHTML = parts.length ? parts.join('') : '<span>No study logged yet today — press Start ▶</span>';
    }
  };
  setInterval(function () { try { PT.updateHero(false); } catch (e) { } }, 1000);

  /* ---------- tier / exam context ---------- */
  PT.tierSubjects = function () {
    var base = ['maths', 'reasoning', 'english', 'gk', 'ca', 'mock', 'revision', 'other'];
    if (PT.data.settings.tier === 2) base = ['maths', 'reasoning', 'english', 'gk', 'computer', 'stats', 'finance', 'descriptive', 'ca', 'mock', 'revision', 'other'];
    return base;
  };

  /* ---------- accordion ---------- */
  PT.cards = [];
  PT.card = function (c) { PT.cards.push(c); };
  PT.openId = null;
  PT.buildCards = function () {
    var box = $('#cards'); box.innerHTML = '';
    PT.cards.forEach(function (c) {
      var d = document.createElement('section'); d.className = 'acc'; d.id = 'card-' + c.id;
      d.innerHTML = '<header tabindex="0" role="button" aria-expanded="false"><span class="ic">' + c.icon + '</span><span class="tt"><h3>' + PT.esc(c.title) + '</h3><small></small></span><span class="chev">⌄</span></header><div class="body"></div>';
      box.appendChild(d);
      var hd = d.firstChild;
      var tog = function () { PT.openCard(PT.openId === c.id ? null : c.id); };
      hd.addEventListener('click', tog);
      hd.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tog(); } });
    });
    PT.refreshSummaries();
  };
  PT.refreshSummaries = function () {
    PT.cards.forEach(function (c) {
      var d = $('#card-' + c.id); if (!d) return;
      try { d.querySelector('small').textContent = c.sum ? c.sum() : ''; } catch (e) { }
    });
  };
  PT.openCard = function (id, noScroll) {
    PT.cards.forEach(function (c) {
      var d = $('#card-' + c.id); if (!d) return;
      var open = c.id === id;
      d.classList.toggle('open', open); d.firstChild.setAttribute('aria-expanded', open ? 'true' : 'false');
      var body = d.querySelector('.body');
      if (!open) { if (c.close) { try { c.close(); } catch (e) { } } body.innerHTML = ''; }
    });
    PT.openId = id;
    if (!id) return;
    var c = PT.cards.filter(function (x) { return x.id === id; })[0], body = $('#card-' + id + ' .body');
    try { c.render(body); } catch (e) { body.innerHTML = '<p class="err">Something went wrong in this section. ' + PT.esc(e.message) + '</p>'; if (window.console) console.error(e); }
    if (!noScroll) setTimeout(function () {
      var h = $('#card-' + id), top = h.getBoundingClientRect().top + window.pageYOffset - ($('.top').offsetHeight + 8);
      window.scrollTo({ top: top, behavior: 'smooth' });
    }, 30);
  };
  PT.rerender = function () { if (PT.openId) { var c = PT.cards.filter(function (x) { return x.id === PT.openId; })[0]; var body = $('#card-' + PT.openId + ' .body'); if (c && body) c.render(body); } };
  /* hardware / history back: close open card or modal */
  PT.back = function () {
    var ov = $$('.overlay'); if (ov.length) { ov[ov.length - 1].remove(); return true; }
    if (PT.openId) { PT.openCard(null, true); window.scrollTo({ top: 0, behavior: 'smooth' }); return true; }
    return false;
  };

  /* ---------- theme ---------- */
  PT.applyTheme = function () {
    var t = PT.data ? PT.data.settings.theme : 'auto', dark = t === 'dark' || (t === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', dark ? '#0f1730' : '#1d2b53');
  };

  /* ---------- login ---------- */
  function initials(n) { return (n || '?').trim().charAt(0).toUpperCase(); }
  PT.showLogin = function (mode) {
    var users = PT.users(), old = $('#login'); if (old) old.remove();
    var ov = document.createElement('div'); ov.className = 'overlay'; ov.id = 'login'; ov.style.zIndex = 70;
    document.body.appendChild(ov);
    function head(sub) { return '<div style="text-align:center"><img src="icons/icon-96.png" width="64" height="64" style="border-radius:16px" alt=""><h2>PrepTrack by UD</h2><p class="sub">' + sub + '</p></div>'; }
    function list() {
      ov.innerHTML = '<div class="modal">' + head('Sign in to continue your SSC preparation') +
        users.map(function (u) { return '<button class="userbtn" data-u="' + u.id + '"><span class="avatar">' + PT.esc(initials(u.name)) + '</span><span><b>' + PT.esc(u.name) + '</b><br><span class="sub">' + (u.hash ? 'PIN protected' : 'No PIN') + '</span></span></button>'; }).join('') +
        '<button class="btn small" id="lg-new" style="margin-top:8px;width:100%">＋ Create new profile</button>' +
        '<button class="btn ghost small" id="lg-imp" style="margin-top:8px;width:100%;color:var(--text)">⤓ Restore from backup</button></div>';
      PT.on(ov, 'click', '.userbtn', function (e, b) { pin(users.filter(function (u) { return u.id === b.getAttribute('data-u'); })[0]); });
      $('#lg-new', ov).onclick = create; $('#lg-imp', ov).onclick = restore;
    }
    function pin(u) {
      if (!u.hash) { enter(u); return; }
      ov.innerHTML = '<div class="modal">' + head('Welcome back, ' + PT.esc(u.name)) + '<label class="f">Enter your PIN<input id="lg-pin" type="password" inputmode="numeric" autocomplete="off" autofocus></label><div id="lg-err" class="err"></div>' +
        '<div class="row" style="margin-top:12px;justify-content:space-between"><button class="btn ghost small" id="lg-back" style="color:var(--text)">Back</button><button class="btn small" id="lg-go">Sign in</button></div>' +
        '<p class="sub" style="margin-top:12px">Forgot PIN? Delete this profile and restore it from a backup file.</p><button class="btn ghost small" id="lg-del" style="color:var(--red)">Delete this profile</button></div>';
      var go = function () {
        if (PT.sha256(u.salt + $('#lg-pin', ov).value) === u.hash) enter(u); else { $('#lg-err', ov).textContent = 'Wrong PIN, try again.'; }
      };
      $('#lg-go', ov).onclick = go; $('#lg-pin', ov).addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
      $('#lg-back', ov).onclick = list;
      $('#lg-del', ov).onclick = function () { PT.confirm('Delete profile "' + u.name + '" and all its saved progress on this device?', 'Delete', 'Keep').then(function (y) { if (y) { PT.saveUsers(users = users.filter(function (x) { return x.id !== u.id; })); PT.store.del('ptd_' + u.id); users.length ? list() : create(); } }); };
      setTimeout(function () { try { $('#lg-pin', ov).focus(); } catch (e) { } }, 50);
    }
    function create() {
      ov.innerHTML = '<div class="modal">' + head(users.length ? 'Create a new profile' : 'Create your profile to save your progress') +
        '<label class="f">Your name<input id="cr-name" type="text" maxlength="30" placeholder="e.g. Uttam"></label>' +
        '<label class="f" style="margin-top:8px">PIN (optional, 4–8 digits)<input id="cr-pin" type="password" inputmode="numeric" maxlength="8" placeholder="leave empty for no lock"></label><div id="cr-err" class="err"></div>' +
        '<p class="sub">Your progress is saved on this device under this profile. Use Profile → Backup to move it to another device.</p>' +
        '<div class="row" style="margin-top:10px;justify-content:space-between">' + (users.length ? '<button class="btn ghost small" id="cr-back" style="color:var(--text)">Back</button>' : '<span></span>') + '<button class="btn" id="cr-go">Start preparing →</button></div></div>';
      if (users.length) $('#cr-back', ov).onclick = list;
      $('#cr-go', ov).onclick = function () {
        var n = $('#cr-name', ov).value.trim(), p = $('#cr-pin', ov).value.trim();
        if (!n) { $('#cr-err', ov).textContent = 'Please enter your name.'; return; }
        if (p && !/^\d{4,8}$/.test(p)) { $('#cr-err', ov).textContent = 'PIN must be 4 to 8 digits.'; return; }
        var u = { id: PT.uid(), name: n, created: Date.now() };
        if (p) { u.salt = PT.uid(); u.hash = PT.sha256(u.salt + p); }
        users.push(u); PT.saveUsers(users); enter(u);
      };
    }
    function restore() {
      ov.innerHTML = '<div class="modal">' + head('Restore from backup') + '<p class="sub">Paste the backup text you saved from PrepTrack (Profile → Backup).</p><textarea id="rs-t" rows="6" placeholder="Paste backup here"></textarea><div id="rs-err" class="err"></div>' +
        (PT.native.kind === 'android' ? '' : '<label class="f" style="margin-top:8px">…or choose the backup file<input id="rs-f" type="file" accept=".json,application/json,text/plain"></label>') +
        '<div class="row" style="margin-top:10px;justify-content:space-between"><button class="btn ghost small" id="rs-back" style="color:var(--text)">Back</button><button class="btn small" id="rs-go">Restore</button></div></div>';
      $('#rs-back', ov).onclick = function () { users.length ? list() : create(); };
      var f = $('#rs-f', ov); if (f) f.onchange = function () { var r = new FileReader(); r.onload = function () { $('#rs-t', ov).value = r.result; }; r.readAsText(f.files[0]); };
      $('#rs-go', ov).onclick = function () {
        try {
          var obj = JSON.parse($('#rs-t', ov).value.trim());
          if (!obj || !obj.data || !obj.name) throw new Error('bad');
          var u = { id: PT.uid(), name: obj.name }; users.push(u); PT.saveUsers(users);
          PT.store.set('ptd_' + u.id, JSON.stringify(obj.data)); enter(u);
        } catch (e) { $('#rs-err', ov).textContent = 'That backup could not be read. Please paste the full text.'; }
      };
    }
    function enter(u) { ov.remove(); PT.store.set('ptu_cur', u.id); PT.startApp(u); }
    if (mode === 'create' || !users.length) create(); else list();
  };

  PT.logout = function () { PT.saveNow(); PT.store.del('ptu_cur'); location.reload(); };

  /* ---------- reminders (in-app tick + native sync) ---------- */
  PT.reminderList = function () {
    var s = PT.data.settings, out = [];
    s.remind.forEach(function (r) {
      if (!r.on) return; var p = r.time.split(':');
      out.push({ id: r.id, h: +p[0], m: +p[1], days: r.days, title: 'PrepTrack by UD — study time', body: r.label });
    });
    if (s.guard && s.guard.on) {
      var p2 = s.guard.time.split(':');
      out.push({ id: 'guard', h: +p2[0], m: +p2[1], days: [0, 1, 2, 3, 4, 5, 6], title: 'Did you hit today\'s target?', body: 'Open PrepTrack and finish your ' + s.goal + 'h target — never skip a day!' });
    }
    return out;
  };
  PT.syncReminders = function () { PT.native.setReminders(PT.reminderList()); };
  var fired = {};
  function tick() {
    if (!PT.data) return;
    var now = new Date(), hm = PT.pad(now.getHours()) + ':' + PT.pad(now.getMinutes()), key = PT.today() + ' ' + hm;
    var s = PT.data.settings;
    s.remind.forEach(function (r) {
      if (!r.on || r.time !== hm || r.days.indexOf(now.getDay()) < 0 || fired[r.id + key]) return;
      fired[r.id + key] = 1; PT.toast('⏰ ' + r.label, 8000); PT.beep();
      if (PT.native.kind === 'web') PT.native.notify('PrepTrack by UD — study time', r.label);
    });
    if (s.guard && s.guard.on && s.guard.time === hm && !fired['g' + key]) {
      fired['g' + key] = 1;
      var left = s.goal * 3600 - PT.todaySec();
      if (left > 0) { PT.toast('⏰ ' + PT.hm(left) + ' left to reach today\'s target!', 9000); PT.beep(); if (PT.native.kind === 'web') PT.native.notify('Did you hit today\'s target?', PT.hm(left) + ' still to go — finish strong!'); }
    }
  }
  setInterval(tick, 15000);

  /* ---------- boot ---------- */
  PT.startApp = function (u) {
    PT.user = u; loadData(u.id); PT.invalidate(); PT.applyTheme();
    $('#app').classList.remove('hidden');
    $('#u-name').textContent = u.name;
    PT.syncTierUI();
    PT.renderHero(); PT.buildCards();
    PT.syncReminders();
    if (PT.native.kind === 'android' && !PT.native.canNotify()) PT.native.askPermission();
    if (PT.afterStart) PT.afterStart();
  };
  PT.syncTierUI = function () {
    var s = PT.data.settings;
    $$('.seg button[data-tier]').forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-tier') === s.tier); });
    var sel = $('#exam-sel'); sel.innerHTML = PT.examOptions(s.tier); sel.value = s.exam; if (sel.value !== s.exam) { s.exam = sel.options[0].value; sel.value = s.exam; }
    PT.updateCountdownPill();
  };
  PT.updateCountdownPill = function () {
    var p = $('#cd-pill'), s = PT.data.settings;
    if (s.examDate) {
      var d = PT.daysBetween(new Date(), PT.parseKey(s.examDate));
      p.textContent = d >= 0 ? '🎯 ' + d + ' days to exam' : 'Exam date passed';
    } else p.textContent = '🎯 Set exam date';
  };
  PT.examOptions = function (tier) {
    return (PT.EXAMS || []).filter(function (e) { return e.tier === tier; }).map(function (e) { return '<option value="' + e.id + '">' + PT.esc(e.name) + '</option>'; }).join('');
  };
  PT.setTier = function (t) {
    PT.data.settings.tier = t; PT.save(); PT.syncTierUI(); PT.renderHero(); PT.refreshSummaries();
    if (PT.openId) PT.rerender();
    PT.toast(t === 1 ? 'Tier-I mode: 100-question screening level' : 'Tier-II mode: advanced level (Maths, English, Statistics, GS & Finance)');
  };

  document.addEventListener('DOMContentLoaded', function () {
    PT.on(document.body, 'click', '.seg button[data-tier]', function (e, b) { if (PT.data) PT.setTier(+b.getAttribute('data-tier')); });
    $('#exam-sel').addEventListener('change', function () {
      var e = PT.EXAMS.filter(function (x) { return x.id === this.value; }.bind(this))[0];
      PT.data.settings.exam = this.value; if (e) PT.data.settings.examName = e.name; PT.save(); PT.refreshSummaries(); if (PT.openId) PT.rerender();
    });
    $('#cd-pill').addEventListener('click', function () { PT.openCard('plan'); });
    $('#u-chip').addEventListener('click', function () { PT.openCard('profile'); });
    $('#theme-btn').addEventListener('click', function () {
      var s = PT.data.settings, dark = document.documentElement.getAttribute('data-theme') === 'dark';
      s.theme = dark ? 'light' : 'dark'; PT.save(); PT.applyTheme(); PT.rerender();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') PT.back(); });
    var cur = PT.store.get('ptu_cur'), users = PT.users(), u = null;
    if (cur) u = users.filter(function (x) { return x.id === cur; })[0];
    if (u && !u.hash) PT.startApp(u);
    else if (u && u.hash) { PT.showLogin(); }
    else PT.showLogin();
    window.__onBack = function () { return PT.back() ? '1' : '0'; };
  });
})();
