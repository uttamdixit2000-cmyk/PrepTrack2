/* Daily practice: 50 questions per subject, bilingual, auto time logging */
(function () {
  var PT = window.PT, $ = PT.$, esc = PT.esc;
  var NQ = 50, FOCUS = 15 * 60;
  PT.PRACTICE = {
    1: [['maths', '🧮', 'Maths (Quant)', 'गणित'], ['reasoning', '🧩', 'Reasoning', 'तर्कशक्ति'], ['english', '📖', 'English', 'अंग्रेज़ी'], ['gk', '🌍', 'General Awareness', 'सामान्य जागरूकता']],
    2: [['maths', '🧮', 'Maths (Tier-II level)', 'गणित'], ['reasoning', '🧩', 'Reasoning (Tier-II level)', 'तर्कशक्ति'], ['english', '📖', 'English Language & Comprehension', 'अंग्रेज़ी'], ['gk', '🌍', 'General Awareness & Finance', 'सामान्य जागरूकता व वित्त'], ['computer', '💻', 'Computer Knowledge', 'कंप्यूटर ज्ञान'], ['stats', '📊', 'Statistics', 'सांख्यिकी']]
  };
  var sets = {};
  function weightedDeck(list, r) { var d = []; list.forEach(function (g) { for (var i = 0; i < g[1]; i++) d.push(g[0]); }); return r.shuffle(d); }
  function genOne(fn, base, i, hard, seen) {
    for (var t = 0; t < 8; t++) {
      var r = PT.rng(base + '#' + i + '#' + t), q;
      try { q = fn(r, hard); } catch (e) { q = null; }
      if (!q || !q.q || !q.o || q.o.length < 2) continue;
      var key = (typeof q.q[0] === 'string' ? q.q[0] : '') + '|' + (q.o.map(function (o) { return typeof o === 'string' ? o : o[0]; }).join(','));
      if (seen[key]) continue; seen[key] = 1; return q;
    }
    return null;
  }
  PT.buildSet = function (subj, tier, day) {
    var ck = [day, subj, tier].join('|'); if (sets[ck]) return sets[ck];
    var base = ck, r = PT.rng(base), seen = {}, out = [], hard = tier === 2, i;
    if (subj === 'gk') {
      var cw = tier === 2 ? { H: 1, P: 2, G: 1, E: 3, S: 1, X: 1, A: 1, T: 1 } : { H: 1.2, P: 1.2, G: 1.2, E: .8, S: 1.8, X: 1, A: .8, T: .6 };
      var pool = PT.GKBANK.map(function (f, ix) { var w = (cw[f.c] || 1) * (f.l === 2 ? (tier === 2 ? 1.8 : .6) : 1); return { f: f, k: -Math.log(r() || 1e-9) / w }; }).sort(function (a, b) { return a.k - b.k; });
      var nf = 30; for (i = 0; i < nf && i < pool.length; i++) { var qf = PT.factQ(PT.rng(base + 'f' + i), pool[i].f); out.push(qf); seen[qf.q[0]] = 1; }
      var deck = weightedDeck(PT.tableGens, r), k = 0, guard = 0;
      while (out.length < NQ && guard++ < 400) { var g = genOne(deck[k++ % deck.length], base + 't', k, hard, seen); if (g) out.push(g); }
      out = r.shuffle(out);
    } else if (subj === 'computer') {
      var cb = r.shuffle(PT.COMPBANK.map(function (_, ix) { return ix; })), j;
      for (j = 0; j < NQ; j++) { var f2 = PT.COMPBANK[cb[j % cb.length]], rr = PT.rng(base + 'c' + j), set = [f2.a].concat(f2.w), sh = rr.shuffle(set); out.push({ t: 'Computer Knowledge', q: f2.q, o: sh, a: sh.indexOf(f2.a), e: ['Answer: ' + f2.a[0], 'उत्तर: ' + f2.a[1]] }); }
    } else {
      var lst = PT.GEN[subj]['t' + tier], deck2 = weightedDeck(lst, r), n = 0, gd = 0;
      while (out.length < NQ && gd++ < 800) { var q = genOne(deck2[n % deck2.length], base, n, hard, seen); n++; if (q) out.push(q); }
    }
    /* Tier-II (Mains level): mix in the mains-level bank, spread through the set */
    if (tier === 2 && PT.MAINS) {
      var mains = PT.MAINS.filter(function (x) { return x.subj === subj; });
      if (mains.length) { var mshuf = PT.rng(base + 'm').shuffle(mains.slice()); for (var mi = 0; mi < Math.min(mshuf.length, 15, out.length); mi++) out[(mi * 3) % out.length] = mshuf[mi]; }
    }
    /* optional online pack (refreshed daily) adds fresh questions */
    var pk = PT.packQuestions ? PT.packQuestions(subj, tier) : [];
    if (pk.length) { var take = Math.min(pk.length, 15, out.length); for (var m = 0; m < take; m++) out[out.length - 1 - m] = pk[m]; }
    sets[ck] = out.slice(0, NQ); return sets[ck];
  };

  /* drop cached sets the learner has not started, so they rebuild with the newest feed questions */
  PT.clearSets = function () {
    var p = PT.data.practice || {};
    Object.keys(sets).forEach(function (k) { var st = p[k]; if (!st || !Object.keys(st.ans || {}).length) delete sets[k]; });
  };
  function stKey(subj) { return PT.today() + '|' + subj + '|' + PT.data.settings.tier; }
  function state(subj) { var k = stKey(subj), p = PT.data.practice; if (!p[k]) p[k] = { ans: {}, cur: 0, secs: 0, fin: false }; return p[k]; }
  PT.practiceSummary = function () {
    var tier = PT.data.settings.tier, tot = 0, ok = 0, n = 0;
    PT.PRACTICE[tier].forEach(function (s) { var p = PT.data.practice[stKey(s[0])]; if (p) Object.keys(p.ans).forEach(function (i) { n++; if (p.ans[i].ok) ok++; }); });
    return n ? 'Today: ' + n + ' answered · ' + Math.round(ok / n * 100) + '% accuracy' : '50 questions × ' + PT.PRACTICE[tier].length + ' subjects · English / हिन्दी';
  };
  /* flatten history for analyzer */
  PT.practiceHistory = function (days) {
    var out = [], lim = PT.addDays(new Date(), -days), P = PT.data.practice;
    Object.keys(P).forEach(function (k) {
      var p = k.split('|'), d = PT.parseKey(p[0]); if (d < lim) return;
      Object.keys(P[k].ans).forEach(function (i) { var a = P[k].ans[i]; out.push({ d: p[0], subj: p[1], tier: +p[2], t: a.t, ok: a.ok }); });
    });
    return out;
  };

  var view = { mode: 'home', subj: null }, timerId = null, pending = 0, body = null;
  function flush() {
    if (pending >= 5 && view.subj) {
      var tm = PT.data.timer; if (!(tm && tm.cur)) { var now = Date.now(); PT.logSession(view.subj, now - pending * 1000, now, 'practice'); PT.toast('Practice time added to your tracker: ' + PT.hm(pending)); PT.refreshSummaries(); PT.updateHero(true); }
    }
    pending = 0;
  }
  function stopTick() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function startTick() {
    stopTick();
    timerId = setInterval(function () {
      if (document.hidden || view.mode !== 'q' || !view.subj) return;
      var st = state(view.subj); st.secs++; pending++;
      var el = $('#pq-time'); if (el) { el.textContent = PT.clock(st.secs).slice(3) + ' / 15:00'; el.style.color = st.secs >= FOCUS ? 'var(--green)' : ''; }
    }, 1000);
  }
  function langSel() {
    var l = PT.data.settings.lang;
    return '<label class="f" style="min-width:170px"><span>Language / भाषा</span><select id="pq-lang"><option value="en"' + (l === 'en' ? ' selected' : '') + '>English</option><option value="hi"' + (l === 'hi' ? ' selected' : '') + '>हिन्दी (Hindi)</option><option value="both"' + (l === 'both' ? ' selected' : '') + '>English + हिन्दी</option></select></label>';
  }
  function optHTML(o, lang) { return typeof o === 'string' ? esc(o) : PT.L(o, lang); }
  function subjInfo(id) { var t = PT.data.settings.tier, a = PT.PRACTICE[t].filter(function (s) { return s[0] === id; })[0]; return a || PT.PRACTICE[1][0]; }

  function home() {
    view = { mode: 'home', subj: null }; stopTick();
    var tier = PT.data.settings.tier, ex = PT.exam();
    var tiles = PT.PRACTICE[tier].map(function (s) {
      var p = PT.data.practice[stKey(s[0])] || { ans: {}, secs: 0 }, n = Object.keys(p.ans).length, ok = 0;
      Object.keys(p.ans).forEach(function (i) { if (p.ans[i].ok) ok++; });
      var acc = n ? Math.round(ok / n * 100) : 0;
      return '<button class="tile" data-s="' + s[0] + '"><span style="font-size:26px">' + s[1] + '</span><b>' + esc(s[2]) + '</b><span class="sub">' + s[3] + '</span><div class="sub" style="margin-top:6px">' + n + '/' + NQ + ' done' + (n ? ' · ' + acc + '% correct' : '') + '</div><div class="meter"><i style="width:' + (n / NQ * 100) + '%"></i></div><div class="sub" style="margin-top:6px">' + (p.secs >= FOCUS ? '✅ 15-min focus done' : '⏱ ' + Math.floor(p.secs / 60) + '/15 min') + '</div></button>';
    }).join('');
    body.innerHTML = '<div class="row" style="justify-content:space-between;align-items:flex-end;margin-top:10px">' + langSel() + '<span class="pill">' + (tier === 1 ? 'Tier-I level' : 'Tier-II level') + '</span></div>' +
      '<p class="sub" style="margin:8px 0">Fresh <b>50 questions per subject every day</b> (new set generated daily). Tap a subject to start. Time you spend here is added to your study tracker automatically. Questions follow the SSC pattern — they are practice questions in the exam style, not copies of past papers.</p>' +
      '<div class="grid2 grid3" id="pq-tiles">' + tiles + '</div>' +
      '<div class="note" style="margin-top:12px">Marking in ' + esc(ex.name) + ': +' + ex.pos + ' for correct, −' + ex.neg + ' for wrong. Aim for 90%+ accuracy — topics below 70% are flagged in the Weak-Area Analyzer.</div>';
    $('#pq-lang', body).onchange = function () { PT.data.settings.lang = this.value; PT.save(); home(); };
    PT.on(body, 'click', '.tile[data-s]', function (e, b) { open(b.getAttribute('data-s')); });
  }
  function open(subj) {
    view = { mode: 'q', subj: subj }; pending = 0; var st = state(subj); st.fin = false; PT.save();
    renderQ(); startTick();
  }
  function renderQ() {
    var subj = view.subj, tier = PT.data.settings.tier, set = PT.buildSet(subj, tier, PT.today()), st = state(subj), i = Math.min(st.cur, set.length - 1), q = set[i], lang = PT.data.settings.lang, info = subjInfo(subj);
    var ans = st.ans[i], n = Object.keys(st.ans).length, ok = 0; Object.keys(st.ans).forEach(function (k) { if (st.ans[k].ok) ok++; });
    var opts = q.o.map(function (o, k) {
      var cls = 'opt', dis = '';
      if (ans) { dis = ' disabled'; if (k === q.a) cls += ' right'; else if (k === ans.c) cls += ' wrong'; }
      return '<button class="' + cls + '" data-k="' + k + '"' + dis + '><b>' + 'ABCD'.charAt(k) + '.</b> ' + optHTML(o, lang) + '</button>';
    }).join('');
    var pal = set.map(function (_, k) { var a = st.ans[k], c = a ? (a.ok ? 'ok' : 'bad') : ''; return '<button class="' + c + (k === i ? ' cur' : '') + '" data-j="' + k + '">' + (k + 1) + '</button>'; }).join('');
    body.innerHTML = '<div class="qhead"><button class="btn small ghost" id="pq-back" style="color:var(--text)">← Subjects</button><b>' + info[1] + ' ' + esc(info[2]) + '</b>' + langSel() + '</div>' +
      '<div class="qhead"><span class="pill">Q ' + (i + 1) + ' / ' + set.length + '</span><span class="pill">' + esc(q.t) + '</span><span class="pill" id="pq-time">' + PT.clock(st.secs).slice(3) + ' / 15:00</span><span class="pill ' + (n && ok / n < .7 ? 'warn' : 'ok') + '">' + ok + '/' + n + ' correct</span></div>' +
      '<div class="qbox"><div class="qtext">' + PT.L(q.q, lang) + '</div></div><div id="pq-opts">' + opts + '</div>' +
      (ans ? '<div class="expl">' + (ans.ok ? '✅ Correct! ' : '❌ Not quite. ') + '<b>' + esc(typeof q.o[q.a] === 'string' ? q.o[q.a] : (lang === 'hi' ? q.o[q.a][1] : q.o[q.a][0])) + '</b><br>' + PT.L(q.e, lang) + '</div>' : '') +
      '<div class="row" style="justify-content:space-between;margin-top:12px"><button class="btn small sec" id="pq-prev"' + (i === 0 ? ' disabled' : '') + '>◀ Prev</button><button class="btn small" id="pq-fin">Finish &amp; see score</button><button class="btn small sec" id="pq-next"' + (i === set.length - 1 ? ' disabled' : '') + '>Next ▶</button></div>' +
      '<div class="palette" id="pq-pal">' + pal + '</div>';
    $('#pq-back', body).onclick = function () { flush(); PT.saveNow(); PT.refreshSummaries(); home(); };
    $('#pq-lang', body).onchange = function () { PT.data.settings.lang = this.value; PT.save(); renderQ(); };
    $('#pq-prev', body).onclick = function () { st.cur = Math.max(0, i - 1); PT.save(); renderQ(); };
    $('#pq-next', body).onclick = function () { st.cur = Math.min(set.length - 1, i + 1); PT.save(); renderQ(); };
    $('#pq-fin', body).onclick = function () { finish(); };
    PT.on($('#pq-opts', body), 'click', 'button.opt', function (e, b) {
      if (st.ans[i]) return; var k = +b.getAttribute('data-k');
      st.ans[i] = { c: k, ok: k === q.a ? 1 : 0, t: q.t }; st.cur = i; PT.save(); PT.refreshSummaries(); renderQ();
      var nx = $('#pq-next', body); if (nx && !nx.disabled && st.ans[i].ok) { /* stay: user reads explanation */ }
    });
    PT.on($('#pq-pal', body), 'click', 'button[data-j]', function (e, b) { st.cur = +b.getAttribute('data-j'); PT.save(); renderQ(); });
  }
  function finish() {
    var subj = view.subj, set = PT.buildSet(subj, PT.data.settings.tier, PT.today()), st = state(subj), ex = PT.exam();
    flush(); st.fin = true; PT.saveNow(); stopTick(); view.mode = 'res';
    var n = Object.keys(st.ans).length, ok = 0, topics = {};
    Object.keys(st.ans).forEach(function (k) { var a = st.ans[k]; if (a.ok) ok++; var t = topics[a.t] || (topics[a.t] = [0, 0]); t[1]++; if (a.ok) t[0]++; });
    var wrong = n - ok, score = ok * ex.pos - wrong * ex.neg, acc = n ? Math.round(ok / n * 100) : 0, info = subjInfo(subj);
    var rows = Object.keys(topics).sort(function (a, b) { return topics[a][0] / topics[a][1] - topics[b][0] / topics[b][1]; }).map(function (t) {
      var v = topics[t], p = Math.round(v[0] / v[1] * 100);
      return '<div style="margin:8px 0"><div class="row" style="justify-content:space-between"><span>' + esc(t) + ' <span class="sub">(' + v[0] + '/' + v[1] + ')</span></span><span class="pill ' + (p < 70 ? 'warn' : 'ok') + '">' + p + '%</span></div><div class="bar" style="background:var(--line);height:9px"><i style="width:' + p + '%;background:' + (p < 70 ? 'var(--red)' : 'var(--green)') + '"></i></div></div>';
    }).join('');
    body.innerHTML = '<h3 style="margin:10px 0">' + info[1] + ' ' + esc(info[2]) + ' — Today’s result</h3><div class="grid3" style="grid-template-columns:repeat(3,1fr)"><div class="tile"><b style="font-size:26px">' + ok + '/' + n + '</b><span class="sub">correct</span></div><div class="tile"><b style="font-size:26px">' + acc + '%</b><span class="sub">accuracy</span></div><div class="tile"><b style="font-size:26px">' + (Math.round(score * 100) / 100) + '</b><span class="sub">score (' + ex.pos + '/−' + ex.neg + ')</span></div></div>' +
      (n < NQ ? '<p class="sub">You answered ' + n + ' of ' + NQ + ' — unanswered questions are not counted.</p>' : '') +
      '<h4 style="margin:14px 0 4px">Topic-wise accuracy</h4>' + (rows || '<p class="sub">Answer some questions to see topic accuracy.</p>') +
      '<div class="note" style="margin-top:10px">Topics under 70% are flagged. Open <b>Weak-Area Analyzer</b> to see how your daily hours get re-balanced.</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn" id="pq-cont">Continue practising</button><button class="btn sec" id="pq-home">All subjects</button></div>';
    $('#pq-cont', body).onclick = function () { open(subj); };
    $('#pq-home', body).onclick = function () { PT.refreshSummaries(); home(); };
    PT.refreshSummaries();
  }
  document.addEventListener('keydown', function (e) {
    if (view.mode !== 'q' || PT.openId !== 'practice' || /INPUT|SELECT|TEXTAREA/.test((e.target || {}).tagName || '')) return;
    var k = { '1': 0, '2': 1, '3': 2, '4': 3 }[e.key];
    if (k !== undefined) { var b = document.querySelector('#pq-opts button[data-k="' + k + '"]'); if (b && !b.disabled) b.click(); }
    if (e.key === 'ArrowRight') { var n = $('#pq-next'); if (n && !n.disabled) n.click(); }
    if (e.key === 'ArrowLeft') { var p = $('#pq-prev'); if (p && !p.disabled) p.click(); }
  });
  window.addEventListener('pagehide', flush);

  PT.card({
    id: 'practice', icon: '📝', title: 'Daily Practice — 50 Questions', sum: function () { return PT.practiceSummary(); },
    render: function (b) { body = b; home(); }, close: function () { flush(); stopTick(); view = { mode: 'home', subj: null }; }
  });
})();
