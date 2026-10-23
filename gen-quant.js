/* Question generators — Maths & Statistics (bilingual). Each gen(r, hard) -> question */
(function () {
  var PT = window.PT = window.PT || {};
  var G = PT.GEN = PT.GEN || {};

  function fmt(n) { if (typeof n === 'string') return n; var x = Math.round(n * 100) / 100; return String(x); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  PT.gcd = gcd;
  function choice(r, correct, wrongs) {
    correct = fmt(correct); var set = [correct];
    wrongs.forEach(function (w) { w = fmt(w); if (set.indexOf(w) < 0) set.push(w); });
    var n = parseFloat(correct), tries = 0;
    while (set.length < 4 && !isNaN(n) && tries++ < 80) {
      var mag = Math.abs(n) > 50 ? Math.ceil(Math.abs(n) / 20) : 1;
      var v = fmt(n + r.pick([1, 2, 3, 4, 5, -1, -2, -3, -4, -5]) * mag);
      if (set.indexOf(v) < 0 && (n < 0 || parseFloat(v) >= 0)) set.push(v);
    }
    var k = 1; while (set.length < 4) set.push(correct + ' ' + (k++));
    set = set.slice(0, 4); var sh = r.shuffle(set); return { o: sh, a: sh.indexOf(correct) };
  }
  function Q(r, topic, en, hi, ans, wrongs, ee, eh) {
    var c = choice(r, ans, wrongs);
    return { t: topic, q: [en, hi], o: c.o, a: c.a, e: [ee || '', eh || ee || ''] };
  }
  PT.choice = choice; PT.mkQ = Q; PT.fmtNum = fmt;
  function near(c, k) { k = k || Math.max(1, Math.round(Math.abs(c) * 0.08)); return [c + k, c - k, c + 2 * k, c - 2 * k, c + 3 * k]; }
  function pr(a, b) { var g = gcd(a, b); return (a / g) + ' : ' + (b / g); }

  var M = {};
  M.pctOf = function (r, h) {
    var N = r.int(2, h ? 90 : 40) * 40, p = r.pick([5, 8, 12, 15, 16, 20, 24, 25, 30, 35, 40, 45, 60, 75]), a = N * p / 100;
    if (h && r.int(0, 1)) { var q = r.pick([20, 25, 40, 50]), ans = N * p / 100 * q / 100; return Q(r, 'Percentage', p + '% of ' + q + '% of ' + N + ' = ?', N + ' का ' + q + '% का ' + p + '% = ?', ans, near(ans), 'Multiply stepwise: ' + N + '×' + q + '/100×' + p + '/100 = ' + fmt(ans)); }
    return Q(r, 'Percentage', 'What is ' + p + '% of ' + N + '?', p + '% of ' + N + ' कितना होगा?', a, near(a, Math.max(2, Math.round(a / 10))), p + '% of ' + N + ' = ' + N + '×' + p + '/100 = ' + a);
  };
  M.whatPct = function (r) {
    var b = r.pick([20, 25, 40, 50, 80, 125, 200, 250, 400]), p = r.pick([5, 10, 12.5, 15, 20, 25, 30, 40, 60, 75]), a = b * p / 100;
    return Q(r, 'Percentage', a + ' is what percent of ' + b + '?', a + ' ' + b + ' का कितना प्रतिशत है?', p + '%', [(p + 5) + '%', (p + 10) + '%', Math.max(1, p - 5) + '%', (p * 2) + '%'], '(' + a + '/' + b + ')×100 = ' + p + '%');
  };
  M.pctChange = function (r) {
    var x = r.pick([10, 20, 25, 30, 40, 50]), y = r.pick([10, 20, 25, 40]), net = x - y - x * y / 100;
    var ans = (net >= 0 ? fmt(net) + '% increase' : fmt(-net) + '% decrease'), ansH = (net >= 0 ? fmt(net) + '% वृद्धि' : fmt(-net) + '% कमी');
    var c = choice(r, ans, [fmt(Math.abs(net) + 2) + '% increase', fmt(Math.abs(net) + 2) + '% decrease', fmt(Math.abs(x - y)) + '% ' + (x - y >= 0 ? 'increase' : 'decrease'), fmt(Math.abs(net) + 5) + '% decrease']);
    var o = c.o.map(function (s) { return [s, s.replace('increase', 'वृद्धि').replace('decrease', 'कमी')]; });
    return { t: 'Percentage', q: ['A number is first increased by ' + x + '% and then decreased by ' + y + '%. What is the net change?', 'किसी संख्या को पहले ' + x + '% बढ़ाया गया और फिर ' + y + '% घटाया गया। शुद्ध परिवर्तन क्या है?'], o: o, a: c.a, e: ['Net % = x − y − xy/100 = ' + x + ' − ' + y + ' − ' + x * y / 100 + ' = ' + fmt(net), 'शुद्ध % = x − y − xy/100 = ' + fmt(net)] };
  };
  M.population = function (r) {
    var x = r.pick([10, 20]), P = r.int(1, 9) * 10000, ans = Math.round(P * Math.pow(1 + x / 100, 2));
    return Q(r, 'Percentage', 'The population of a town is ' + P + '. It grows ' + x + '% every year. What will it be after 2 years?', 'एक कस्बे की जनसंख्या ' + P + ' है। यह प्रतिवर्ष ' + x + '% बढ़ती है। 2 वर्ष बाद जनसंख्या कितनी होगी?', ans, near(ans, Math.round(ans / 40)), P + '×(1+' + x + '/100)² = ' + ans);
  };
  M.ratioDivide = function (r, h) {
    var a = r.int(2, 7), b = r.int(a + 1, 11), k = r.int(3, h ? 40 : 15) * 10, N = (a + b) * k, ans = b * k;
    return Q(r, 'Ratio & Proportion', '₹' + N + ' is divided between A and B in the ratio ' + a + ' : ' + b + '. What is the larger share?', '₹' + N + ' को A और B में ' + a + ' : ' + b + ' के अनुपात में बाँटा गया। बड़ा हिस्सा कितना है?', '₹' + ans, ['₹' + a * k, '₹' + (ans + k), '₹' + (ans - k), '₹' + (N / 2 + k)], 'One part = ' + N + '/' + (a + b) + ' = ' + k + '; larger share = ' + b + '×' + k + ' = ' + ans);
  };
  M.ratioChain = function (r) {
    var m = r.int(1, 5), n = r.int(2, 7), p = r.int(1, 6), q = r.int(2, 7), ans = pr(m * p, n * q);
    var w = [pr(m * q, n * p), pr(m * n, p * q), pr(m + p, n + q), pr(n * p, m * q)];
    return Q(r, 'Ratio & Proportion', 'If A : B = ' + m + ' : ' + n + ' and B : C = ' + p + ' : ' + q + ', then A : C = ?', 'यदि A : B = ' + m + ' : ' + n + ' और B : C = ' + p + ' : ' + q + ', तो A : C = ?', ans, w, 'Make B equal: A:B:C = ' + m * p + ' : ' + n * p + ' : ' + n * q + ' ⇒ A:C = ' + ans);
  };
  M.profit = function (r, h) {
    var C = r.int(5, h ? 90 : 40) * 20, p = r.pick([5, 10, 12.5, 15, 20, 25, 30, 40]);
    if (r.int(0, 1)) { var S = C * (100 + p) / 100; return Q(r, 'Profit & Loss', 'An article bought for ₹' + C + ' is sold at a profit of ' + p + '%. Find the selling price.', '₹' + C + ' में खरीदी वस्तु ' + p + '% लाभ पर बेची गई। विक्रय मूल्य ज्ञात कीजिए।', '₹' + fmt(S), ['₹' + fmt(C * (100 - p) / 100), '₹' + fmt(S + C / 20), '₹' + fmt(S - C / 20), '₹' + fmt(C + p)], 'SP = CP×(100+p)/100 = ' + C + '×' + (100 + p) + '/100 = ' + fmt(S)); }
    var S2 = C * (100 - p) / 100; return Q(r, 'Profit & Loss', 'By selling an article for ₹' + fmt(S2) + ', a man loses ' + p + '%. What is its cost price?', '₹' + fmt(S2) + ' में वस्तु बेचने पर ' + p + '% हानि होती है। क्रय मूल्य क्या है?', '₹' + C, ['₹' + (C + 20), '₹' + (C - 20), '₹' + fmt(S2 * (100 + p) / 100), '₹' + (C + 40)], 'CP = SP×100/(100−p) = ' + fmt(S2) + '×100/' + (100 - p) + ' = ' + C);
  };
  M.discount = function (r) {
    var Mp = r.int(5, 60) * 100, d1 = r.pick([10, 20, 25, 30]), d2 = r.pick([5, 10, 20]);
    if (r.int(0, 1)) { var S = Mp * (100 - d1) / 100; return Q(r, 'Profit & Loss', 'The marked price of a shirt is ₹' + Mp + '. After a discount of ' + d1 + '% what is the selling price?', 'एक शर्ट का अंकित मूल्य ₹' + Mp + ' है। ' + d1 + '% छूट के बाद विक्रय मूल्य क्या होगा?', '₹' + fmt(S), ['₹' + fmt(Mp * (100 + d1) / 100), '₹' + fmt(S + Mp / 20), '₹' + fmt(S - Mp / 20), '₹' + fmt(Mp - d1)], 'SP = ' + Mp + '×(100−' + d1 + ')/100 = ' + fmt(S)); }
    var eq = d1 + d2 - d1 * d2 / 100; return Q(r, 'Profit & Loss', 'Two successive discounts of ' + d1 + '% and ' + d2 + '% are equal to a single discount of:', d1 + '% और ' + d2 + '% की दो क्रमागत छूट एकल छूट के बराबर है:', fmt(eq) + '%', [fmt(d1 + d2) + '%', fmt(eq + 2) + '%', fmt(Math.abs(d1 - d2)) + '%'], 'd1 + d2 − d1·d2/100 = ' + d1 + ' + ' + d2 + ' − ' + d1 * d2 / 100 + ' = ' + fmt(eq));
  };
  M.si = function (r) {
    var P = r.int(2, 40) * 500, R = r.pick([4, 5, 6, 8, 10, 12]), T = r.int(2, 6), ans = P * R * T / 100;
    return Q(r, 'Simple & Compound Interest', 'Find the simple interest on ₹' + P + ' at ' + R + '% per annum for ' + T + ' years.', '₹' + P + ' पर ' + R + '% वार्षिक दर से ' + T + ' वर्ष का साधारण ब्याज ज्ञात कीजिए।', '₹' + ans, ['₹' + (ans + P / 10), '₹' + (ans - P / 20), '₹' + (ans * 2), '₹' + (ans + P / 5)], 'SI = PRT/100 = ' + P + '×' + R + '×' + T + '/100 = ' + ans);
  };
  M.ci2 = function (r) {
    var R = r.pick([10, 20]), P = r.pick([2000, 4000, 5000, 8000, 10000, 20000]), ans = Math.round(P * (Math.pow(1 + R / 100, 2) - 1) * 100) / 100;
    return Q(r, 'Simple & Compound Interest', 'What is the compound interest on ₹' + P + ' for 2 years at ' + R + '% per annum (compounded annually)?', '₹' + P + ' पर ' + R + '% वार्षिक दर से 2 वर्ष का चक्रवृद्धि ब्याज (वार्षिक संयोजन) क्या होगा?', '₹' + fmt(ans), ['₹' + fmt(P * R * 2 / 100), '₹' + fmt(ans + P / 50), '₹' + fmt(ans - P / 50), '₹' + fmt(ans + P / 20)], 'CI = P[(1+R/100)² − 1] = ' + fmt(ans) + '; (SI would be ' + P * R * 2 / 100 + ')');
  };
  M.ciSi = function (r) {
    var R = r.pick([5, 10, 20]), P = r.pick([2000, 4000, 5000, 8000, 10000, 20000, 40000]), ans = P * R * R / 10000;
    return Q(r, 'Simple & Compound Interest', 'The difference between compound and simple interest on ₹' + P + ' for 2 years at ' + R + '% p.a. is:', '₹' + P + ' पर 2 वर्ष के लिए ' + R + '% वार्षिक दर से चक्रवृद्धि और साधारण ब्याज का अंतर है:', '₹' + fmt(ans), ['₹' + fmt(ans * 2), '₹' + fmt(ans + 10), '₹' + fmt(ans / 2), '₹' + fmt(ans * 3)], 'CI − SI (2 yrs) = P(R/100)² = ' + P + '×(' + R + '/100)² = ' + fmt(ans));
  };
  M.ci3 = function (r) {
    var P = r.pick([1000, 2000, 5000, 8000, 10000]), ans = P * (Math.pow(1.1, 3) - 1);
    return Q(r, 'Simple & Compound Interest', 'Find the compound interest on ₹' + P + ' for 3 years at 10% p.a.', '₹' + P + ' पर 10% वार्षिक दर से 3 वर्ष का चक्रवृद्धि ब्याज ज्ञात कीजिए।', '₹' + fmt(ans), ['₹' + fmt(P * .3), '₹' + fmt(ans + P / 20), '₹' + fmt(ans - P / 20), '₹' + fmt(P * .33)], 'A = P(1.1)³ = ' + fmt(P * 1.331) + '; CI = A − P = ' + fmt(ans));
  };
  var WP = [[10, 15, 6], [12, 24, 8], [20, 30, 12], [18, 36, 12], [30, 45, 18], [24, 40, 15], [14, 35, 10], [21, 28, 12], [16, 48, 12], [15, 60, 12], [20, 60, 15], [9, 18, 6]];
  M.timeWork = function (r) {
    var p = r.pick(WP);
    return Q(r, 'Time & Work', 'A can finish a work in ' + p[0] + ' days and B in ' + p[1] + ' days. Working together, in how many days will they finish it?', 'A एक कार्य को ' + p[0] + ' दिनों में और B ' + p[1] + ' दिनों में कर सकता है। साथ मिलकर वे इसे कितने दिनों में पूरा करेंगे?', p[2] + ' days', [(p[2] + 2) + ' days', (p[2] - 1) + ' days', ((p[0] + p[1]) / 2) + ' days', (p[2] + 4) + ' days'], 'Together = xy/(x+y) = ' + p[0] * p[1] + '/' + (p[0] + p[1]) + ' = ' + p[2] + ' days');
  };
  var TW = [[12, 20, 30], [6, 10, 15], [8, 24, 12], [15, 20, 60], [10, 15, 30], [12, 30, 20], [18, 30, 45], [20, 30, 60], [24, 40, 60]];
  M.timeWork2 = function (r) {
    var p = r.pick(TW);
    return Q(r, 'Time & Work', 'A and B together can do a work in ' + p[0] + ' days. A alone can do it in ' + p[1] + ' days. In how many days can B alone do it?', 'A और B मिलकर कार्य ' + p[0] + ' दिनों में करते हैं। A अकेला इसे ' + p[1] + ' दिनों में कर सकता है। B अकेला कितने दिनों में करेगा?', p[2] + ' days', [(p[2] + 5) + ' days', (p[2] - 4) + ' days', (p[1] - p[0]) + ' days', (p[2] + 10) + ' days'], 'B = 1/(1/' + p[0] + ' − 1/' + p[1] + ') = ' + p[2] + ' days');
  };
  var PP = [[12, 20, 30], [10, 15, 30], [6, 9, 18], [15, 30, 30], [20, 30, 60], [8, 12, 24]];
  M.pipes = function (r) {
    var p = r.pick(PP);
    return Q(r, 'Pipes & Cisterns', 'Pipe A fills a tank in ' + p[0] + ' minutes and pipe B empties it in ' + p[1] + ' minutes. If both are opened together, in how much time will the empty tank be full?', 'पाइप A टंकी को ' + p[0] + ' मिनट में भरता है और पाइप B इसे ' + p[1] + ' मिनट में खाली करता है। दोनों साथ खोलने पर खाली टंकी कितने समय में भरेगी?', p[2] + ' minutes', [(p[2] + 6) + ' minutes', (p[2] - 5) + ' minutes', (p[0] + p[1]) + ' minutes', (p[2] * 2) + ' minutes'], 'Net rate = 1/' + p[0] + ' − 1/' + p[1] + '; time = ' + p[0] * p[1] + '/' + (p[1] - p[0]) + ' = ' + p[2] + ' min');
  };
  M.speedConv = function (r) {
    if (r.int(0, 1)) { var k = r.int(2, 12), v = 18 * k, ans = 5 * k; return Q(r, 'Time, Speed & Distance', 'Convert ' + v + ' km/h into m/s.', v + ' किमी/घंटा को मी/से में बदलिए।', ans + ' m/s', [(ans + 2) + ' m/s', (ans - 2) + ' m/s', (v / 3.6 + 5) + ' m/s'], 'km/h × 5/18 = ' + v + '×5/18 = ' + ans + ' m/s'); }
    var m = r.int(2, 20) * 5, kmh = m * 18 / 5; return Q(r, 'Time, Speed & Distance', 'Convert ' + m + ' m/s into km/h.', m + ' मी/से को किमी/घंटा में बदलिए।', kmh + ' km/h', [(kmh + 9) + ' km/h', (kmh - 9) + ' km/h', (m * 5 / 18) + ' km/h'], 'm/s × 18/5 = ' + kmh + ' km/h');
  };
  M.trainPole = function (r) {
    var k = r.int(2, 8), v = 18 * k, t = r.int(4, 15), L = 5 * k * t;
    return Q(r, 'Time, Speed & Distance', 'A train ' + L + ' m long runs at ' + v + ' km/h. How long will it take to cross a pole?', L + ' मी लंबी रेलगाड़ी ' + v + ' किमी/घंटा की चाल से चलती है। एक खंभे को पार करने में कितना समय लगेगा?', t + ' seconds', [(t + 2) + ' seconds', (t - 1) + ' seconds', (t + 5) + ' seconds', (t * 2) + ' seconds'], 'Speed = ' + v + '×5/18 = ' + 5 * k + ' m/s; time = ' + L + '/' + 5 * k + ' = ' + t + ' s');
  };
  M.trainPlatform = function (r, h) {
    var s = r.pick([10, 15, 20, 25]), t = r.int(h ? 20 : 12, 40), tot = s * t, L = r.int(2, Math.floor(tot / 20)) * 10, P = tot - L;
    if (P <= 0) { L = 100; P = Math.max(50, tot - 100); }
    var real = (L + P) / t * 3.6;
    return Q(r, 'Time, Speed & Distance', 'A ' + L + ' m long train crosses a ' + P + ' m long platform in ' + t + ' seconds. Find the speed of the train in km/h.', L + ' मी लंबी रेलगाड़ी ' + P + ' मी लंबे प्लेटफॉर्म को ' + t + ' सेकंड में पार करती है। रेलगाड़ी की चाल किमी/घंटा में ज्ञात कीजिए।', fmt(real) + ' km/h', [fmt(real + 9) + ' km/h', fmt(real - 9) + ' km/h', fmt(real + 18) + ' km/h', fmt((L + P) / t) + ' km/h'], 'Speed = (' + L + '+' + P + ')/' + t + ' = ' + (L + P) / t + ' m/s = ' + fmt(real) + ' km/h');
  };
  var AV = [[40, 60, 48], [30, 60, 40], [20, 30, 24], [60, 90, 72], [40, 24, 30], [50, 75, 60], [45, 90, 60], [30, 45, 36], [60, 40, 48], [36, 45, 40]];
  M.avgSpeed = function (r) {
    var p = r.pick(AV);
    return Q(r, 'Time, Speed & Distance', 'A man goes from A to B at ' + p[0] + ' km/h and returns at ' + p[1] + ' km/h along the same route. What is his average speed for the whole journey?', 'एक व्यक्ति A से B ' + p[0] + ' किमी/घंटा से जाता है और उसी रास्ते से ' + p[1] + ' किमी/घंटा से लौटता है। पूरी यात्रा की औसत चाल क्या है?', p[2] + ' km/h', [((p[0] + p[1]) / 2) + ' km/h', (p[2] + 4) + ' km/h', (p[2] - 3) + ' km/h', Math.round(Math.sqrt(p[0] * p[1]) * 10) / 10 + ' km/h'], 'Average speed = 2ab/(a+b) = 2×' + p[0] + '×' + p[1] + '/' + (p[0] + p[1]) + ' = ' + p[2]);
  };
  M.relSpeed = function (r) {
    var sm = r.pick([36, 54, 72, 90]), v1 = r.int(1, sm / 18 - 0) * 9, ms = sm * 5 / 18, t = r.int(5, 14), tot = ms * t, L1 = Math.round(tot * 0.4 / 10) * 10, L2 = tot - L1;
    if (L1 <= 0 || L2 <= 0) { L1 = 100; L2 = tot - 100; if (L2 <= 0) { L2 = 100; tot = 200; t = tot / ms; } }
    var tt = (L1 + L2) / ms;
    return Q(r, 'Time, Speed & Distance', 'Two trains of lengths ' + L1 + ' m and ' + L2 + ' m run in opposite directions at a combined speed of ' + sm + ' km/h (relative). In how many seconds will they cross each other?', L1 + ' मी और ' + L2 + ' मी लंबी दो रेलगाड़ियाँ विपरीत दिशाओं में ' + sm + ' किमी/घंटा की सापेक्ष चाल से चलती हैं। वे एक-दूसरे को कितने सेकंड में पार करेंगी?', fmt(tt) + ' seconds', [fmt(tt + 2) + ' seconds', fmt(tt - 1) + ' seconds', fmt(tt + 4) + ' seconds', fmt(tt * 2) + ' seconds'], 'Relative speed = ' + sm + '×5/18 = ' + ms + ' m/s; time = ' + (L1 + L2) + '/' + ms + ' = ' + fmt(tt) + ' s');
  };
  M.boat = function (r) {
    var u = r.pick([12, 15, 18, 20, 24]), v = r.pick([2, 3, 4, 5]), d = (u + v) * r.int(2, 6);
    if (r.int(0, 1)) return Q(r, 'Boats & Streams', 'A boat’s speed in still water is ' + u + ' km/h and the stream flows at ' + v + ' km/h. How long will it take to go ' + d + ' km downstream?', 'नाव की स्थिर जल में चाल ' + u + ' किमी/घंटा और धारा की चाल ' + v + ' किमी/घंटा है। धारा के अनुकूल ' + d + ' किमी जाने में कितना समय लगेगा?', (d / (u + v)) + ' hours', [(d / (u - v)) + ' hours', (d / (u + v) + 1) + ' hours', (d / u) + ' hours'], 'Downstream speed = ' + (u + v) + ' km/h; time = ' + d + '/' + (u + v) + ' = ' + d / (u + v) + ' h');
    return Q(r, 'Boats & Streams', 'A boat goes ' + (u + v) + ' km downstream in 1 hour and ' + (u - v) + ' km upstream in 1 hour. What is the speed of the stream?', 'एक नाव धारा के अनुकूल 1 घंटे में ' + (u + v) + ' किमी तथा धारा के प्रतिकूल 1 घंटे में ' + (u - v) + ' किमी जाती है। धारा की चाल क्या है?', v + ' km/h', [(v + 1) + ' km/h', (v + 2) + ' km/h', Math.max(1, v - 1) + ' km/h', u + ' km/h'], 'Stream = (down − up)/2 = (' + (u + v) + ' − ' + (u - v) + ')/2 = ' + v);
  };
  M.average = function (r) {
    var n = r.int(4, 9), a = r.int(20, 60), d = r.int(1, 6), x = a + (n + 1) * d;
    return Q(r, 'Average', 'The average of ' + n + ' numbers is ' + a + '. When a new number is included, the average becomes ' + (a + d) + '. The new number is:', n + ' संख्याओं का औसत ' + a + ' है। एक नई संख्या जोड़ने पर औसत ' + (a + d) + ' हो जाता है। नई संख्या है:', x, [x + 3, x - 4, a + d, x + 8], 'New number = new avg×(n+1) − old sum = ' + (a + d) * (n + 1) + ' − ' + a * n + ' = ' + x);
  };
  M.average2 = function (r) {
    var n = r.int(5, 40); var t = r.int(0, 2);
    if (t === 0) return Q(r, 'Average', 'What is the average of the first ' + n + ' natural numbers?', 'पहली ' + n + ' प्राकृत संख्याओं का औसत क्या है?', (n + 1) / 2, [n / 2, (n + 2) / 2, n, (n + 1)], 'Average = (n+1)/2 = ' + (n + 1) / 2);
    if (t === 1) return Q(r, 'Average', 'What is the average of the first ' + n + ' even natural numbers?', 'पहली ' + n + ' सम प्राकृत संख्याओं का औसत क्या है?', n + 1, [n, n + 2, 2 * n, n - 1], 'Average = n+1 = ' + (n + 1));
    return Q(r, 'Average', 'What is the sum of the first ' + n + ' odd natural numbers?', 'पहली ' + n + ' विषम प्राकृत संख्याओं का योग क्या है?', n * n, [n * (n + 1), n * n + n / 2 | 0, n * n - 1, 2 * n], 'Sum of first n odd numbers = n² = ' + n * n);
  };
  M.lcmhcf = function (r, h) {
    var hh = r.int(2, h ? 15 : 9), a = r.pick([2, 3, 4, 5, 7]), b = r.pick([3, 5, 7, 8, 9, 11]); if (gcd(a, b) !== 1) b += 1; while (gcd(a, b) !== 1) b++;
    var x = hh * a, y = hh * b, l = hh * a * b;
    if (r.int(0, 1)) return Q(r, 'Number System', 'Find the LCM of ' + x + ' and ' + y + '.', x + ' और ' + y + ' का LCM ज्ञात कीजिए।', l, [l + hh, l * 2, x * y, l - hh], 'HCF = ' + hh + '; LCM = (' + x + '×' + y + ')/' + hh + ' = ' + l);
    return Q(r, 'Number System', 'The HCF of two numbers is ' + hh + ' and their LCM is ' + l + '. If one number is ' + x + ', the other is:', 'दो संख्याओं का HCF ' + hh + ' तथा LCM ' + l + ' है। यदि एक संख्या ' + x + ' है, तो दूसरी संख्या है:', y, [y + hh, y - hh, l / 2 | 0, y + 2 * hh], 'Product of numbers = HCF×LCM ⇒ other = ' + hh + '×' + l + '/' + x + ' = ' + y);
  };
  M.remainder = function (r, h) {
    var N = r.int(h ? 5000 : 200, h ? 99999 : 2999), d = r.pick([7, 8, 9, 11, 12, 13, 15]), ans = N % d;
    return Q(r, 'Number System', 'What is the remainder when ' + N + ' is divided by ' + d + '?', N + ' को ' + d + ' से भाग देने पर शेषफल क्या होगा?', ans, [(ans + 1) % d, (ans + 2) % d, (ans + 3) % d, (ans + d - 1) % d, (ans + 4) % d], N + ' = ' + d + '×' + Math.floor(N / d) + ' + ' + ans);
  };
  M.unitDigit = function (r) {
    var a = r.int(2, 9), n = r.int(15, 99), v = 1; for (var i = 0; i < n % 4 + 4; i++) v = v * a % 10;
    var ans = 1; for (var j = 0; j < n; j++) ans = ans * a % 10;
    return Q(r, 'Number System', 'What is the unit digit of ' + a + '^' + n + '?', a + '^' + n + ' का इकाई अंक क्या है?', ans, [(ans + 1) % 10, (ans + 3) % 10, (ans + 5) % 10, (ans + 7) % 10, (ans + 9) % 10], 'Unit digits of powers of ' + a + ' repeat in cycles of 4; ' + n + ' mod 4 = ' + n % 4 + ' ⇒ ' + ans);
  };
  M.simplify = function (r) {
    var a = r.int(10, 60), b = r.int(2, 12), c = r.int(2, 9), e = r.int(2, 8), d = e * r.int(2, 9), f = r.int(1, 9);
    var ans = a + b * c - d / e + f;
    return Q(r, 'Simplification', 'Simplify: ' + a + ' + ' + b + ' × ' + c + ' − ' + d + ' ÷ ' + e + ' + ' + f, 'मान ज्ञात कीजिए: ' + a + ' + ' + b + ' × ' + c + ' − ' + d + ' ÷ ' + e + ' + ' + f, ans, [ans + 5, ans - 6, ans + b, (a + b) * c - d / e + f], 'BODMAS: ' + b * c + ' and ' + d / e + ' first ⇒ ' + a + ' + ' + b * c + ' − ' + d / e + ' + ' + f + ' = ' + ans);
  };
  M.sqroot = function (r, h) {
    var n = r.int(h ? 21 : 11, h ? 79 : 49);
    if (r.int(0, 1)) return Q(r, 'Simplification', '√' + n * n + ' = ?', '√' + n * n + ' = ?', n, [n + 1, n - 1, n + 2, n - 2], n + '² = ' + n * n);
    var c = r.int(3, h ? 19 : 12); return Q(r, 'Simplification', '∛' + c * c * c + ' = ?', '∛' + c * c * c + ' = ?', c, [c + 1, c - 1, c + 2, c * 2], c + '³ = ' + c * c * c);
  };
  M.mensuration = function (r, h) {
    var t = r.int(0, 5);
    if (t === 0) { var l = r.int(8, 40), b = r.int(4, l - 1); return Q(r, 'Mensuration', 'The perimeter of a rectangle is ' + 2 * (l + b) + ' cm and its length is ' + l + ' cm. Find its area.', 'एक आयत का परिमाप ' + 2 * (l + b) + ' सेमी तथा लंबाई ' + l + ' सेमी है। उसका क्षेत्रफल ज्ञात कीजिए।', l * b + ' cm²', [(l * b + l) + ' cm²', (l * b - b) + ' cm²', ((l + b) * (l + b) / 4) + ' cm²', (l * b + 2 * b) + ' cm²'], 'b = ' + (l + b) + ' − ' + l + ' = ' + b + '; area = ' + l + '×' + b + ' = ' + l * b); }
    if (t === 1) { var k = r.int(1, h ? 8 : 5), rr = 7 * k, a = 22 * k * k * 7 / 7; a = 22 * rr * rr / 7; return Q(r, 'Mensuration', 'Find the area of a circle of radius ' + rr + ' cm. (π = 22/7)', rr + ' सेमी त्रिज्या वाले वृत्त का क्षेत्रफल ज्ञात कीजिए। (π = 22/7)', a + ' cm²', [(a + 14 * k) + ' cm²', (a - 22 * k) + ' cm²', (2 * 22 * rr / 7) + ' cm²', (a * 2) + ' cm²'], 'πr² = 22/7×' + rr + '² = ' + a); }
    if (t === 2) { var k2 = r.int(1, 3), r2 = 7 * k2, hgt = r.int(5, 20), v = 22 * r2 * r2 * hgt / 7; return Q(r, 'Mensuration', 'Find the volume of a cylinder with radius ' + r2 + ' cm and height ' + hgt + ' cm. (π = 22/7)', r2 + ' सेमी त्रिज्या और ' + hgt + ' सेमी ऊँचाई वाले बेलन का आयतन ज्ञात कीजिए। (π = 22/7)', v + ' cm³', [(v + 154) + ' cm³', (v - 154) + ' cm³', (v / 3) + ' cm³', (v * 2) + ' cm³'], 'πr²h = 22/7×' + r2 + '²×' + hgt + ' = ' + v); }
    if (t === 3) { var a3 = r.int(3, 15); return Q(r, 'Mensuration', 'Find the total surface area of a cube of side ' + a3 + ' cm.', a3 + ' सेमी भुजा वाले घन का कुल पृष्ठीय क्षेत्रफल ज्ञात कीजिए।', 6 * a3 * a3 + ' cm²', [4 * a3 * a3 + ' cm²', a3 * a3 * a3 + ' cm²', 12 * a3 + ' cm²', 8 * a3 * a3 + ' cm²'], '6a² = 6×' + a3 + '² = ' + 6 * a3 * a3); }
    if (t === 4) { var tr = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), m = r.int(1, 4), A = tr[0] * m, B = tr[1] * m, C = tr[2] * m; return Q(r, 'Mensuration', 'The two shorter sides of a right-angled triangle are ' + A + ' cm and ' + B + ' cm. What is the length of the hypotenuse?', 'एक समकोण त्रिभुज की दो छोटी भुजाएँ ' + A + ' सेमी और ' + B + ' सेमी हैं। कर्ण की लंबाई क्या है?', C + ' cm', [(C + 1) + ' cm', (C - 1) + ' cm', (A + B) + ' cm', (C + 2) + ' cm'], '√(' + A + '² + ' + B + '²) = √' + (A * A + B * B) + ' = ' + C); }
    var l5 = r.int(5, 20), b5 = r.int(4, 15), h5 = r.int(3, 12); return Q(r, 'Mensuration', 'Find the volume of a cuboid of dimensions ' + l5 + ' cm × ' + b5 + ' cm × ' + h5 + ' cm.', l5 + ' सेमी × ' + b5 + ' सेमी × ' + h5 + ' सेमी माप वाले घनाभ का आयतन ज्ञात कीजिए।', l5 * b5 * h5 + ' cm³', [(l5 * b5 * h5 + l5 * b5) + ' cm³', (l5 * b5 * h5 - h5 * 10) + ' cm³', 2 * (l5 * b5 + b5 * h5 + l5 * h5) + ' cm³', (l5 + b5 + h5) + ' cm³'], 'V = l×b×h = ' + l5 * b5 * h5);
  };
  M.algebra = function (r, h) {
    var t = r.int(0, 4);
    if (t === 0) { var k = r.int(2, h ? 9 : 6); return Q(r, 'Algebra', 'If x + 1/x = ' + k + ', find the value of x² + 1/x².', 'यदि x + 1/x = ' + k + ' है, तो x² + 1/x² का मान ज्ञात कीजिए।', k * k - 2, [k * k + 2, k * k, k * k - 1, 2 * k], '(x+1/x)² = x² + 1/x² + 2 ⇒ ' + k * k + ' − 2 = ' + (k * k - 2)); }
    if (t === 1) { var s = r.int(5, 15), p = r.int(2, 30); return Q(r, 'Algebra', 'If a + b = ' + s + ' and ab = ' + p + ', find a² + b².', 'यदि a + b = ' + s + ' और ab = ' + p + ' है, तो a² + b² ज्ञात कीजिए।', s * s - 2 * p, [s * s - p, s * s + 2 * p, s * s, s * s - 3 * p], 'a²+b² = (a+b)² − 2ab = ' + s * s + ' − ' + 2 * p); }
    if (t === 2) { var x = r.int(2, 15), a = r.int(2, 9), b = r.int(1, 20), c = a * x + b; return Q(r, 'Algebra', 'Solve for x: ' + a + 'x + ' + b + ' = ' + c, 'x का मान ज्ञात कीजिए: ' + a + 'x + ' + b + ' = ' + c, x, [x + 1, x - 1, x + 2, x * 2], 'x = (' + c + ' − ' + b + ')/' + a + ' = ' + x); }
    if (t === 3) { var s2 = r.int(3, 9), p2 = r.int(1, 12), ans = s2 * s2 * s2 - 3 * p2 * s2; return Q(r, 'Algebra', 'If a + b = ' + s2 + ' and ab = ' + p2 + ', find a³ + b³.', 'यदि a + b = ' + s2 + ' और ab = ' + p2 + ' है, तो a³ + b³ ज्ञात कीजिए।', ans, [ans + 3 * p2, ans - s2, s2 * s2 * s2, ans + s2 * p2], 'a³+b³ = (a+b)³ − 3ab(a+b) = ' + s2 * s2 * s2 + ' − ' + 3 * p2 * s2 + ' = ' + ans); }
    var d = r.int(1, 6), pp = r.int(2, 20), ans2 = d * d + 2 * pp; return Q(r, 'Algebra', 'If a − b = ' + d + ' and ab = ' + pp + ', find a² + b².', 'यदि a − b = ' + d + ' और ab = ' + pp + ' है, तो a² + b² ज्ञात कीजिए।', ans2, [d * d - 2 * pp > 0 ? d * d - 2 * pp : d * d + pp, ans2 + 4, ans2 - 2, d * d + pp], 'a²+b² = (a−b)² + 2ab = ' + d * d + ' + ' + 2 * pp);
  };
  M.quadratic = function (r) {
    var a = r.int(2, 9), b = r.int(1, 9), s = a + b, p = a * b, ans = s * s - 2 * p;
    return Q(r, 'Algebra', 'If α and β are the roots of x² − ' + s + 'x + ' + p + ' = 0, find α² + β².', 'यदि α और β समीकरण x² − ' + s + 'x + ' + p + ' = 0 के मूल हैं, तो α² + β² ज्ञात कीजिए।', ans, [ans + 2 * p, s * s, ans - p, ans + 4], 'α+β = ' + s + ', αβ = ' + p + '; α²+β² = ' + s * s + ' − ' + 2 * p + ' = ' + ans);
  };
  M.geometry = function (r) {
    var t = r.int(0, 4);
    if (t === 0) { var rt = r.pick([[2, 3, 4], [1, 2, 3], [3, 4, 5], [5, 6, 7], [2, 5, 11]]), sm = rt[0] + rt[1] + rt[2], k = 180 / sm, ans = rt[2] * k; return Q(r, 'Geometry', 'The angles of a triangle are in the ratio ' + rt.join(' : ') + '. Find the largest angle.', 'एक त्रिभुज के कोण ' + rt.join(' : ') + ' के अनुपात में हैं। सबसे बड़ा कोण ज्ञात कीजिए।', fmt(ans) + '°', [fmt(ans + 10) + '°', fmt(ans - 10) + '°', fmt(rt[1] * k) + '°', fmt(ans + 20) + '°'], 'Sum 180° ⇒ one part = ' + fmt(k) + '°; largest = ' + rt[2] + '×' + fmt(k) + ' = ' + fmt(ans)); }
    if (t === 1) { var n = r.pick([5, 6, 8, 9, 10, 12]), ans1 = (n - 2) * 180 / n; return Q(r, 'Geometry', 'What is each interior angle of a regular polygon with ' + n + ' sides?', n + ' भुजाओं वाले समबहुभुज का प्रत्येक आंतरिक कोण कितना होता है?', fmt(ans1) + '°', [fmt(ans1 + 12) + '°', fmt(ans1 - 12) + '°', fmt(360 / n) + '°', fmt(ans1 + 6) + '°'], '(n−2)×180/n = ' + fmt(ans1)); }
    if (t === 2) { var e = r.pick([30, 40, 45, 60, 72, 24, 20, 36]), ns = 360 / e; return Q(r, 'Geometry', 'Each exterior angle of a regular polygon is ' + e + '°. How many sides does it have?', 'एक समबहुभुज का प्रत्येक बाह्य कोण ' + e + '° है। उसकी कितनी भुजाएँ हैं?', ns, [ns + 1, ns - 1, ns + 2, ns * 2], 'Sides = 360/exterior angle = ' + ns); }
    if (t === 3) { var A = r.int(3, 17) * 5; return Q(r, 'Geometry', 'In triangle ABC, ∠A = ' + A + '°. If I is the incentre, find ∠BIC.', 'त्रिभुज ABC में ∠A = ' + A + '° है। यदि I अंतःकेंद्र है, तो ∠BIC ज्ञात कीजिए।', fmt(90 + A / 2) + '°', [fmt(90 + A) + '°', fmt(180 - A) + '°', fmt(2 * A) + '°', fmt(90 - A / 2) + '°'], '∠BIC = 90° + A/2 = ' + fmt(90 + A / 2)); }
    var ang = r.int(2, 17) * 5; return Q(r, 'Geometry', 'An arc subtends an angle of ' + ang + '° at the circumference of a circle. What angle does it subtend at the centre?', 'एक चाप वृत्त की परिधि पर ' + ang + '° का कोण बनाता है। यह केंद्र पर कितना कोण बनाएगा?', 2 * ang + '°', [ang / 2 + '°', 180 - ang + '°', ang + '°', 360 - ang + '°'], 'Angle at centre = 2 × angle at circumference = ' + 2 * ang);
  };
  var TV = [['sin 30°', .5], ['cos 60°', .5], ['sin 90°', 1], ['cos 0°', 1], ['tan 45°', 1], ['cot 45°', 1], ['sec 60°', 2], ['cosec 30°', 2], ['cos 90°', 0], ['sin 0°', 0]];
  M.trig = function (r, h) {
    var t = r.int(0, 2);
    if (t === 0) { var a = r.pick(TV), b = r.pick(TV), c = r.pick(TV), k1 = r.int(1, 4), k2 = r.int(1, 4), ans = k1 * a[1] + k2 * b[1] - c[1]; return Q(r, 'Trigonometry', 'Find the value of ' + k1 + '·' + a[0] + ' + ' + k2 + '·' + b[0] + ' − ' + c[0], 'मान ज्ञात कीजिए: ' + k1 + '·' + a[0] + ' + ' + k2 + '·' + b[0] + ' − ' + c[0], fmt(ans), [fmt(ans + 1), fmt(ans - 1), fmt(ans + .5), fmt(ans + 2)], 'sin30=cos60=1/2, sin90=cos0=tan45=cot45=1, sec60=cosec30=2, cos90=sin0=0 ⇒ ' + fmt(ans)); }
    if (t === 1) { var d = r.int(5, 40) * 10; return Q(r, 'Height & Distance', 'The angle of elevation of the top of a tower from a point ' + d + ' m from its base is 45°. Find the height of the tower.', 'मीनार के आधार से ' + d + ' मी दूर एक बिंदु से उसके शीर्ष का उन्नयन कोण 45° है। मीनार की ऊँचाई ज्ञात कीजिए।', d + ' m', [d * 2 + ' m', Math.round(d / 2) + ' m', d + 10 + ' m', Math.round(d * 1.7) + ' m'], 'tan45° = h/d = 1 ⇒ h = ' + d); }
    var d2 = r.int(3, 30) * 10; return Q(r, 'Height & Distance', 'The angle of elevation of the top of a tower from a point ' + d2 + ' m from its foot is 60°. Find the height (√3 = 1.73).', 'मीनार के पाद से ' + d2 + ' मी दूर एक बिंदु से शीर्ष का उन्नयन कोण 60° है। ऊँचाई ज्ञात कीजिए (√3 = 1.73)।', fmt(d2 * 1.73) + ' m', [fmt(d2 / 1.73) + ' m', fmt(d2) + ' m', fmt(d2 * 2) + ' m', fmt(d2 * 1.41) + ' m'], 'tan60° = √3 = h/d ⇒ h = ' + d2 + '√3 = ' + fmt(d2 * 1.73));
  };
  M.mixture = function (r) {
    var p = r.int(20, 60) * 2, q = p + r.int(2, 8) * 10, m = r.int(1, 4), n = r.int(1, 4) + (m === 1 ? 1 : 0); var cost = (m * p + n * q) / (m + n);
    if (cost % 1 !== 0) { n = m; cost = (p + q) / 2; }
    return Q(r, 'Mixture & Alligation', 'Rice at ₹' + p + '/kg and ₹' + q + '/kg is mixed in the ratio ' + m + ' : ' + n + '. What is the cost of the mixture per kg?', '₹' + p + '/किग्रा और ₹' + q + '/किग्रा वाले चावल को ' + m + ' : ' + n + ' के अनुपात में मिलाया गया। मिश्रण का मूल्य प्रति किग्रा क्या होगा?', '₹' + fmt(cost), ['₹' + fmt(cost + 2), '₹' + fmt(cost - 2), '₹' + fmt((p + q) / 2 + 1), '₹' + fmt(cost + 5)], 'Mean price = (' + m + '×' + p + ' + ' + n + '×' + q + ')/' + (m + n) + ' = ' + fmt(cost));
  };
  M.partnership = function (r) {
    var X = r.pick([2000, 3000, 4000, 5000, 6000]), Y = r.pick([3000, 4000, 5000, 8000]), t1 = r.pick([6, 12]), t2 = r.pick([4, 6, 8]), a = X * t1, b = Y * t2, g = gcd(a, b), sa = a / g, sb = b / g, k = r.int(2, 9) * 100, P = (sa + sb) * k, ans = sa * k;
    return Q(r, 'Mixture & Alligation', 'A invests ₹' + X + ' for ' + t1 + ' months and B invests ₹' + Y + ' for ' + t2 + ' months. If the total profit is ₹' + P + ', what is A’s share?', 'A ने ₹' + X + ' ' + t1 + ' माह के लिए और B ने ₹' + Y + ' ' + t2 + ' माह के लिए लगाए। कुल लाभ ₹' + P + ' हो तो A का हिस्सा क्या है?', '₹' + ans, ['₹' + sb * k, '₹' + (ans + k), '₹' + (ans - k), '₹' + P / 2], 'Profit ratio = ' + a + ' : ' + b + ' = ' + sa + ' : ' + sb + '; A = ' + sa + '/' + (sa + sb) + '×' + P + ' = ' + ans);
  };
  M.ages = function (r) {
    var k = r.int(2, 5), son = r.int(6, 20), S = son * (k + 1);
    return Q(r, 'Algebra', 'The sum of the ages of a father and his son is ' + S + ' years. The father is ' + k + ' times as old as the son. What is the son’s age?', 'पिता और पुत्र की आयु का योग ' + S + ' वर्ष है। पिता की आयु पुत्र की आयु की ' + k + ' गुनी है। पुत्र की आयु क्या है?', son + ' years', [(son + 2) + ' years', (son - 2) + ' years', (son + 5) + ' years', (son * k) + ' years'], 'Son + ' + k + '×Son = ' + S + ' ⇒ Son = ' + S + '/' + (k + 1) + ' = ' + son);
  };
  M.successive = function (r) {
    var C = r.int(5, 40) * 100, mk = r.pick([20, 25, 30, 40, 50]), d = r.pick([10, 20]), SP = C * (100 + mk) / 100 * (100 - d) / 100, pl = (SP - C) / C * 100;
    var ans = (pl >= 0 ? fmt(pl) + '% profit' : fmt(-pl) + '% loss');
    return Q(r, 'Profit & Loss', 'A trader marks his goods ' + mk + '% above cost price and allows a discount of ' + d + '%. What is his gain or loss percent?', 'एक व्यापारी वस्तु का अंकित मूल्य क्रय मूल्य से ' + mk + '% ऊपर रखता है और ' + d + '% छूट देता है। उसका लाभ या हानि प्रतिशत क्या है?', ans, [(pl >= 0 ? fmt(pl + 4) + '% profit' : fmt(-pl + 4) + '% loss'), fmt(Math.abs(mk - d)) + '% profit', fmt(Math.abs(pl) + 2) + '% ' + (pl >= 0 ? 'loss' : 'profit'), fmt(Math.abs(pl) + 8) + '% profit'], 'Let CP = 100: MP = ' + (100 + mk) + ', SP = ' + fmt(SP / C * 100) + ' ⇒ ' + ans);
  };
  M.heron = function (r) {
    var t = r.pick([[13, 14, 15, 84], [5, 12, 13, 30], [7, 24, 25, 84], [9, 10, 17, 36], [10, 17, 21, 84], [8, 15, 17, 60]]);
    return Q(r, 'Mensuration', 'Find the area of a triangle with sides ' + t[0] + ' cm, ' + t[1] + ' cm and ' + t[2] + ' cm.', t[0] + ' सेमी, ' + t[1] + ' सेमी और ' + t[2] + ' सेमी भुजाओं वाले त्रिभुज का क्षेत्रफल ज्ञात कीजिए।', t[3] + ' cm²', [(t[3] + 6) + ' cm²', (t[3] - 6) + ' cm²', (t[3] + 12) + ' cm²', (t[3] * 2) + ' cm²'], 'Heron’s formula: s = ' + (t[0] + t[1] + t[2]) / 2 + ', Area = √[s(s−a)(s−b)(s−c)] = ' + t[3]);
  };
  M.calcShortcut = function (r) {
    var a = r.int(11, 49), t = r.int(0, 2);
    if (t === 0) return Q(r, 'Simplification', 'Find the value of ' + a + '².', a + '² का मान ज्ञात कीजिए।', a * a, [a * a + 10, a * a - 11, a * a + a, a * a - a], a + '×' + a + ' = ' + a * a);
    if (t === 1) { var b = a + 2; return Q(r, 'Simplification', 'Find the value of ' + b + ' × ' + a + '.', b + ' × ' + a + ' का मान ज्ञात कीजिए।', a * b, [a * b + 2, a * b - 2, a * b + 10, a * b - a], '(' + (a + 1) + ')² − 1 = ' + a * b); }
    var f = r.pick([2, 4, 5, 8]), fr = { 2: '1/2', 4: '1/4', 5: '1/5', 8: '1/8' }[f], n = f * r.int(5, 40); return Q(r, 'Simplification', 'What is ' + fr + ' of ' + n + '?', n + ' का ' + fr + ' कितना होगा?', n / f, [n / f + f, n / f - 1, n / f * 2, n / f + 3], n + '÷' + f + ' = ' + n / f);
  };
  G.maths = {
    t1: [[M.pctOf, 3], [M.whatPct, 2], [M.pctChange, 2], [M.population, 1], [M.ratioDivide, 2], [M.ratioChain, 1], [M.profit, 3], [M.discount, 2], [M.si, 2], [M.ci2, 2], [M.ciSi, 1], [M.timeWork, 2], [M.timeWork2, 1], [M.pipes, 1], [M.speedConv, 1], [M.trainPole, 1], [M.trainPlatform, 1], [M.avgSpeed, 2], [M.boat, 1], [M.average, 2], [M.average2, 1], [M.lcmhcf, 2], [M.remainder, 1], [M.unitDigit, 1], [M.simplify, 2], [M.sqroot, 1], [M.mensuration, 3], [M.algebra, 3], [M.geometry, 3], [M.trig, 2], [M.ages, 1], [M.mixture, 1], [M.calcShortcut, 1]],
    t2: [[M.pctOf, 2], [M.pctChange, 2], [M.population, 1], [M.ratioDivide, 1], [M.ratioChain, 1], [M.profit, 2], [M.discount, 1], [M.successive, 3], [M.ci2, 1], [M.ci3, 2], [M.ciSi, 1], [M.timeWork2, 2], [M.pipes, 1], [M.trainPlatform, 2], [M.relSpeed, 2], [M.avgSpeed, 1], [M.boat, 2], [M.average, 1], [M.lcmhcf, 2], [M.remainder, 2], [M.unitDigit, 2], [M.mensuration, 3], [M.heron, 2], [M.algebra, 4], [M.quadratic, 2], [M.geometry, 3], [M.trig, 4], [M.mixture, 2], [M.partnership, 2], [M.ages, 1]]
  };

  /* ---------- Statistics (Tier-II) ---------- */
  var S = {};
  function dataset(r, n, lo, hi) { var a = []; for (var i = 0; i < n; i++) a.push(r.int(lo, hi)); return a; }
  S.mean = function (r) {
    var n = r.int(5, 8), m = r.int(10, 40), dv = []; for (var i = 0; i < n - 1; i++) dv.push(r.int(-6, 6)); var s = dv.reduce(function (a, b) { return a + b; }, 0); dv.push(-s);
    var data = dv.map(function (d) { return m + d; });
    return Q(r, 'Mean, Median, Mode', 'Find the arithmetic mean of: ' + data.join(', '), 'समांतर माध्य ज्ञात कीजिए: ' + data.join(', '), m, [m + 1, m - 1, m + 2, m - 2], 'Sum = ' + n * m + '; mean = ' + n * m + '/' + n + ' = ' + m);
  };
  S.median = function (r) {
    var n = r.pick([5, 7, 9]), d = r.shuffle(dataset(r, n, 3, 60)), s = d.slice().sort(function (a, b) { return a - b; }), med = s[(n - 1) / 2];
    return Q(r, 'Mean, Median, Mode', 'Find the median of: ' + d.join(', '), 'माध्यिका ज्ञात कीजिए: ' + d.join(', '), med, [s[(n - 1) / 2 + 1], s[(n - 1) / 2 - 1], Math.round(d.reduce(function (a, b) { return a + b; }, 0) / n), s[n - 1]], 'Arrange: ' + s.join(', ') + ' ⇒ middle value = ' + med);
  };
  S.mode = function (r) {
    var base = [], m = r.int(5, 30); for (var i = 0; i < 6; i++) base.push(r.int(1, 40)); base = base.filter(function (x) { return x !== m; }); var d = base.concat([m, m, m]);
    d = r.shuffle(d); return Q(r, 'Mean, Median, Mode', 'Find the mode of: ' + d.join(', '), 'बहुलक ज्ञात कीजिए: ' + d.join(', '), m, [m + 1, m - 1, base[0] === m ? m + 2 : base[0], Math.max.apply(null, d) === m ? m + 3 : Math.max.apply(null, d)], m + ' appears most often (3 times).');
  };
  S.variance = function (r) {
    var m = r.int(8, 30), pats = [[-2, -1, 0, 1, 2], [-3, -1, 0, 1, 3], [-4, -2, 0, 2, 4]], p = r.pick(pats), data = p.map(function (d) { return m + d; }), v = p.reduce(function (a, d) { return a + d * d; }, 0) / 5;
    return Q(r, 'Dispersion (SD, variance)', 'Find the variance of: ' + r.shuffle(data).join(', '), 'प्रसरण (variance) ज्ञात कीजिए: ' + r.shuffle(data).join(', '), fmt(v), [fmt(v + 2), fmt(v - 1), fmt(Math.sqrt(v)), fmt(v * 2)], 'Mean = ' + m + '; Σ(x−mean)² = ' + v * 5 + '; variance = ' + v * 5 + '/5 = ' + fmt(v));
  };
  S.cv = function (r) {
    var sd = r.int(2, 9), mean = sd * r.pick([4, 5, 10, 20]), cvv = sd / mean * 100;
    return Q(r, 'Dispersion (SD, variance)', 'If the mean of a data set is ' + mean + ' and its standard deviation is ' + sd + ', the coefficient of variation is:', 'यदि किसी आँकड़े का माध्य ' + mean + ' तथा मानक विचलन ' + sd + ' है, तो विचरण गुणांक है:', fmt(cvv) + '%', [fmt(cvv * 2) + '%', fmt(cvv + 5) + '%', fmt(mean / sd) + '%', fmt(cvv / 2) + '%'], 'CV = (SD/Mean)×100 = ' + fmt(cvv) + '%');
  };
  S.probDice = function (r) {
    var bank = [['the sum of two dice is 7', '1/6', ['1/12', '1/9', '5/36'], '6 of 36 outcomes'], ['the sum of two dice is 8', '5/36', ['1/6', '1/9', '1/12'], '5 of 36 outcomes'], ['both dice show the same number', '1/6', ['1/36', '1/12', '1/3'], '6 of 36 outcomes'], ['the sum of two dice is at least 11', '1/12', ['1/6', '1/18', '1/9'], '3 of 36 outcomes'], ['a single die shows a prime number', '1/2', ['1/3', '2/3', '1/6'], '2, 3, 5 out of 6']];
    var b = r.pick(bank); return Q(r, 'Probability', 'Find the probability that ' + b[0] + '.', 'प्रायिकता ज्ञात कीजिए कि ' + ({ 'the sum of two dice is 7': 'दो पासों का योग 7 है', 'the sum of two dice is 8': 'दो पासों का योग 8 है', 'both dice show the same number': 'दोनों पासों पर समान संख्या आती है', 'the sum of two dice is at least 11': 'दो पासों का योग कम से कम 11 है', 'a single die shows a prime number': 'एक पासे पर अभाज्य संख्या आती है' }[b[0]]) + '।', b[1], b[2], b[3]);
  };
  S.probCoin = function (r) {
    var n = r.int(2, 4), tot = Math.pow(2, n);
    return Q(r, 'Probability', 'A fair coin is tossed ' + n + ' times. What is the probability of getting at least one head?', 'एक सिक्के को ' + n + ' बार उछाला जाता है। कम से कम एक चित आने की प्रायिकता क्या है?', (tot - 1) + '/' + tot, ['1/' + tot, (tot / 2) + '/' + tot, (tot - 2) + '/' + tot], '1 − (1/2)^' + n + ' = ' + (tot - 1) + '/' + tot);
  };
  S.weighted = function (r) {
    var a = r.int(10, 40), b = a + r.int(5, 30), x = r.int(2, 5), y = r.int(2, 5), m = (a * x + b * y) / (x + y);
    return Q(r, 'Mean, Median, Mode', 'The mean marks of ' + x + ' students is ' + a + ' and of ' + y + ' students is ' + b + '. Find the combined mean.', x + ' विद्यार्थियों का माध्य अंक ' + a + ' तथा ' + y + ' विद्यार्थियों का ' + b + ' है। संयुक्त माध्य ज्ञात कीजिए।', fmt(m), [fmt(m + 2), fmt(m - 2), fmt((a + b) / 2 + (x === y ? 1 : 0)), fmt(m + 4)], '(' + x + '×' + a + ' + ' + y + '×' + b + ')/' + (x + y) + ' = ' + fmt(m));
  };
  S.range = function (r) {
    var d = dataset(r, 7, 5, 80), mx = Math.max.apply(null, d), mn = Math.min.apply(null, d);
    return Q(r, 'Dispersion (SD, variance)', 'Find the range of the data: ' + d.join(', '), 'आँकड़ों का परास (range) ज्ञात कीजिए: ' + d.join(', '), mx - mn, [mx - mn + 3, mx - mn - 2, mx, mx + mn], 'Range = max − min = ' + mx + ' − ' + mn);
  };
  S.concept = function (r) {
    var B = PT.STATS_CONCEPTS || [], c = r.pick(B); if (!c) return S.mean(r);
    var o = r.shuffle(c.o.map(function (x, i) { return { x: x, i: i }; })), a = 0; o.forEach(function (z, k) { if (z.i === 0) a = k; });
    return { t: c.t, q: c.q, o: o.map(function (z) { return z.x; }), a: a, e: c.e || ['', ''] };
  };
  G.stats = { t1: [[S.mean, 3], [S.median, 2], [S.mode, 2], [S.variance, 2], [S.cv, 1], [S.probDice, 2], [S.probCoin, 1], [S.weighted, 2], [S.range, 1], [S.concept, 6]] };
  G.stats.t2 = G.stats.t1;
})();
