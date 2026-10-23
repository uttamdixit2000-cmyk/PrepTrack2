/* Feature cards: Plan & reminders, Reports, Flashcards, Current affairs, Weak-area analyzer, Mock tracker, Exam-day simulator, Profile */
(function () {
  var PT = window.PT, $ = PT.$, $$ = PT.$$, esc = PT.esc;
  var subjColor = function (id) { return PT.subjColor(PT.chartGroup(id)) || '#888'; };
  var G = function (id) { return PT.subjColor(id); };

  /* ---------- Weak-area analyzer + quotas ---------- */
  PT.analyze = function (days) {
    days = days || 14;
    var hist = PT.practiceHistory(days), subj = {}, weak = [];
    hist.forEach(function (h) {
      var s = subj[h.subj] || (subj[h.subj] = { n: 0, ok: 0, topics: {} });
      s.n++; if (h.ok) s.ok++;
      var t = s.topics[h.t] || (s.topics[h.t] = { n: 0, ok: 0 }); t.n++; if (h.ok) t.ok++;
    });
    Object.keys(subj).forEach(function (k) {
      Object.keys(subj[k].topics).forEach(function (t) {
        var x = subj[k].topics[t], acc = x.ok / x.n;
        if (x.n >= 5 && acc < .7) weak.push({ subj: k, topic: t, n: x.n, acc: Math.round(acc * 100) });
      });
    });
    weak.sort(function (a, b) { return a.acc - b.acc; });
    return { subj: subj, weak: weak, total: hist.length };
  };
  /* daily study-hour quotas per subject for the chosen exam; weak topics add to that subject's share */
  PT.quotas = function () {
    var s = PT.data.settings, ex = PT.exam(), W = PT.WEIGHTS[ex.id] || {}, subs = PT.tierSubjects(), an = PT.analyze(14), base = {}, sum = 0;
    subs.forEach(function (id) { var w = W[id] || (id === 'mock' || id === 'revision' || id === 'other' ? .04 : 0); base[id] = w; sum += w; });
    if (!sum) { subs.forEach(function (id) { base[id] = 1; }); sum = subs.length; }
    var adj = {}, asum = 0;
    subs.forEach(function (id) {
      var k = 0; an.weak.forEach(function (w) { if (w.subj === id) k++; });
      adj[id] = base[id] / sum * (1 + Math.min(.5, .12 * k)); asum += adj[id];
    });
    var out = {}; subs.forEach(function (id) { out[id] = { sec: adj[id] / asum * s.goal * 3600, base: base[id] / sum * s.goal * 3600 }; });
    return out;
  };

  /* ---------- Plan & reminders ---------- */
  function phaseFor(days) {
    if (days > 120) return ['Foundation', 'मूल आधार', '#2a78d6', .45];
    if (days > 45) return ['Practice', 'अभ्यास', '#1baf7a', .30];
    if (days > 10) return ['Mock & Revision', 'मॉक व पुनरावृत्ति', '#eda100', .15];
    return ['Final sprint', 'अंतिम चरण', '#e34948', .10];
  }
  PT.planPhases = function (days) { return phaseFor(days); };
  function planCard(b) {
    var s = PT.data.settings, ex = PT.exam(), today = new Date(), d = s.examDate ? PT.daysBetween(today, PT.parseKey(s.examDate)) : null;
    var ph = d != null && d >= 0 ? phaseFor(d) : null;
    var q = PT.quotas(), rows = Object.keys(q).map(function (id) {
      var v = q[id], sub = PT.subj(id), done = PT.secOn(PT.today()) && (PT.index().day[PT.today()] || { by: {} }).by[id] || 0;
      return '<tr><td><i class="dot" style="background:' + subjColor(id) + '"></i> ' + esc(sub.name) + '</td><td>' + PT.hm(v.sec) + (Math.abs(v.sec - v.base) > 60 ? ' <span class="pill ' + (v.sec > v.base ? 'warn' : 'ok') + '">' + (v.sec > v.base ? '▲ weak-area boost' : '') + '</span>' : '') + '</td><td>' + PT.hm(done) + '</td></tr>';
    }).join('');
    var rem = s.remind.map(function (r, i) {
      return '<div class="row" style="margin:6px 0;align-items:center"><label class="row" style="gap:6px"><input type="checkbox" data-rt="' + i + '"' + (r.on ? ' checked' : '') + '> <input type="time" data-rtime="' + i + '" value="' + r.time + '" style="width:120px"></label>' +
        '<input type="text" data-rlabel="' + i + '" value="' + esc(r.label) + '" style="flex:1;min-width:160px"><div class="daychips">' + PT.DAYS.map(function (dn, di) { return '<label class="' + (r.days.indexOf(di) >= 0 ? 'on' : '') + '" data-rday="' + i + ':' + di + '">' + dn.charAt(0) + '</label>'; }).join('') + '</div></div>';
    }).join('');
    b.innerHTML =
      '<div class="grid2" style="margin-top:8px"><label class="f">Exam date<input type="date" id="pl-date" value="' + (s.examDate || '') + '"></label><div class="col" style="justify-content:flex-end"><b id="pl-cd" style="font-size:18px"></b><span class="sub" id="pl-ex"></span></div></div>' +
      (ph ? '<div class="phase">' + ['Foundation', 'Practice', 'Mock & Revision', 'Final sprint'].map(function (n, i) { var cols = ['#2a78d6', '#1baf7a', '#eda100', '#e34948'], w = [.45, .30, .15, .10][i]; return '<i style="flex:' + w + ';background:' + cols[i] + (ph[0] === n ? ';outline:2px solid var(--ink)' : ';opacity:.45') + '">' + n + '</i>'; }).join('') + '</div><p class="sub">Current phase: <b>' + ph[0] + '</b> / ' + ph[1] + ' — ' + (d) + ' days left. Your daily plan is auto-built from the phase below and your weak areas.</p>' : '<p class="note">Set your exam date to get a phase-wise study plan that is built automatically from the days left.</p>') +
      '<h4 style="margin:12px 0 4px">Today’s subject quotas (daily target ' + s.goal + 'h)</h4><div class="tscroll"><table><tr><th>Subject</th><th>Planned</th><th>Done today</th></tr>' + rows + '</table></div>' +
      '<h4 style="margin:14px 0 4px">⏰ Reminders (so you never skip)</h4><p class="sub">Reminders ring inside the app while it is open. ' + (PT.native.kind === 'desktop' ? 'Desktop notifications are on.' : PT.native.kind === 'web' ? 'Allow browser notifications for alerts when the app is in the background.' : '') + '</p>' +
      '<div id="pl-rem">' + rem + '</div>' +
      '<label class="row" style="margin-top:6px"><input type="checkbox" id="pl-guard"' + (s.guard.on ? ' checked' : '') + '> Daily check at <input type="time" id="pl-gtime" value="' + s.guard.time + '" style="width:120px"> “Did you hit today’s target?”</label>' +
      '<div class="row" style="margin-top:10px"><button class="btn small" id="pl-notif">🔔 Enable notifications</button><button class="btn small sec" id="pl-test">Test reminder</button></div>';
    function cd() { var v = $('#pl-date', b).value; if (!v) { $('#pl-cd', b).textContent = 'Set exam date'; $('#pl-ex', b).textContent = ''; return; } var n = PT.daysBetween(new Date(), PT.parseKey(v)); $('#pl-cd', b).textContent = n >= 0 ? n + ' days to go' : 'Exam date passed'; $('#pl-ex', b).textContent = ex.name; }
    cd();
    $('#pl-date', b).onchange = function () { s.examDate = this.value; PT.save(); PT.updateCountdownPill(); PT.rerender(); PT.toast('Plan updated for your exam date'); };
    PT.on(b, 'change', 'input[data-rt]', function (e, el) { s.remind[+el.getAttribute('data-rt')].on = el.checked; saveRem(); });
    PT.on(b, 'change', 'input[data-rtime]', function (e, el) { s.remind[+el.getAttribute('data-rtime')].time = el.value; saveRem(); });
    PT.on(b, 'change', 'input[data-rlabel]', function (e, el) { s.remind[+el.getAttribute('data-rlabel')].label = el.value; saveRem(); });
    PT.on(b, 'click', '[data-rday]', function (e, el) { var p = el.getAttribute('data-rday').split(':'), r = s.remind[+p[0]], di = +p[1], k = r.days.indexOf(di); k >= 0 ? r.days.splice(k, 1) : r.days.push(di); saveRem(); PT.rerender(); });
    $('#pl-guard', b).onchange = function () { s.guard.on = this.checked; saveRem(); };
    $('#pl-gtime', b).onchange = function () { s.guard.time = this.value; saveRem(); };
    $('#pl-notif', b).onclick = function () { PT.native.askPermission().then(function (ok) { PT.toast(ok ? 'Notifications enabled' : 'Notifications not allowed — reminders will show inside the app'); }); };
    $('#pl-test', b).onclick = function () { PT.toast('⏰ Test: time to study! Start your timer.', 6000); PT.beep(); PT.native.notify('PrepTrack by UD', 'Test reminder — it works!'); };
  }
  function saveRem() { PT.save(); PT.syncReminders(); }

  /* ---------- Reports ---------- */
  var RP = { per: 'daily', view: 'bar' };
  function periodRange(per) {
    var now = new Date(), out = [], n, step;
    if (per === 'daily') { n = 14; for (var i = n - 1; i >= 0; i--) out.push(PT.dkey(PT.addDays(now, -i))); return { keys: out, lab: out.map(function (k) { return k.slice(5); }) }; }
    if (per === 'weekly') { n = 12; for (var w = n - 1; w >= 0; w--) { var st = PT.addDays(now, -w * 7 - now.getDay()); var ks = []; for (var j = 0; j < 7; j++) ks.push(PT.dkey(PT.addDays(st, j))); out.push(ks); } return { keys: out, lab: out.map(function (ks) { return ks[0].slice(5); }) }; }
    if (per === 'monthly') { n = 12; for (var m = n - 1; m >= 0; m--) { var d = new Date(now.getFullYear(), now.getMonth() - m, 1), ks2 = []; var last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); for (var q = 1; q <= last; q++) ks2.push(PT.dkey(new Date(d.getFullYear(), d.getMonth(), q))); out.push(ks2); } return { keys: out, lab: out.map(function (ks) { var p = ks[0].split('-'); return PT.MONTHS[+p[1] - 1]; }) }; }
    n = 5; for (var y = n - 1; y >= 0; y--) { var yy = now.getFullYear() - y, ks3 = []; for (var mm = 0; mm < 12; mm++) { var l2 = new Date(yy, mm + 1, 0).getDate(); for (var dd = 1; dd <= l2; dd++) ks3.push(PT.dkey(new Date(yy, mm, dd))); } out.push(ks3); } return { keys: out, lab: out.map(function (ks) { return ks[0].slice(0, 4); }) };
  }
  function sumKeys(keys) { var by = {}, tot = 0; keys.forEach(function (k) { var o = PT.index().day[k]; if (!o) return; tot += o.total; Object.keys(o.by).forEach(function (s) { by[s] = (by[s] || 0) + o.by[s]; }); }); return { by: by, tot: tot }; }
  function reportCard(b) {
    b.innerHTML = '<div class="tabs" id="rp-per">' + ['daily', 'weekly', 'monthly', 'yearly'].map(function (p) { return '<button data-p="' + p + '" class="' + (RP.per === p ? 'on' : '') + '">' + p[0].toUpperCase() + p.slice(1) + '</button>'; }).join('') + '</div>' +
      '<div class="tabs" id="rp-view">' + [['bar', '▮ Bar'], ['line', '📈 Line'], ['pie', '◔ Pie'], ['table', '▤ Table']].map(function (v) { return '<button data-v="' + v[0] + '" class="' + (RP.view === v[0] ? 'on' : '') + '">' + v[1] + '</button>'; }).join('') + '</div><div id="rp-body"></div>';
    function draw() {
      var R = periodRange(RP.per), body = $('#rp-body', b), ks = RP.per === 'daily' || RP.per === 'weekly' && false ? null : null;
      var groups = R.keys.map(function (x) { return Array.isArray(x) ? x : [x]; });
      var per = groups.map(function (g) { return sumKeys(g); });
      var all = {}; per.forEach(function (p) { Object.keys(p.by).forEach(function (s) { var c = PT.chartGroup(s); all[c] = (all[c] || 0) + p.by[s]; }); });
      var series = PT.CHART_GROUPS.map(function (g) { return g[0]; }).filter(function (id) { return all[id]; });
      var tot = per.reduce(function (a, p) { return a + p.tot; }, 0), days = groups.reduce(function (a, g) { return a + g.filter(function (k) { return PT.secOn(k) > 0; }).length; }, 0);
      var head = '<div class="grid3" style="margin:12px 0"><div class="tile"><b>' + PT.hm(tot) + '</b><span class="sub">total in period</span></div><div class="tile"><b>' + (tot / Math.max(1, days) / 3600).toFixed(1) + 'h</b><span class="sub">avg per active day</span></div><div class="tile"><b>' + PT.streak() + ' 🔥</b><span class="sub">target streak</span></div></div>';
      var legend = '<div class="legend">' + series.map(function (id) { return '<span><i class="dot" style="background:' + PT.subjColor(id) + '"></i>' + esc(PT.CHART_GROUPS.filter(function (g) { return g[0] === id; })[0][1]) + '</span>'; }).join('') + '</div>';
      if (RP.view === 'table') {
        var rows = PT.CHART_GROUPS.map(function (g) { return g[0]; }).filter(function (id) { return all[id]; }).map(function (id) { return '<tr><td><i class="dot" style="background:' + PT.subjColor(id) + '"></i> ' + esc(PT.CHART_GROUPS.filter(function (g) { return g[0] === id; })[0][1]) + '</td><td>' + PT.hm(all[id]) + '</td><td>' + (tot ? Math.round(all[id] / tot * 100) : 0) + '%</td></tr>'; }).join('');
        body.innerHTML = head + '<div class="tscroll"><table><tr><th>Subject</th><th>Time</th><th>Share</th></tr>' + (rows || '<tr><td colspan=3>No study logged in this period</td></tr>') + '</table></div>' + '<p class="sub" style="margin-top:8px">Subject-wise split is grouped to 8 colour slots for readability; the full list is in the Study Tracker.</p>';
        return;
      }
      body.innerHTML = head + '<canvas class="ch" id="rp-cv"></canvas>' + legend;
      var cv = $('#rp-cv', b);
      if (RP.view === 'pie') {
        PT.chart(cv, 'pie', [], Object.keys(all).map(function (id) { return { name: PT.CHART_GROUPS.filter(function (g) { return g[0] === id; })[0][1], v: all[id], color: PT.subjColor(id) }; }), { h: 230 });
        $('#rp-cv', b).nextSibling && 0;
        body.querySelector('.legend') && body.querySelector('.legend').remove();
        return;
      }
      var labels = R.lab;
      var ser = series.map(function (id) { return { name: PT.CHART_GROUPS.filter(function (g) { return g[0] === id; })[0][1], color: PT.subjColor(id), v: per.map(function (p) { return p.by[id] || 0; }) }; });
      var sumSer = [{ name: 'Total', color: PT.cssVar('--amber') || '#f5a623', v: per.map(function (p) { return p.tot; }) }];
      if (!ser.length) { sumSer = []; }
      PT.chart(cv, RP.view === 'line' ? 'line' : 'bar', labels, RP.view === 'line' && ser.length ? sumSer.concat([]) : (ser.length ? ser : [{ name: 'Total', color: '#888', v: per.map(function () { return 0; }) }]), { h: 240 });
    }
    PT.on(b, 'click', '#rp-per button', function (e, el) { RP.per = el.getAttribute('data-p'); reportCard(b); });
    PT.on(b, 'click', '#rp-view button', function (e, el) { RP.view = el.getAttribute('data-v'); reportCard(b); });
    draw();
    var csv = document.createElement('button'); csv.className = 'btn small sec'; csv.style.marginTop = '10px'; csv.textContent = '⤓ Export CSV';
    csv.onclick = function () { var lines = ['date,subject,minutes']; PT.data.sessions.forEach(function (s) { lines.push(s.d + ',' + s.subj + ',' + Math.round(s.sec / 60)); }); PT.native.share(lines.join('\n'), 'preptrack-report.csv'); };
    b.appendChild(csv);
  }

  /* ---------- Flashcards (spaced repetition, SM-2 style) ---------- */
  var FORMULAS = [
    ['Area of a trapezium', '½ × (sum of parallel sides) × height', 'समलंब का क्षेत्रफल', '½ × (समांतर भुजाओं का योग) × ऊँचाई'],
    ['Simple interest', 'SI = P × R × T / 100', 'साधारण ब्याज', 'SI = P × R × T / 100'],
    ['Compound interest (annual)', 'A = P(1 + R/100)ᵀ', 'चक्रवृद्धि ब्याज', 'A = P(1 + R/100)ᵀ'],
    ['Speed conversion', 'km/h × 5/18 = m/s', 'चाल रूपांतरण', 'किमी/घं × 5/18 = मी/से'],
    ['Time & work (together)', 'xy/(x + y) days', 'कार्य व समय (संयुक्त)', 'xy/(x + y) दिन'],
    ['Pipes: net time', 'xy/(y − x) when one fills and one empties', 'पाइप: शुद्ध समय', 'xy/(y − x)'],
    ['Average of n numbers', 'Sum / n', 'औसत', 'योग / n'],
    ['Sum of first n natural numbers', 'n(n + 1)/2', 'प्रथम n प्राकृत संख्याओं का योग', 'n(n + 1)/2'],
    ['Sum of squares of first n natural numbers', 'n(n + 1)(2n + 1)/6', 'प्रथम n प्राकृत संख्याओं के वर्गों का योग', 'n(n + 1)(2n + 1)/6'],
    ['(a + b)²', 'a² + 2ab + b²', '(a + b)²', 'a² + 2ab + b²'],
    ['a² − b²', '(a + b)(a − b)', 'a² − b²', '(a + b)(a − b)'],
    ['a³ + b³', '(a + b)(a² − ab + b²)', 'a³ + b³', '(a + b)(a² − ab + b²)'],
    ['Area of triangle (Heron)', '√[s(s−a)(s−b)(s−c)], s = (a+b+c)/2', 'त्रिभुज का क्षेत्रफल (हीरोन)', '√[s(s−a)(s−b)(s−c)], s = (a+b+c)/2'],
    ['Volume of cylinder', 'πr²h', 'बेलन का आयतन', 'πr²h'],
    ['Curved surface of cone', 'πrl', 'शंकु का वक्र पृष्ठ', 'πrl'],
    ['Profit %', '(Profit / CP) × 100', 'लाभ %', '(लाभ / क्रय मूल्य) × 100'],
    ['Successive % change', 'a + b + ab/100', 'क्रमागत % परिवर्तन', 'a + b + ab/100'],
    ['Probability', 'Favourable outcomes / Total outcomes', 'प्रायिकता', 'अनुकूल परिणाम / कुल परिणाम'],
    ['Coefficient of variation', '(σ / mean) × 100', 'विचरण गुणांक', '(σ / माध्य) × 100']
  ];
  function srsCard(b) {
    var F = PT.data.flash, cards = F.cards, today = PT.today();
    var lang = PT.data.settings.lang;
    var all = [];
    PT.VOCAB.forEach(function (v) { all.push({ id: 'v:' + v[0], kind: 'Vocabulary', front: v[0], back: '<b>' + v[1] + '</b> (opp: ' + v[2] + ')', hi: v[3] + ' · विलोम: ' + v[4], hiFront: v[0] }); });
    PT.IDIOMS.forEach(function (v) { all.push({ id: 'i:' + v[0], kind: 'Idiom', front: v[0], back: v[1], hi: v[2], hiFront: v[0] }); });
    FORMULAS.forEach(function (v) { all.push({ id: 'f:' + v[0], kind: 'Quant formula', front: v[0], back: v[1], hi: v[3], hiFront: v[2] }); });
    var due = all.filter(function (c) { var s = cards[c.id]; return s && s.due <= today; });
    var fresh = all.filter(function (c) { return !cards[c.id]; });
    var newToday = F.newDay === today ? F.newCount : 0;
    var newAllowed = Math.max(0, 15 - newToday);
    var queue = due.concat(fresh.slice(0, newAllowed));
    var learned = Object.keys(cards).length;
    b.innerHTML = '<div class="row" style="justify-content:space-between;margin-top:8px"><div><b>' + queue.length + '</b> cards due today · <span class="sub">' + learned + '/' + all.length + ' learned</span></div><div class="row" id="fc-lang"><button class="btn small sec" data-l="en">EN</button><button class="btn small sec" data-l="hi">हिं</button><button class="btn small sec" data-l="both">Both</button></div></div>' +
      '<p class="sub">Spaced repetition: cards you find hard come back sooner; easy ones are spaced further apart. Covers high-frequency vocabulary, idioms and Quant formulas.</p><div id="fc-area"></div>';
    var idx = 0, flipped = false;
    function show() {
      var area = $('#fc-area', b);
      if (!queue.length) { area.innerHTML = '<div class="note">🎉 No cards due. Come back tomorrow, or add up to 15 new cards.</div>'; return; }
      var c = queue[idx % queue.length], l = PT.data.settings.lang;
      var front = l === 'hi' ? c.hiFront : c.front;
      var backHtml = (l === 'hi' ? '<div class="m hi">' + esc(c.hi) + '</div>' : '') + (l === 'en' ? '<div class="m">' + c.back + '</div>' : (l === 'both' ? '<div class="m">' + c.back + '</div><div class="m hi">' + esc(c.hi) + '</div>' : ''));
      area.innerHTML = '<div class="sub" style="text-align:center">' + c.kind + ' · card ' + (idx % queue.length + 1) + ' of ' + queue.length + '</div><div class="fc"><div class="fcard" id="fc-card"><div class="w">' + esc(front) + '</div>' + (flipped ? backHtml : '<div class="m sub">tap to reveal</div>') + '</div></div>' +
        (flipped ? '<div class="rate"><button style="background:#ee6b5e" data-q="0">Again<br><small>&lt;1d</small></button><button style="background:#eda100" data-q="2">Hard<br><small>~1d</small></button><button style="background:#1f9d6b" data-q="4">Good<br><small>3d+</small></button><button style="background:#2a78d6" data-q="5">Easy<br><small>7d+</small></button></div>' : '');
      $('#fc-card', area).onclick = function () { flipped = true; show(); };
      PT.on(area, 'click', 'button[data-q]', function (e, el) { rate(c, +el.getAttribute('data-q')); });
    }
    function rate(c, q) {
      var s = cards[c.id];
      if (!s) {                       // first time this card is seen: count it against today's new-card cap
        if (F.newDay !== today) { F.newDay = today; F.newCount = 0; }
        F.newCount++;
        s = cards[c.id] = { ef: 2.5, n: 0, ivl: 0, due: today };
      }
      if (q < 3) {                    // failed: relearn tomorrow
        s.n = 0; s.ivl = 1;
      } else {                        // passed: SM-2 style interval growth
        s.n++;
        s.ivl = s.n === 1 ? 1 : s.n === 2 ? 3 : Math.round(s.ivl * s.ef);
        s.ef = Math.max(1.3, s.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
        if (q === 5) s.ivl = Math.max(s.ivl, 4);
      }
      s.due = PT.dkey(PT.addDays(new Date(), s.ivl));
      PT.save(); flipped = false; queue.splice(queue.indexOf(c), 1); idx = 0;
      PT.toast(q < 3 ? 'Will repeat tomorrow' : 'Next review in ' + s.ivl + ' day(s)', 1600); show();
    }
    PT.on(b, 'click', '#fc-lang button', function (e, el) { PT.data.settings.lang = el.getAttribute('data-l'); PT.save(); srsCard(b); });
    if (!queue.length) { show(); return; }
    show();
  }

  /* ---------- Current affairs (bilingual; daily feed) ---------- */
  var SEED = [
    { d: '2026-10-01', src: 'Seed', en: { t: 'How to use this section', b: 'Current affairs are shown in English and हिन्दी. Connect a daily feed in Profile → Content feed to refresh them automatically every day.' }, hi: { t: 'इस भाग का उपयोग', b: 'समसामयिकी अंग्रेज़ी और हिन्दी दोनों में दिखाई जाती है। हर दिन स्वतः अपडेट के लिए प्रोफ़ाइल → कंटेंट फ़ीड में फ़ीड जोड़ें।' } },
    { d: '2026-10-01', src: 'Seed', en: { t: 'Static tip: Tier-I GK weightage', b: 'In SSC exams, General Awareness mixes static GK (history, polity, geography, science) with current affairs of the last 6–8 months.' }, hi: { t: 'स्थैतिक सुझाव: टियर-I सामान्य जागरूकता', b: 'SSC परीक्षाओं में सामान्य जागरूकता में स्थैतिक GK (इतिहास, राजव्यवस्था, भूगोल, विज्ञान) और पिछले 6–8 महीनों की समसामयिकी मिलाकर पूछी जाती है।' } }
  ];
  /* accept single-language items ({lang,t,b}) and older bilingual items ({en:{t,b},hi:{t,b}}) */
  function normCA(x) {
    if (!x) return null;
    var it = { d: String(x.d || PT.today()), src: String(x.src || ''), en: null, hi: null };
    if (x.en && x.en.t) it.en = { t: String(x.en.t), b: String(x.en.b || '') };
    if (x.hi && x.hi.t) it.hi = { t: String(x.hi.t), b: String(x.hi.b || '') };
    if (!it.en && !it.hi && x.t) it[x.lang === 'hi' ? 'hi' : 'en'] = { t: String(x.t), b: String(x.b || '') };
    return (it.en || it.hi) ? it : null;
  }
  PT.caItems = function () { var c = PT.data.caCache; return c && c.items && c.items.length ? c.items : SEED; };
  PT.refreshCA = function (force) {
    var url = PT.data.settings.feedUrl; if (!url) return Promise.resolve(false);
    var c = PT.data.caCache || {};
    if (!force && c.day === PT.today()) return Promise.resolve(false);
    var sep = url.indexOf('?') < 0 ? '?' : '&';
    return PT.native.get(url + sep + '_=' + Date.now()).then(function (txt) {
      var j = JSON.parse(txt), raw = Array.isArray(j) ? j : (j.items || []);
      var items = raw.map(normCA).filter(Boolean);
      var qs = Array.isArray(j.questions) ? j.questions.filter(function (q) { return q && q.subj && q.q && q.o && typeof q.a === 'number'; }) : [];
      if (!items.length && !qs.length) throw new Error('empty feed');
      if (items.length) PT.data.caCache = { day: PT.today(), items: items.slice(0, 60), edition: j.source_edition || '' };
      if (qs.length) { PT.data.packQ = qs.slice(0, 300); PT.data.packDay = PT.today(); if (PT.clearSets) PT.clearSets(); }
      PT.save(); PT.invalidate && PT.invalidate(); PT.toast('Synced: ' + items.length + ' news items, ' + qs.length + ' practice questions'); return true;
    }).catch(function () { if (force) PT.toast('Could not reach the feed. Check the feed link in Profile and your internet connection.', 5000); return false; });
  };
  /* practice questions from the feed (used when building each day's 50-question set) */
  PT.packQuestions = function (subj, tier) {
    return (PT.data.packQ || []).filter(function (q) { return q.subj === subj && (!q.tier || +q.tier === tier); }).map(function (q) {
      return { t: q.t || PT.subj(subj).name, q: q.q, o: q.o, a: q.a, e: q.e || ['', ''] };
    });
  };
  /* "Sync today's data": download the latest feed now and rebuild today's unstarted practice sets */
  PT.syncToday = function () {
    if (!PT.data.settings.feedUrl) { PT.toast('Add your feed link in Profile → Content feed first.', 5000); return; }
    PT.refreshCA(true).then(function (ok) { if (ok) PT.rerender(); });
  };
  var syncBtn = document.getElementById('sync-btn');
  if (syncBtn) syncBtn.addEventListener('click', function () { PT.syncToday(); });
  /* on start-up, refresh the feed once a day in the background */
  PT.afterStart = function () { PT.refreshCA(false); };
  function caCard(b) {
    var items = PT.caItems(), l = PT.data.settings.lang, dates = {};
    b.innerHTML = '<div class="row" style="justify-content:space-between;margin-top:8px"><div class="row" id="ca-lang"><button class="btn small sec" data-l="en">English</button><button class="btn small sec" data-l="hi">हिन्दी</button><button class="btn small sec" data-l="both">Both</button><button class="btn small ghost" data-l="swap" style="color:var(--text)">⇄ Swap</button></div><span class="pill">' + (PT.data.caCache && PT.data.caCache.day ? 'Updated ' + PT.data.caCache.day : 'Seed content') + '</span></div>' +
      '<div class="row" style="margin-top:8px;gap:8px"><button class="btn small" id="ca-sync" type="button">🔄 Sync today\'s data</button><span class="sub" style="margin:0">Also refreshes automatically once a day.</span></div><div id="ca-list"></div>' + (PT.data.settings.feedUrl ? '' : '<div class="note" style="margin-top:8px">No daily feed connected yet. Add one in Profile → Content feed for automatic daily news.</div>');
    function list() {
      var L = PT.data.settings.lang, html = '';
      items.forEach(function (it, i) {
        if (L !== 'both' && !it[L]) return; /* item has no version in this language */
        var read = PT.data.newsRead[i + '|' + it.d] ? ' read' : '', body = '';
        if (L === 'both') {
          if (it.en) body += '<h4>' + esc(it.en.t) + '</h4>' + (it.en.b ? '<div>' + esc(it.en.b) + '</div>' : '');
          if (it.hi) body += '<h4 class="hi" style="color:var(--blue)">' + esc(it.hi.t) + '</h4>' + (it.hi.b ? '<div>' + esc(it.hi.b) + '</div>' : '');
        } else {
          var p = it[L];
          body = '<h4' + (L === 'hi' ? ' class="hi" style="color:var(--blue)"' : '') + '>' + esc(p.t) + '</h4>' + (p.b ? '<div>' + esc(p.b) + '</div>' : '');
        }
        html += '<div class="news' + read + '" data-i="' + i + '"><small>' + esc(it.d) + ' · ' + esc(it.src || '') + '</small>' + body + '</div>';
      });
      $('#ca-list', b).innerHTML = html || '<p class="sub">No headlines in this language yet. Switch to “Both” to see all.</p>';
    }
    list();
    PT.on(b, 'click', '#ca-lang button', function (e, el) { var v = el.getAttribute('data-l'); if (v === 'swap') PT.data.settings.lang = PT.data.settings.lang === 'en' ? 'hi' : PT.data.settings.lang === 'hi' ? 'en' : 'hi'; else PT.data.settings.lang = v; PT.save(); list(); });
    PT.on(b, 'click', '#ca-sync', function () { PT.syncToday(); });
    PT.on(b, 'click', '.news', function (e, el) { PT.data.newsRead[el.getAttribute('data-i') + '|' + items[+el.getAttribute('data-i')].d] = 1; PT.save(); el.classList.add('read'); });
    PT.refreshCA(false).then(function (ok) { if (ok) PT.rerender(); });
  }

  /* ---------- Weak-area analyzer ---------- */
  function weakCard(b) {
    var an = PT.analyze(14), q = PT.quotas(), s = PT.data.settings;
    var subs = Object.keys(an.subj).map(function (id) { var x = an.subj[id], acc = Math.round(x.ok / x.n * 100); return '<tr><td><i class="dot" style="background:' + PT.subjColor(id) + '"></i> ' + esc(PT.subj(id).name) + '</td><td>' + x.n + '</td><td><span class="pill ' + (acc < 70 ? 'warn' : 'ok') + '">' + acc + '%</span></td></tr>'; }).join('');
    var weak = an.weak.map(function (w) { return '<tr><td>' + esc(w.topic) + '</td><td>' + esc(PT.subj(w.subj).name) + '</td><td>' + w.n + '</td><td><span class="pill warn">' + w.acc + '%</span></td></tr>'; }).join('');
    var quota = Object.keys(q).map(function (id) { return '<tr><td>' + esc(PT.subj(id).name) + '</td><td>' + PT.hm(q[id].base) + '</td><td><b>' + PT.hm(q[id].sec) + '</b></td></tr>'; }).join('');
    b.innerHTML = '<p class="sub" style="margin-top:8px">Scores from your 50-question daily practice (last 14 days). Any topic below <b>70%</b> accuracy (min. 5 questions) is flagged, and the daily hour quota for that subject is increased to compensate.</p>' +
      '<h4 style="margin:10px 0 4px">Subject accuracy</h4><div class="tscroll"><table><tr><th>Subject</th><th>Questions</th><th>Accuracy</th></tr>' + (subs || '<tr><td colspan=3>Do some daily practice to see results</td></tr>') + '</table></div>' +
      '<h4 style="margin:12px 0 4px">⚠ Weak topics (&lt; 70%)</h4><div class="tscroll"><table><tr><th>Topic</th><th>Subject</th><th>Qs</th><th>Accuracy</th></tr>' + (weak || '<tr><td colspan=4>No weak topics yet — keep practising!</td></tr>') + '</table></div>' +
      '<h4 style="margin:12px 0 4px">Adjusted daily quotas (target ' + s.goal + 'h)</h4><div class="tscroll"><table><tr><th>Subject</th><th>Base</th><th>Today (adjusted)</th></tr>' + quota + '</table></div>';
  }

  /* ---------- Mock tests & scorecard ---------- */
  function mockCard(b) {
    var ex = PT.exam(), M = PT.data.mocks;
    var secs = PT.examSections(ex);
    var inputs = secs.map(function (x, i) { return '<label class="f">' + esc(x.n) + ' (max ' + (ex.manual ? x.max : x.q * ex.pos) + ')<input type="number" min="0" step="0.5" data-sec="' + i + '" placeholder="0"></label>'; }).join('');
    var rows = M.slice().reverse().map(function (m, i) { var pct = m.max ? Math.round(m.score / m.max * 100) : 0; return '<tr><td>' + esc(m.date) + '</td><td>' + esc(m.exam) + '</td><td>' + m.score + '/' + m.max + '</td><td>' + pct + '%</td><td>' + (m.cutoff ? m.cutoff : '—') + '</td><td><span class="pill ' + (m.cutoff && m.score >= m.cutoff ? 'ok' : 'warn') + '">' + (m.cutoff ? (m.score >= m.cutoff ? 'Above cutoff' : 'Below by ' + (m.cutoff - m.score)) : '') + '</span></td><td><button class="btn small ghost" style="color:var(--red)" data-del="' + (M.length - 1 - i) + '">✕</button></td></tr>'; }).join('');
    b.innerHTML = '<p class="sub" style="margin-top:8px">Enter section-wise marks after each mock. Cutoff defaults to the expected cutoff for <b>' + esc(ex.name) + '</b>: <b>' + ex.target + '</b> (edit it if the notification says otherwise).</p>' +
      '<div class="grid3" style="grid-template-columns:1fr 1fr;margin-top:8px"><label class="f">Mock date<input type="date" id="mk-date" value="' + PT.today() + '"></label><label class="f">Cutoff (marks)<input type="number" id="mk-cut" value="' + ex.target + '"></label></div>' +
      '<div class="grid2" style="margin-top:8px">' + inputs + '</div><div class="row" style="margin-top:10px"><button class="btn" id="mk-save">Save scorecard</button><span class="sub" id="mk-prev"></span></div>' +
      (M.length ? '<h4 style="margin:14px 0 4px">Trend</h4><canvas class="ch" id="mk-cv"></canvas><h4 style="margin:14px 0 4px">History</h4><div class="tscroll"><table><tr><th>Date</th><th>Exam</th><th>Score</th><th>%</th><th>Cutoff</th><th>Status</th><th></th></tr>' + rows + '</table></div>' : '<div class="note" style="margin-top:12px">No mock results yet. Save your first scorecard above.</div>');
    function prev() { var sc = 0, mx = 0; $$('input[data-sec]', b).forEach(function (el, i) { sc += +el.value || 0; }); $('#mk-prev', b).textContent = 'Total: ' + sc; }
    $$('input[data-sec]', b).forEach(function (el) { el.oninput = prev; });
    $('#mk-save', b).onclick = function () {
      var score = 0, sections = []; $$('input[data-sec]', b).forEach(function (el, i) { var v = +el.value || 0; score += v; sections.push({ n: secs[i].n, v: v }); });
      var max = ex.manual ? secs.reduce(function (a, x) { return a + x.max; }, 0) : PT.examMax(ex);
      M.push({ date: $('#mk-date', b).value || PT.today(), exam: ex.name, score: Math.round(score * 100) / 100, max: max, cutoff: +$('#mk-cut', b).value || 0, sections: sections });
      PT.save(); PT.toast('Scorecard saved'); PT.rerender();
    };
    PT.on(b, 'click', 'button[data-del]', function (e, el) { M.splice(+el.getAttribute('data-del'), 1); PT.save(); PT.rerender(); });
    if (M.length) PT.chart($('#mk-cv', b), 'line', M.map(function (m) { return m.date.slice(5); }), [{ name: 'Score %', color: PT.cssVar('--s1'), v: M.map(function (m) { return m.max ? m.score / m.max * 100 : 0; }) }, { name: 'Cutoff %', color: PT.cssVar('--red') || '#e34948', v: M.map(function (m) { return m.max && m.cutoff ? m.cutoff / m.max * 100 : 0; }) }], { h: 200, unit: '%' });
  }

  /* ---------- Exam-day simulator ---------- */
  function simCard(b) {
    var ex = PT.exam(), html = ex.blocks.map(function (bl, bi) {
      var secs = bl.sections, tq = secs.reduce(function (a, s) { return a + (s.q || 0); }, 0);
      var rows = secs.map(function (s, si) {
        var q = ex.manual ? 1 : s.q, alloc = Math.round(bl.minutes * (q / tq) * 10) / 10, perQ = Math.round(alloc * 60 / Math.max(1, q));
        return '<tr><td>' + esc(s.n) + '</td><td>' + (ex.manual ? '—' : q) + '</td><td><b>' + alloc + ' min</b></td><td>' + (ex.manual ? '—' : perQ + ' s') + '</td><td><span class="pill">' + esc(PT.subj(s.s).name.split(' (')[0]) + '</span></td></tr>';
      }).join('');
      return '<h4 style="margin:14px 0 4px">' + esc(bl.name) + ' — ' + bl.minutes + ' min</h4><div class="phase">' + secs.map(function (s, si) { var q = ex.manual ? 1 : s.q; return '<i style="flex:' + (q / tq) + ';background:' + PT.subjColor(PT.chartGroup(s.s)) + '">' + esc(s.n.split(' ')[0]) + '</i>'; }).join('') + '</div>' +
        '<div class="tscroll"><table><tr><th>Section</th><th>Questions</th><th>Suggested time</th><th>Per question</th><th>Subject</th></tr>' + rows + '</table></div>';
    }).join('');
    var total = PT.examMinutes(ex);
    b.innerHTML = '<p class="sub" style="margin-top:8px">Plan your exact sectional time for <b>' + esc(ex.name) + '</b>. Total: <b>' + total + ' minutes</b>. Marks: +' + ex.pos + ' / −' + ex.neg + ' · Max ' + PT.examMax(ex) + ' · Cutoff ' + ex.target + '.</p>' + html +
      '<h4 style="margin:16px 0 4px">⏱ Mock clock</h4><div class="sim-clock" id="sim-clk">' + total + ':00</div><div class="btns"><button class="btn small" id="sim-go">▶ Start mock block</button><button class="btn small sec" id="sim-reset">Reset</button></div>' +
      '<div class="note" style="margin-top:12px"><b>Strategy:</b> attempt easiest sections first (Reasoning and Maths calculation-heavy questions usually take longest). Keep 3–4 minutes at the end to review. Never spend more than the suggested time on one question; skip and return.</div>';
    var left = total * 60, iv = null;
    function paint() { $('#sim-clk', b).textContent = PT.clock(left).slice(0, 5); }
    $('#sim-go', b).onclick = function () { if (iv) { clearInterval(iv); iv = null; $('#sim-go', b).textContent = '▶ Resume'; return; } $('#sim-go', b).textContent = '⏸ Pause'; iv = setInterval(function () { left--; paint(); if (left <= 0) { clearInterval(iv); iv = null; PT.beep(); PT.toast('Time up! Submit your paper.', 6000); } }, 1000); };
    $('#sim-reset', b).onclick = function () { if (iv) clearInterval(iv); iv = null; left = total * 60; paint(); $('#sim-go', b).textContent = '▶ Start mock block'; };
  }

  /* ---------- Profile, backup, feed, security ---------- */
  function profileCard(b) {
    var u = PT.user, s = PT.data.settings;
    b.innerHTML = '<div class="row" style="margin-top:8px;align-items:center"><span class="avatar" style="width:52px;height:52px;font-size:22px">' + esc((u.name || '?').charAt(0).toUpperCase()) + '</span><div><b style="font-size:18px">' + esc(u.name) + '</b><div class="sub">Progress saved on this device · ' + PT.data.sessions.length + ' study sessions</div></div></div>' +
      '<div class="grid2" style="margin-top:12px"><label class="f">Daily target (hours)<input type="number" id="pf-goal" min="0.5" max="16" step="0.5" value="' + s.goal + '"></label>' +
      '<label class="f">Language<select id="pf-lang"><option value="both"' + (s.lang === 'both' ? ' selected' : '') + '>English + हिन्दी</option><option value="en"' + (s.lang === 'en' ? ' selected' : '') + '>English</option><option value="hi"' + (s.lang === 'hi' ? ' selected' : '') + '>हिन्दी</option></select></label>' +
      '<label class="f">Theme<select id="pf-theme"><option value="auto"' + (s.theme === 'auto' ? ' selected' : '') + '>Auto</option><option value="light"' + (s.theme === 'light' ? ' selected' : '') + '>Light</option><option value="dark"' + (s.theme === 'dark' ? ' selected' : '') + '>Dark</option></select></label>' +
      '<label class="f">Daily content feed (optional URL)<input type="text" id="pf-feed" value="' + esc(s.feedUrl || '') + '" placeholder="https://…/feed.json"></label></div>' +
      '<div class="row" style="margin-top:10px"><button class="btn small" id="pf-save">Save settings</button><button class="btn small sec" id="pf-pin">' + (u.hash ? 'Change PIN' : 'Set PIN') + '</button></div>' +
      '<h4 style="margin:16px 0 4px">💾 Backup & restore</h4><p class="sub">Copy this text and keep it safe (email/notes). Use “Restore from backup” on any device to get your progress back.</p><div class="row"><button class="btn small" id="pf-bk">Create backup</button></div><textarea id="pf-bkt" rows="4" class="hidden" style="margin-top:8px" readonly></textarea>' +
      '<div class="row" style="margin-top:10px;justify-content:space-between"><button class="btn small ghost" id="pf-out" style="color:var(--text)">Switch profile / sign out</button><button class="btn small red" id="pf-del">Delete profile</button></div>' +
      '<p class="sub" style="margin-top:14px">PrepTrack by UD v' + PT.VERSION + ' · Practice questions are original, in SSC exam style. Always confirm the latest pattern on ssc.gov.in.</p>';
    $('#pf-save', b).onclick = function () { var g = +$('#pf-goal', b).value; if (g >= .5 && g <= 16) s.goal = g; s.lang = $('#pf-lang', b).value; s.theme = $('#pf-theme', b).value; s.feedUrl = $('#pf-feed', b).value.trim(); PT.save(); PT.applyTheme(); PT.renderHero(); PT.refreshSummaries(); PT.toast('Settings saved'); if (s.feedUrl) PT.refreshCA(true); };
    $('#pf-pin', b).onclick = function () {
      var m = PT.modal('<h2>' + (u.hash ? 'Change PIN' : 'Set PIN') + '</h2><label class="f">New PIN (4–8 digits, empty = no PIN)<input id="np" type="password" inputmode="numeric" maxlength="8"></label><div class="row" style="justify-content:flex-end;margin-top:12px"><button class="btn small" id="npok">Save</button></div>');
      $('#npok', m).onclick = function () { var p = $('#np', m).value.trim(); if (p && !/^\d{4,8}$/.test(p)) { PT.toast('PIN must be 4–8 digits'); return; } var users = PT.users(); var me = users.filter(function (x) { return x.id === u.id; })[0]; if (p) { me.salt = PT.uid(); me.hash = PT.sha256(me.salt + p); } else { delete me.hash; delete me.salt; } u.hash = me.hash; u.salt = me.salt; PT.saveUsers(users); m.close(); PT.toast('PIN saved'); PT.rerender(); };
    };
    $('#pf-bk', b).onclick = function () { var t = $('#pf-bkt', b); t.classList.remove('hidden'); t.value = JSON.stringify({ app: 'PrepTrack by UD', v: 1, name: u.name, data: PT.data }); t.select(); PT.native.share(t.value, 'preptrack-backup.json'); PT.toast('Backup ready — copy it from the box'); };
    $('#pf-out', b).onclick = function () { PT.logout(); };
    $('#pf-del', b).onclick = function () { PT.confirm('Delete this profile and all its progress on this device? This cannot be undone.', 'Delete', 'Keep').then(function (y) { if (!y) return; var users = PT.users().filter(function (x) { return x.id !== u.id; }); PT.saveUsers(users); PT.store.del('ptd_' + u.id); PT.store.del('ptu_cur'); location.reload(); }); };
  }

  PT.card({ id: 'plan', icon: '🎯', title: 'Exam Plan & Reminders', sum: function () { var d = PT.data.settings.examDate; return d ? PT.daysBetween(new Date(), PT.parseKey(d)) + ' days to exam · ' + PT.exam().name : 'Set exam date for an auto plan'; }, render: planCard });
  PT.card({ id: 'reports', icon: '📊', title: 'Reports — Daily · Weekly · Monthly · Yearly', sum: function () { return 'Bar, line, pie & table views'; }, render: reportCard });
  PT.card({ id: 'flash', icon: '🃏', title: 'Flashcards — Vocab, Idioms & Formulas', sum: function () { var c = Object.keys(PT.data.flash.cards || {}).length; return c + ' cards learned · spaced repetition'; }, render: srsCard });
  PT.card({ id: 'ca', icon: '📰', title: 'Daily Current Affairs (हिन्दी / English)', sum: function () { return PT.caItems().length + ' items · ' + (PT.data.caCache && PT.data.caCache.day ? 'updated ' + PT.data.caCache.day : 'seed'); }, render: caCard });
  PT.card({ id: 'weak', icon: '🩺', title: 'Weak-Area Analyzer', sum: function () { var a = PT.analyze(14); return a.weak.length ? a.weak.length + ' weak topic(s) · quotas auto-adjusted' : 'Accuracy check across Maths, Reasoning, English, GK'; }, render: weakCard });
  PT.card({ id: 'mock', icon: '🏆', title: 'Mock Test Cutoff & Scorecard', sum: function () { var m = PT.data.mocks; return m.length ? 'Last: ' + m[m.length - 1].score + '/' + m[m.length - 1].max : 'No mocks yet'; }, render: mockCard });
  PT.card({ id: 'sim', icon: '⏱', title: 'Exam Day Strategy Simulator', sum: function () { return PT.exam().name + ' · ' + PT.examMinutes(PT.exam()) + ' min'; }, render: simCard });
  PT.card({ id: 'profile', icon: '👤', title: 'Profile, Backup & Settings', sum: function () { return 'Goal ' + PT.data.settings.goal + 'h · backup & PIN'; }, render: profileCard });

  /* keep the time-sensitive summary fresh */
  setInterval(function () { if (PT.data && PT.openId !== 'practice') PT.refreshSummaries(); }, 60000);
  /* ensure the Plan card and reports reflect counted time */
  PT.afterLog = function () { if (PT.openId === 'reports' || PT.openId === 'weak' || PT.openId === 'plan') PT.rerender(); };
  document.addEventListener('DOMContentLoaded', function () { try { PT.setStudyDayClock && PT.setStudyDayClock(); } catch (e) { } });
})();
