/* PrepTrack — Maps & Country Guide (English / हिन्दी / both). Offline.
   All facts are stored in the app. Maps load from maps/ when the map file is present.
   Only the "Sync new data" button changes anything, and it refreshes that one section's recent news. */
(function () {
  var PT = window.PT, $ = PT.$, esc = PT.esc, U = PT.UI;
  var tab = 'india', sel = { india: 'up', world: 'in' }, orgQ = '', B = null;

  function slug(s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
  function mode() { return PT.data.mapLang || 'both'; }
  function arr(v) { return Array.isArray(v) ? v.join(' · ') : (v == null ? '' : String(v)); }
  /* one text in the chosen language(s): en & hi are strings or arrays */
  function T(en, hi) {
    var m = mode(), e = arr(en), h = arr(hi || en);
    if (m === 'en') return esc(e || '—');
    if (m === 'hi') return esc(h || '—');
    if (!h || h === e) return esc(e || '—');
    return esc(e || '—') + '<br><span class="hi" style="color:var(--blue)">' + esc(h) + '</span>';
  }
  function lbl(key) { var p = U[key] || [key, key], m = mode(); return m === 'en' ? p[0] : m === 'hi' ? p[1] : p[0] + ' / ' + p[1]; }
  function row(key, en, hi) { return '<tr><th>' + esc(lbl(key)) + '</th><td>' + T(en, hi) + '</td></tr>'; }
  function langToggle() {
    var m = mode(), L = [['en', U.langEn[0]], ['hi', U.langHi[0]], ['both', U.langBoth[0]]];
    return '<div class="seg" role="group" aria-label="Language" style="margin:6px 0">' + L.map(function (x) {
      return '<button type="button" data-mlang="' + x[0] + '"' + (m === x[0] ? ' class="on"' : '') + '>' + esc(x[1]) + '</button>';
    }).join('') + '</div>';
  }
  var zoomLvl = 1;
  function applyZoom() {
    document.querySelectorAll('#card-map .zwrap img').forEach(function (im) { im.style.width = (zoomLvl * 100) + '%'; });
    document.querySelectorAll('#card-map [data-z="reset"]').forEach(function (b) { b.textContent = Math.round(zoomLvl * 100) + '%'; });
  }
  function mapBox(kind, name, hiName) {
    var file = 'maps/' + kind + '/' + slug(name) + '.png';
    var note = mode() === 'hi' ? U.mapMissing[1] : mode() === 'en' ? U.mapMissing[0] : U.mapMissing[0] + ' / ' + U.mapMissing[1];
    var zb = '<div class="zbar" role="group" aria-label="Zoom">' +
      '<button type="button" data-z="out" aria-label="Zoom out">−</button>' +
      '<button type="button" data-z="reset" aria-label="Reset zoom">' + Math.round(zoomLvl * 100) + '%</button>' +
      '<button type="button" data-z="in" aria-label="Zoom in">+</button></div>';
    /* countries without their own silhouette show the whole-world reference map instead */
    return '<div class="mapbox" data-kind="' + kind + '">' + zb + '<div class="zwrap"><img src="' + file + '" alt="' + esc(name) + '" style="width:' + (zoomLvl * 100) + '%"></div>' +
      '<div class="mapnote" style="display:none">' + esc(note) + ' <b>' + esc(mode() === 'hi' && hiName ? hiName : name) + '</b> — <code>' + esc(file) + '</code></div></div>';
  }
  /* image fallbacks: own map → world reference (world tab) → note */
  document.addEventListener('error', function (e) {
    var im = e.target;
    if (!im || im.tagName !== 'IMG' || !im.closest || !im.closest('#card-map .mapbox')) return;
    var box = im.closest('.mapbox');
    if (box.getAttribute('data-kind') === 'world' && !im.dataset.fb) { im.dataset.fb = '1'; im.src = 'maps/world/_world-reference.jpg'; return; }
    box.querySelector('.zbar').style.display = 'none';
    box.querySelector('.zwrap').style.display = 'none';
    box.querySelector('.mapnote').style.display = 'block';
  }, true);
  function newsHtml(key) {
    var rn = (PT.data.regionNews || {})[key];
    if (!rn || !rn.items || !rn.items.length) return '<p class="sub">' + esc(U.noNews[mode() === 'hi' ? 1 : 0]) + (mode() === 'both' ? '<br>' + esc(U.noNews[1]) : '') + '</p>';
    return rn.items.map(function (it) {
      return '<div class="news"><small>' + esc(it.d) + ' · ' + esc(it.src) + '</small><h4>' + esc(it.t) + '</h4>' + (it.b ? '<div>' + esc(it.b) + '</div>' : '') + '</div>';
    }).join('') + '<small class="sub">' + esc(rn.day) + '</small>';
  }
  function syncSection(key) {
    var url = PT.data.settings.feedUrl;
    if (!url) { PT.toast('Add your feed link in Profile → Content feed first. / प्रोफ़ाइल → कंटेंट फ़ीड में फ़ीड लिंक जोड़ें।', 6000); return; }
    var sep = url.indexOf('?') < 0 ? '?' : '&';
    PT.toast('Syncing recent news… / हाल की खबरें सिंक हो रही हैं…', 1500);
    PT.native.get(url + sep + '_=' + Date.now()).then(function (txt) {
      var j = JSON.parse(txt), list = j.regions && j.regions[key];
      if (!Array.isArray(list) || !list.length) { PT.toast('No new items for this section yet. / इस भाग के लिए अभी नई खबरें नहीं।', 4000); return; }
      var items = list.slice(0, 12).map(function (x) { return { d: String(x.d || ''), t: String(x.t || ''), b: String(x.b || ''), src: String(x.src || '') }; }).filter(function (x) { return x.t; });
      PT.data.regionNews = PT.data.regionNews || {};
      PT.data.regionNews[key] = { day: PT.today(), items: items };
      PT.save();
      PT.toast('Synced ' + items.length + ' news items. / ' + items.length + ' खबरें सिंक हुईं।');
      render(B);
    }).catch(function () { PT.toast('Could not reach the feed. Check the feed link in Profile. / फ़ीड तक नहीं पहुँच सके।', 5000); });
  }

  function indiaView() {
    var list = PT.STATES, cur = list.filter(function (s) { return s.id === sel.india; })[0] || list[0];
    var hi = (PT.HI_STATES || {})[cur.id] || {}, sym = cur.sym || [], hsym = hi.sym || sym, seats = cur.seats || {};
    var seatsEn = 'Lok Sabha ' + (seats.ls || 0) + ' · Rajya Sabha ' + (seats.rs || 0) + ' · Vidhan Sabha ' + (seats.vs || 0) + ' · Vidhan Parishad ' + (seats.vp || 0) + (seats.vp ? '' : ' (none)');
    var seatsHi = 'लोकसभा ' + (seats.ls || 0) + ' · राज्यसभा ' + (seats.rs || 0) + ' · विधानसभा ' + (seats.vs || 0) + ' · विधान परिषद ' + (seats.vp || 0) + (seats.vp ? '' : ' (कोई नहीं)');
    var symEn = 'Bird: ' + (sym[0] || '—') + ' · Animal: ' + (sym[1] || '—') + ' · Flower: ' + (sym[2] || '—') + ' · Tree: ' + (sym[3] || '—');
    var symHi = 'पक्षी: ' + (hsym[0] || '—') + ' · पशु: ' + (hsym[1] || '—') + ' · पुष्प: ' + (hsym[2] || '—') + ' · वृक्ष: ' + (hsym[3] || '—');
    var lEn = (PT.STATE_LANG || {})[cur.id] || [], lHi = (PT.HI_STATE_LANG || {})[cur.id] || lEn;
    return '<label class="f">' + esc(lbl('pickState')) + '<select id="mp-ind">' + list.map(function (s) {
      var h = (PT.HI_STATES[s.id] || {}).name || s.name;
      return '<option value="' + s.id + '"' + (s.id === cur.id ? ' selected' : '') + '>' + esc(mode() === 'hi' ? h : mode() === 'en' ? s.name : s.name + ' · ' + h) + ' (' + s.type + ')</option>';
    }).join('') + '</select></label>' +
      '<h3 style="margin:10px 0 0">' + T(cur.name, hi.name) + '</h3><small class="sub">' + esc(cur.type) + '</small>' +
      mapBox('india', cur.name, hi.name) +
      '<table class="facts">' +
      row('capital', cur.capital, hi.capital) + row('formed', cur.formed, hi.formed) + row('day', cur.day, hi.day) +
      row('symbols', symEn, symHi) + row('officialLang', lEn, lHi) + row('seats', seatsEn, seatsHi) +
      row('rivers', cur.rivers, hi.rivers) + row('mountains', cur.mountains, hi.mountains) + row('plateau', cur.plateau, hi.plateau) +
      row('np', cur.np, hi.np) + row('wls', cur.wls, hi.wls) + row('tr', cur.tr, hi.tr) +
      row('rail', cur.rail, hi.rail) + row('dance', cur.dance, hi.dance) + row('fest', cur.fest, hi.fest) +
      row('border', cur.border, hi.border) + row('cm', cur.cm, hi.cm) + row('gov', cur.gov, hi.gov) + row('yojana', cur.yojana, hi.yojana) +
      '</table>' +
      '<h4 style="margin:8px 0 4px">' + esc(lbl('news')) + '</h4><div>' + newsHtml('state:' + cur.id) + '</div>' +
      '<div class="row" style="margin-top:8px;gap:8px"><button class="btn small" id="mp-sync" data-k="state:' + cur.id + '">' + esc(lbl('syncBtn')) + '</button><span class="sub" style="margin:0">' + esc(lbl('syncStateNote')) + '</span></div>';
  }

  function worldView() {
    var list = PT.WORLD, cur = list.filter(function (c) { return c.id === sel.world; })[0] || list[0];
    var hi = (PT.HI_WORLD || {})[cur.id] || {}, f = PT.flag(cur.id);
    return '<label class="f">' + esc(lbl('pickCountry')) + '<select id="mp-wld">' + list.map(function (c) {
      var h = (PT.HI_WORLD[c.id] || {}).name || c.name;
      return '<option value="' + c.id + '"' + (c.id === cur.id ? ' selected' : '') + '>' + PT.flag(c.id) + ' ' + esc(mode() === 'hi' ? h : mode() === 'en' ? c.name : c.name + ' · ' + h) + '</option>';
    }).join('') + '</select></label>' +
      '<h3 style="margin:10px 0 0">' + f + ' ' + T(cur.name, hi.name) + '</h3>' +
      '<div class="flagrow"><span class="flag" aria-hidden="true">' + f + '</span><small class="sub">' + esc(U.flag[mode() === 'hi' ? 1 : 0]) + (mode() === 'both' ? ' / ' + U.flag[1] : '') + '</small></div>' +
      mapBox('world', cur.name, hi.name) +
      '<table class="facts">' +
      row('continent', cur.continent, hi.continent) + row('capital', cur.capital, hi.capital) + row('currency', cur.currency, hi.currency) +
      row('head', cur.head, hi.head) + row('rivers', cur.rivers, hi.rivers) + row('mountains', cur.mountains, hi.mountains) +
      row('plateau', cur.plateau, hi.plateau) + row('volcanoes', cur.volcano, hi.volcano) + row('neighbours', cur.neighbours, hi.neighbours) +
      row('keyFacts', cur.notes, hi.notes) +
      '</table>' +
      '<h4 style="margin:8px 0 4px">' + esc(lbl('news')) + '</h4><div>' + newsHtml('world:' + cur.id) + '</div>' +
      '<div class="row" style="margin-top:8px;gap:8px"><button class="btn small" id="mp-sync" data-k="world:' + cur.id + '">' + esc(lbl('syncBtn')) + '</button><span class="sub" style="margin:0">' + esc(lbl('syncCountryNote')) + '</span></div>';
  }

  function orgsView() {
    var q = orgQ.toLowerCase();
    var list = PT.ORGS.filter(function (o) {
      var h = (PT.HI_ORGS[o.abbr] || {});
      return !q || (o.abbr + ' ' + o.name + ' ' + o.hq + ' ' + o.work + ' ' + o.scope + ' ' + (h.name || '') + ' ' + (h.hq || '') + ' ' + (h.work || '') + ' ' + (h.tagline || '')).toLowerCase().indexOf(q) >= 0;
    });
    return '<label class="f">' + esc(lbl('searchOrg')) + '<input type="search" id="mp-org" value="' + esc(orgQ) + '" placeholder="' + esc(U.searchPh[0]) + ' / ' + esc(U.searchPh[1]) + '"></label>' +
      '<p class="sub">' + list.length + ' ' + esc(U.ofWord[0]) + ' ' + PT.ORGS.length + ' ' + esc(U.orgCount[0]) + ' / ' + esc(U.orgCount[1]) + '</p>' +
      list.map(function (o) {
        var h = PT.HI_ORGS[o.abbr] || {};
        return '<div class="news"><h4>' + esc(o.abbr) + ' — ' + T(o.name, h.name) + '</h4>' +
          '<small>' + esc(o.scope) + ' · ' + esc(lbl('hqLbl')) + ': ' + T(o.hq, h.hq) + ' · ' + esc(lbl('foundedLbl')) + ': ' + T(o.founded, h.founded) + '</small>' +
          '<div><b>' + esc(lbl('headLbl')) + ':</b> ' + T(o.head, h.head) + '</div>' +
          '<div><b>' + esc(lbl('taglineLbl')) + ':</b> “' + T(o.tagline, h.tagline) + '”</div>' +
          '<div><b>' + esc(lbl('workLbl')) + ':</b> ' + T(o.work, h.work) + '</div></div>';
      }).join('');
  }

  function render(b) {
    B = b; if (!b) return;
    var tabs = [['india', U.tabIndia], ['world', U.tabWorld], ['orgs', U.tabOrgs]];
    b.innerHTML = '<p class="sub" style="margin-top:8px">' + esc(U.intro[mode() === 'hi' ? 1 : 0]) + (mode() === 'both' ? '<br>' + esc(U.intro[1]) : '') + '</p>' +
      langToggle() +
      '<div class="seg" role="tablist" style="margin:8px 0">' + tabs.map(function (t) { return '<button type="button" data-tab="' + t[0] + '"' + (tab === t[0] ? ' class="on"' : '') + '>' + esc(mode() === 'hi' ? t[1][1] : t[1][0]) + (mode() === 'both' ? ' / ' + esc(t[1][1]) : '') + '</button>'; }).join('') + '</div>' +
      '<div id="mp-body">' + (tab === 'india' ? indiaView() : tab === 'world' ? worldView() : orgsView()) + '</div>';
  }

  var root = document.getElementById('cards') || document;
  PT.on(root, 'click', '#card-map [data-tab]', function (e, el) { tab = el.getAttribute('data-tab'); render($('#card-map .body')); });
  PT.on(root, 'click', '#card-map [data-mlang]', function (e, el) { PT.data.mapLang = el.getAttribute('data-mlang'); PT.save(); render($('#card-map .body')); });
  PT.on(root, 'change', '#mp-ind', function (e, el) { sel.india = el.value; render($('#card-map .body')); });
  PT.on(root, 'change', '#mp-wld', function (e, el) { sel.world = el.value; render($('#card-map .body')); });
  PT.on(root, 'input', '#mp-org', function (e, el) { orgQ = el.value; var keep = el.selectionStart; render($('#card-map .body')); var n = $('#mp-org'); if (n) { n.focus(); n.setSelectionRange(keep, keep); } });
  PT.on(root, 'click', '#mp-sync', function (e, el) { syncSection(el.getAttribute('data-k')); });

  PT.on(root, 'click', '#card-map [data-z]', function (e, el) {
    var k = el.getAttribute('data-z');
    zoomLvl = k === 'in' ? Math.min(4, zoomLvl + 0.5) : k === 'out' ? Math.max(1, zoomLvl - 0.5) : 1;
    applyZoom();
  });
  /* Ctrl/⌘ + mouse wheel zooms the map; two-finger pinch zooms on touch screens */
  PT.on(root, 'wheel', '#card-map .zwrap', function (e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    zoomLvl = Math.min(4, Math.max(1, zoomLvl * (e.deltaY < 0 ? 1.1 : 0.9)));
    applyZoom();
  });
  var pinchD = 0;
  function touchDist(t) { var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY; return Math.sqrt(dx * dx + dy * dy); }
  document.addEventListener('touchstart', function (e) { if (e.touches.length === 2 && e.target.closest && e.target.closest('#card-map .zwrap')) pinchD = touchDist(e.touches); }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    if (e.touches.length !== 2 || !pinchD || !(e.target.closest && e.target.closest('#card-map .zwrap'))) return;
    e.preventDefault();
    var d = touchDist(e.touches);
    zoomLvl = Math.min(4, Math.max(1, zoomLvl * d / pinchD)); pinchD = d; applyZoom();
  }, { passive: false });
  document.addEventListener('touchend', function () { pinchD = 0; });

  PT.card({
    id: 'map', icon: '🗺️', title: 'Maps & Country Guide · मानचित्र व देश मार्गदर्शिका',
    sum: function () { return PT.STATES.length + ' states & UTs · ' + PT.WORLD.length + ' countries · ' + PT.ORGS.length + ' organisations'; },
    render: render
  });
})();
