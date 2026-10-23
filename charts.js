/* Tiny canvas charts: bar, line, pie. No external libraries. */
(function () {
  var PT = window.PT;
  function ctx(cv, h) {
    var dpr = window.devicePixelRatio || 1, w = cv.clientWidth || 300;
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); cv.style.height = h + 'px';
    var c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); return { c: c, w: w, h: h };
  }
  function ink() { return PT.cssVar('--text') || '#222'; }
  function muted() { return PT.cssVar('--muted') || '#888'; }
  function line() { return PT.cssVar('--line') || '#ddd'; }
  PT.chart = function (cv, type, labels, series, opts) {
    opts = opts || {};
    var h = opts.h || 220, g = ctx(cv, h), c = g.c, W = g.w, H = h;
    c.clearRect(0, 0, W, H); c.font = '12px system-ui,sans-serif'; c.fillStyle = ink(); c.strokeStyle = line();
    if (type === 'pie') {
      var tot = series.reduce(function (a, s) { return a + s.v; }, 0);
      if (!tot) { c.fillStyle = muted(); c.fillText('No data for this period', 10, H / 2); return; }
      var cx = Math.min(W * .35, H / 2), cy = H / 2, R = Math.min(cx, cy) - 10, ang = -Math.PI / 2;
      series.forEach(function (s) {
        var a = s.v / tot * Math.PI * 2; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, ang, ang + a); c.closePath();
        c.fillStyle = s.color; c.fill(); c.strokeStyle = PT.cssVar('--card') || '#fff'; c.lineWidth = 2; c.stroke(); ang += a;
      });
      var lx = cx * 2 + 16; c.font = '13px system-ui,sans-serif';
      series.forEach(function (s, i) {
        var y = 24 + i * 22; c.fillStyle = s.color; c.fillRect(lx, y - 10, 12, 12); c.fillStyle = ink();
        c.fillText(s.name + ' · ' + PT.hm(s.v) + ' (' + Math.round(s.v / tot * 100) + '%)', lx + 18, y);
      });
      return;
    }
    var pad = { l: 44, r: 10, t: 14, b: 40 }, pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
    var max = 0; series.forEach(function (s) { s.v.forEach(function (x) { if (x > max) max = x; }); });
    if (max <= 0) max = 1;
    var unit = opts.unit || 'h', div = unit === 'h' ? 3600 : 1, top = Math.ceil(max / div * 1.1 * 10) / 10 || 1;
    c.font = '11px system-ui,sans-serif';
    for (var k = 0; k <= 4; k++) {
      var y = pad.t + ph - ph * k / 4; c.beginPath(); c.moveTo(pad.l, y); c.lineTo(W - pad.r, y); c.strokeStyle = line(); c.stroke();
      c.fillStyle = muted(); c.fillText((top * k / 4).toFixed(top < 2 ? 1 : 0) + unit, 4, y + 4);
    }
    var n = labels.length, step = pw / Math.max(1, n), skip = Math.ceil(n / Math.max(1, Math.floor(pw / 34)));
    labels.forEach(function (lb, i) {
      if (i % skip) return; c.fillStyle = muted(); var x = pad.l + step * i + step / 2;
      c.save(); c.translate(x, H - 24); c.rotate(n > 8 ? -0.6 : 0); c.textAlign = n > 8 ? 'right' : 'center'; c.fillText(lb, 0, 0); c.restore();
    });
    if (type === 'bar') {
      var ns = series.length, bw = Math.max(2, step * .7 / ns);
      series.forEach(function (s, si) {
        c.fillStyle = s.color;
        s.v.forEach(function (x, i) {
          var bh = x / (top * div) * ph, bx = pad.l + step * i + step * .15 + si * bw, by = pad.t + ph - bh;
          if (bh > 0) { c.beginPath(); var r = Math.min(4, bw / 2); c.moveTo(bx, pad.t + ph); c.lineTo(bx, by + r); c.quadraticCurveTo(bx, by, bx + r, by); c.lineTo(bx + bw - r, by); c.quadraticCurveTo(bx + bw, by, bx + bw, by + r); c.lineTo(bx + bw, pad.t + ph); c.closePath(); c.fill(); }
        });
      });
    } else {
      series.forEach(function (s) {
        c.strokeStyle = s.color; c.lineWidth = 2.2; c.beginPath();
        s.v.forEach(function (x, i) { var px = pad.l + step * i + step / 2, py = pad.t + ph - x / (top * div) * ph; i ? c.lineTo(px, py) : c.moveTo(px, py); });
        c.stroke(); c.fillStyle = s.color;
        s.v.forEach(function (x, i) { var px = pad.l + step * i + step / 2, py = pad.t + ph - x / (top * div) * ph; c.beginPath(); c.arc(px, py, 3, 0, Math.PI * 2); c.fill(); });
      });
    }
    if (series.length > 1) {
      c.font = '12px system-ui,sans-serif'; var lx2 = pad.l;
      series.forEach(function (s) { c.fillStyle = s.color; c.fillRect(lx2, H - 12, 10, 10); c.fillStyle = ink(); c.fillText(s.name, lx2 + 14, H - 3); lx2 += c.measureText(s.name).width + 34; });
    }
  };
})();
