/* Question generators — Reasoning (bilingual) */
(function () {
  var PT = window.PT = window.PT || {};
  var G = PT.GEN = PT.GEN || {};
  var fmt = function (n) { return PT.fmtNum(n); };
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function Q(r, t, en, hi, ans, wr, ee, eh) { return PT.mkQ(r, t, en, hi, ans, wr, ee, eh); }
  /* options as [en,hi] pairs */
  function QP(r, t, en, hi, cor, wrongs, ee, eh) {
    var set = [cor], seen = { }; seen[cor[0]] = 1;
    wrongs.forEach(function (w) { if (!seen[w[0]]) { seen[w[0]] = 1; set.push(w); } });
    set = set.slice(0, 4); var sh = r.shuffle(set), a = 0; sh.forEach(function (x, i) { if (x === cor) a = i; });
    return { t: t, q: [en, hi], o: sh, a: a, e: [ee || '', eh || ee || ''] };
  }
  PT.mkQP = QP;
  function L(i) { return A.charAt(((i % 26) + 26) % 26); }
  var R = {};
  R.numSeries = function (r, h) {
    var t = r.int(0, h ? 8 : 6), s = [], ans, rule = '', hr = '';
    var a = r.int(2, 20), d = r.int(2, 9);
    if (t === 0) { for (var i = 0; i < 6; i++) s.push(a + d * i); rule = 'Add ' + d + ' each time'; hr = 'हर बार ' + d + ' जोड़ें'; }
    else if (t === 1) { var m = r.pick([2, 3]), b = r.int(1, 5); for (i = 0; i < 6; i++) s.push(b * Math.pow(m, i)); rule = 'Multiply by ' + m + ' each time'; hr = 'हर बार ' + m + ' से गुणा करें'; }
    else if (t === 2) { var n0 = r.int(2, 9); for (i = 0; i < 6; i++) s.push((n0 + i) * (n0 + i)); rule = 'Squares of consecutive numbers (' + n0 + '², ' + (n0 + 1) + '², …)'; hr = 'क्रमागत संख्याओं के वर्ग'; }
    else if (t === 3) { n0 = r.int(2, 7); for (i = 0; i < 6; i++) s.push(Math.pow(n0 + i, 3)); rule = 'Cubes of consecutive numbers'; hr = 'क्रमागत संख्याओं के घन'; }
    else if (t === 4) { var d0 = r.int(1, 4); s.push(a); for (i = 1; i < 6; i++) s.push(s[i - 1] + d0 * (i + 1)); rule = 'Differences increase: +' + d0 * 2 + ', +' + d0 * 3 + ', +' + d0 * 4 + ' …'; hr = 'अंतर बढ़ता जाता है: +' + d0 * 2 + ', +' + d0 * 3 + ', +' + d0 * 4 + ' …'; }
    else if (t === 5) { var p = r.int(2, 9), q = r.int(2, 9); s.push(a); for (i = 1; i < 6; i++) s.push(s[i - 1] + (i % 2 ? p : q)); rule = 'Alternately add ' + p + ' and ' + q; hr = 'बारी-बारी से ' + p + ' और ' + q + ' जोड़ें'; }
    else if (t === 6) { var pr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43], st = r.int(0, 6); s = pr.slice(st, st + 6); rule = 'Consecutive prime numbers'; hr = 'क्रमागत अभाज्य संख्याएँ'; }
    else if (t === 7) { var k = r.int(2, 4), c = r.int(1, 5); s.push(r.int(1, 4)); for (i = 1; i < 6; i++) s.push(s[i - 1] * k + c); rule = 'Multiply by ' + k + ' and add ' + c; hr = k + ' से गुणा करके ' + c + ' जोड़ें'; }
    else { var n1 = r.int(2, 9); for (i = 0; i < 6; i++) s.push((n1 + i) * (n1 + i) + (n1 + i)); rule = 'n² + n for consecutive n'; hr = 'क्रमागत n के लिए n² + n'; }
    ans = s[5]; var shown = s.slice(0, 5).join(', ') + ', ?';
    return Q(r, 'Number & Alphabet Series', 'Find the next number in the series: ' + shown, 'श्रृंखला में अगली संख्या ज्ञात कीजिए: ' + shown, ans, [ans + 2, ans - 3, ans + r.int(4, 9), ans + 10, ans - 5], rule, hr);
  };
  R.alphaSeries = function (r, h) {
    var st = r.int(0, 8), step = r.int(2, 4), s = []; for (var i = 0; i < 5; i++) s.push(L(st + step * i));
    if (h && r.int(0, 1)) { var s2 = [], a1 = r.int(1, 3), b1 = r.int(2, 4); for (i = 0; i < 6; i++) s2.push(L(st + (i % 2 ? b1 : a1) + Math.floor(i / 2) * (a1 + b1))); var an = s2[5]; return Q(r, 'Number & Alphabet Series', 'Complete the series: ' + s2.slice(0, 5).join(', ') + ', ?', 'श्रृंखला पूरी कीजिए: ' + s2.slice(0, 5).join(', ') + ', ?', an, [L(A.indexOf(an) + 1), L(A.indexOf(an) - 1), L(A.indexOf(an) + 2), L(A.indexOf(an) + 3)], 'Alternate gaps of ' + a1 + ' and ' + b1 + ' letters', 'अक्षरों के बीच बारी-बारी से ' + a1 + ' और ' + b1 + ' का अंतर'); }
    var ans = L(st + step * 5);
    return Q(r, 'Number & Alphabet Series', 'Find the next letter: ' + s.join(', ') + ', ?', 'अगला अक्षर ज्ञात कीजिए: ' + s.join(', ') + ', ?', ans, [L(st + step * 5 + 1), L(st + step * 5 - 1), L(st + step * 6), L(st + step * 5 + 2)], 'Each letter moves ' + step + ' places ahead', 'प्रत्येक अक्षर ' + step + ' स्थान आगे बढ़ता है');
  };
  var WORDS = ['CAT', 'DOG', 'BOOK', 'PEN', 'TEST', 'EXAM', 'STUDY', 'RANK', 'PASS', 'MATH', 'LEARN', 'SMART', 'PLAN', 'GOAL', 'CHAIR', 'TABLE', 'NOTE', 'EARTH', 'BRAIN', 'POWER'];
  function shift(w, k) { return w.split('').map(function (c) { return L(A.indexOf(c) + k); }).join(''); }
  R.codeShift = function (r, h) {
    var w1 = r.pick(WORDS), w2 = r.pick(WORDS); while (w2 === w1) w2 = r.pick(WORDS); var k = r.pick([1, 2, 3, -1, -2, -3]); if (h) k = r.pick([2, 3, 4, -2, -3, -4]);
    var ans = shift(w2, k);
    var wr = [shift(w2, k + 1), shift(w2, k - 1), shift(w2, -k), shift(w2, k + 2)];
    return Q(r, 'Coding–Decoding', 'In a certain code language, ' + w1 + ' is written as ' + shift(w1, k) + '. How will ' + w2 + ' be written in that code?', 'एक कूट भाषा में ' + w1 + ' को ' + shift(w1, k) + ' लिखा जाता है। उसी कूट में ' + w2 + ' कैसे लिखा जाएगा?', ans, wr, 'Each letter is shifted ' + (k > 0 ? k + ' place(s) forward' : (-k) + ' place(s) backward'), 'प्रत्येक अक्षर ' + (k > 0 ? k + ' स्थान आगे' : (-k) + ' स्थान पीछे') + ' खिसकाया गया है');
  };
  R.codeReverse = function (r) {
    var w = r.pick(WORDS), ans = w.split('').map(function (c) { return L(25 - A.indexOf(c)); }).join('');
    var wr = [w.split('').map(function (c) { return L(26 - A.indexOf(c)); }).join(''), shift(w, 1), w.split('').reverse().join('')];
    return Q(r, 'Coding–Decoding', 'If A = Z, B = Y, C = X and so on, how is ' + w + ' written in that code?', 'यदि A = Z, B = Y, C = X आदि हो, तो उस कूट में ' + w + ' कैसे लिखा जाएगा?', ans, wr, 'Opposite letter: position p ↔ 27 − p', 'विपरीत अक्षर: स्थान p ↔ 27 − p');
  };
  R.letterSum = function (r) {
    var w = r.pick(WORDS), sum = 0; w.split('').forEach(function (c) { sum += A.indexOf(c) + 1; });
    return Q(r, 'Coding–Decoding', 'If A = 1, B = 2, C = 3 … Z = 26, find the sum of the values of the letters in the word ' + w + '.', 'यदि A = 1, B = 2, C = 3 … Z = 26 हो, तो शब्द ' + w + ' के अक्षरों के मानों का योग ज्ञात कीजिए।', sum, [sum + 2, sum - 3, sum + 5, sum + 1], w.split('').map(function (c) { return A.indexOf(c) + 1; }).join(' + ') + ' = ' + sum);
  };
  R.analogyNum = function (r, h) {
    var f = r.pick([['n²', function (n) { return n * n; }, 'वर्ग'], ['n³', function (n) { return n * n * n; }, 'घन'], ['n² + 1', function (n) { return n * n + 1; }, 'n² + 1'], ['n² − 1', function (n) { return n * n - 1; }, 'n² − 1'], ['n(n+1)', function (n) { return n * (n + 1); }, 'n(n+1)'], ['2n + 3', function (n) { return 2 * n + 3; }, '2n + 3']]);
    var a = r.int(3, 9), b = r.int(3, 12); while (b === a) b = r.int(3, 12); var ans = f[1](b);
    return Q(r, 'Analogy', a + ' : ' + f[1](a) + ' :: ' + b + ' : ?', a + ' : ' + f[1](a) + ' :: ' + b + ' : ?', ans, [ans + b, ans - b, ans + 2, f[1](b + 1)], 'Rule: ' + f[0] + ' ⇒ ' + b + ' → ' + ans, 'नियम: ' + f[2] + ' ⇒ ' + b + ' → ' + ans);
  };
  R.analogyLetters = function (r) {
    var i = r.int(0, 8), j = i + r.int(1, 3);
    var ans = L(j + 2) + L(23 - (j + 2) + 0); // placeholder replaced below
    var p = r.int(0, 10), q = p + r.int(1, 2), a1 = L(p) + L(25 - p), a2 = L(q) + L(25 - q), c = L(q + 2) + L(25 - (q + 2));
    return Q(r, 'Analogy', a1 + ' : ' + a2 + ' :: ' + L(q + 1) + L(25 - (q + 1)) + ' : ?', a1 + ' : ' + a2 + ' :: ' + L(q + 1) + L(25 - (q + 1)) + ' : ?', L(q + 1 + (q - p)) + L(25 - (q + 1 + (q - p))), [L(q + 2 + (q - p)) + L(25 - (q + 2 + (q - p))), L(q + 1 + (q - p)) + L(25 - (q + (q - p))), L(q + 1) + L(25 - (q + 1 + (q - p)))], 'First letter moves ' + (q - p) + ' ahead, second letter moves ' + (q - p) + ' back', 'पहला अक्षर ' + (q - p) + ' आगे, दूसरा ' + (q - p) + ' पीछे');
  };
  var REL = [
    { n: ['works in', 'कार्यस्थल'], p: [['Doctor', 'Hospital', 'डॉक्टर', 'अस्पताल'], ['Teacher', 'School', 'शिक्षक', 'विद्यालय'], ['Judge', 'Court', 'न्यायाधीश', 'न्यायालय'], ['Farmer', 'Farm', 'किसान', 'खेत'], ['Scientist', 'Laboratory', 'वैज्ञानिक', 'प्रयोगशाला'], ['Chef', 'Kitchen', 'रसोइया', 'रसोई']] },
    { n: ['uses', 'औज़ार'], p: [['Carpenter', 'Saw', 'बढ़ई', 'आरी'], ['Painter', 'Brush', 'चित्रकार', 'ब्रश'], ['Writer', 'Pen', 'लेखक', 'कलम'], ['Barber', 'Scissors', 'नाई', 'कैंची'], ['Tailor', 'Needle', 'दर्ज़ी', 'सुई'], ['Farmer', 'Plough', 'किसान', 'हल']] },
    { n: ['young one of', 'शावक'], p: [['Cow', 'Calf', 'गाय', 'बछड़ा'], ['Dog', 'Puppy', 'कुत्ता', 'पिल्ला'], ['Horse', 'Foal', 'घोड़ा', 'बछेड़ा'], ['Sheep', 'Lamb', 'भेड़', 'मेमना'], ['Lion', 'Cub', 'शेर', 'शावक'], ['Cat', 'Kitten', 'बिल्ली', 'बिल्ली का बच्चा']] },
    { n: ['makes the sound', 'आवाज़'], p: [['Lion', 'Roar', 'शेर', 'दहाड़'], ['Dog', 'Bark', 'कुत्ता', 'भौंकना'], ['Horse', 'Neigh', 'घोड़ा', 'हिनहिनाना'], ['Elephant', 'Trumpet', 'हाथी', 'चिंघाड़'], ['Cow', 'Moo', 'गाय', 'रंभाना'], ['Snake', 'Hiss', 'साँप', 'फुफकार']] },
    { n: ['lives in', 'निवास'], p: [['Bird', 'Nest', 'पक्षी', 'घोंसला'], ['Bee', 'Hive', 'मधुमक्खी', 'छत्ता'], ['Lion', 'Den', 'शेर', 'माँद'], ['Spider', 'Web', 'मकड़ी', 'जाला'], ['Horse', 'Stable', 'घोड़ा', 'अस्तबल'], ['Fish', 'Water', 'मछली', 'जल']] },
    { n: ['measures', 'मापता है'], p: [['Thermometer', 'Temperature', 'थर्मामीटर', 'तापमान'], ['Barometer', 'Pressure', 'बैरोमीटर', 'वायुदाब'], ['Speedometer', 'Speed', 'स्पीडोमीटर', 'चाल'], ['Ammeter', 'Current', 'अमीटर', 'धारा'], ['Odometer', 'Distance', 'ओडोमीटर', 'दूरी'], ['Seismograph', 'Earthquake', 'सीस्मोग्राफ', 'भूकंप']] }
  ];
  R.analogyWord = function (r) {
    var g = r.pick(REL), ps = r.shuffle(g.p), p1 = ps[0], p2 = ps[1];
    var cor = [p2[1], p2[3]], wr = ps.slice(2, 5).map(function (x) { return [x[1], x[3]]; });
    return QP(r, 'Analogy', p1[0] + ' : ' + p1[1] + ' :: ' + p2[0] + ' : ?', p1[2] + ' : ' + p1[3] + ' :: ' + p2[2] + ' : ?', cor, wr, p1[0] + ' → ' + p1[1] + ' (' + g.n[0] + '); so ' + p2[0] + ' → ' + p2[1], p1[2] + ' → ' + p1[3] + ' (' + g.n[1] + '); अतः ' + p2[2] + ' → ' + p2[3]);
  };
  R.analogyCapital = function (r) {
    var T = PT.TABLES.countryCap, ps = r.shuffle(T), a = ps[0], b = ps[1];
    return QP(r, 'Analogy', a[0] + ' : ' + a[1] + ' :: ' + b[0] + ' : ?', a[2] + ' : ' + a[3] + ' :: ' + b[2] + ' : ?', [b[1], b[3]], [ps[2], ps[3], ps[4]].map(function (x) { return [x[1], x[3]]; }), 'Capital of ' + b[0] + ' is ' + b[1], b[2] + ' की राजधानी ' + b[3] + ' है');
  };
  R.oddNum = function (r, h) {
    var t = r.int(0, 3), nums, odd, rule, hr;
    if (t === 0) { var pr = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37], sh = r.shuffle(pr).slice(0, 3), comp = r.pick([9, 15, 21, 25, 27, 33, 35, 39, 49, 51]); nums = sh.concat([comp]); odd = comp; rule = 'All others are prime numbers'; hr = 'शेष सभी अभाज्य संख्याएँ हैं'; }
    else if (t === 1) { var base = r.shuffle([4, 6, 7, 8, 9, 11, 12, 13, 14, 15]).slice(0, 3).map(function (x) { return x * x; }), ns = r.pick([50, 60, 72, 80, 90, 150, 200]); nums = base.concat([ns]); odd = ns; rule = 'All others are perfect squares'; hr = 'शेष सभी पूर्ण वर्ग हैं'; }
    else if (t === 2) { var k = r.pick([3, 4, 6, 7, 9, 11]), mult = [r.int(2, 9) * k, r.int(10, 19) * k, r.int(20, 29) * k], x = r.int(10, 150); while (x % k === 0) x++; nums = mult.concat([x]); odd = x; rule = 'All others are multiples of ' + k; hr = 'शेष सभी ' + k + ' के गुणज हैं'; }
    else { var ev = [r.int(1, 30) * 2 + 1, r.int(31, 60) * 2 + 1, r.int(61, 90) * 2 + 1], e1 = r.int(5, 80) * 2; nums = ev.concat([e1]); odd = e1; rule = 'All others are odd numbers'; hr = 'शेष सभी विषम संख्याएँ हैं'; }
    var sh2 = r.shuffle(nums), a = sh2.indexOf(odd);
    return { t: 'Classification (Odd one out)', q: ['Find the odd one out: ' + sh2.join(', '), 'विषम को चुनिए: ' + sh2.join(', ')], o: sh2.map(String), a: a, e: [rule, hr] };
  };
  var BLOOD = [
    ['Pointing to a man, Ravi said, “His mother is the only daughter of my mother.” How is the man related to Ravi?', 'एक व्यक्ति की ओर इशारा करके रवि ने कहा, “उसकी माँ मेरी माँ की इकलौती पुत्री है।” वह व्यक्ति रवि का कौन है?', ['Nephew', 'भतीजा/भांजा'], [['Son', 'पुत्र'], ['Cousin', 'चचेरा भाई'], ['Brother', 'भाई']], 'Only daughter of my mother = my sister; her son = my nephew', 'मेरी माँ की इकलौती पुत्री = मेरी बहन; उसका पुत्र = भांजा'],
    ['A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?', 'A, B का भाई है। B, C की बहन है। C, D का पिता है। A, D का कौन है?', ['Uncle', 'चाचा/ताऊ'], [['Father', 'पिता'], ['Brother', 'भाई'], ['Grandfather', 'दादा']], 'A is brother of C (D’s father) ⇒ A is D’s uncle', 'A, D के पिता C का भाई है ⇒ चाचा/ताऊ'],
    ['Pointing to a lady, a man said, “She is the daughter of my grandfather’s only son.” How is the lady related to the man?', 'एक महिला की ओर इशारा करके एक व्यक्ति ने कहा, “वह मेरे दादा के इकलौते पुत्र की पुत्री है।” महिला उस व्यक्ति की कौन है?', ['Sister', 'बहन'], [['Cousin', 'चचेरी बहन'], ['Aunt', 'बुआ'], ['Niece', 'भतीजी']], 'Grandfather’s only son = my father; his daughter = my sister', 'दादा का इकलौता पुत्र = मेरे पिता; उनकी पुत्री = मेरी बहन'],
    ['If P is the mother of Q and Q is the sister of R, how is P related to R?', 'यदि P, Q की माँ है और Q, R की बहन है, तो P, R की कौन है?', ['Mother', 'माँ'], [['Aunt', 'मौसी'], ['Sister', 'बहन'], ['Grandmother', 'दादी']], 'Q and R are siblings, so P is the mother of R also', 'Q और R भाई-बहन हैं, अतः P, R की भी माँ है'],
    ['A is the son of B’s sister. B is a man. How is B related to A?', 'A, B की बहन का पुत्र है। B एक पुरुष है। B, A का कौन है?', ['Maternal uncle', 'मामा'], [['Father', 'पिता'], ['Paternal uncle', 'चाचा'], ['Grandfather', 'नाना']], 'B’s sister is A’s mother ⇒ B is A’s mother’s brother = maternal uncle', 'B की बहन A की माँ है ⇒ B = मामा'],
    ['Pointing to a photograph, a man said, “I have no brother or sister, but that man’s father is my father’s son.” Whose photograph is it?', 'एक फोटो की ओर इशारा करके एक व्यक्ति ने कहा, “मेरा कोई भाई-बहन नहीं है, पर उस व्यक्ति के पिता मेरे पिता के पुत्र हैं।” फोटो किसका है?', ['His son', 'उसका पुत्र'], [['Himself', 'स्वयं'], ['His father', 'उसके पिता'], ['His nephew', 'उसका भतीजा']], 'My father’s son = myself; so the man in the photo is my son', 'मेरे पिता का पुत्र = मैं स्वयं; अतः फोटो में मेरा पुत्र है'],
    ['A and B are brothers. C is B’s father. D is C’s father. E is D’s mother. How is A related to E?', 'A और B भाई हैं। C, B का पिता है। D, C का पिता है। E, D की माँ है। A, E का कौन है?', ['Great-grandson', 'परपोता'], [['Grandson', 'पोता'], ['Son', 'पुत्र'], ['Nephew', 'भतीजा']], 'E → D → C → A: A is three generations below E', 'E → D → C → A: A, E से तीन पीढ़ी नीचे है'],
    ['X is the father of Y. Y is the sister of Z. Z is the mother of W. How is X related to W?', 'X, Y का पिता है। Y, Z की बहन है। Z, W की माँ है। X, W का कौन है?', ['Grandfather', 'नाना'], [['Father', 'पिता'], ['Uncle', 'मामा'], ['Brother', 'भाई']], 'X is Z’s father; Z is W’s mother ⇒ X is W’s maternal grandfather', 'X, Z के पिता हैं; Z, W की माँ है ⇒ X = नाना'],
    ['“My mother’s mother’s only son” is my —', '“मेरी माँ की माँ का इकलौता पुत्र” मेरा क्या लगता है?', ['Maternal uncle', 'मामा'], [['Father', 'पिता'], ['Grandfather', 'नाना'], ['Cousin', 'ममेरा भाई']], 'Mother’s mother’s son = mother’s brother', 'माँ की माँ का पुत्र = माँ का भाई'],
    ['Rita’s mother is the sister of Mohan. How is Mohan related to Rita? (Mohan is a man)', 'रीता की माँ मोहन की बहन है। मोहन, रीता का कौन है? (मोहन पुरुष है)', ['Maternal uncle', 'मामा'], [['Father', 'पिता'], ['Brother', 'भाई'], ['Cousin', 'ममेरा भाई']], 'Mother’s brother = maternal uncle', 'माँ का भाई = मामा']
  ];
  R.blood = function (r) {
    var b = r.pick(BLOOD); return QP(r, 'Blood Relations', b[0], b[1], b[2], b[3], b[4], b[5]);
  };
  var DIRS = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'], DIRH = ['उत्तर', 'उत्तर-पूर्व', 'पूर्व', 'दक्षिण-पूर्व', 'दक्षिण', 'दक्षिण-पश्चिम', 'पश्चिम', 'उत्तर-पश्चिम'];
  R.direction = function (r, h) {
    var t = r.int(0, 2);
    if (t === 0) { var tr = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]), m = r.int(1, 3), a = tr[0] * m, b = tr[1] * m, c = tr[2] * m; return Q(r, 'Direction Sense', 'Ravi walks ' + a + ' km towards North, then turns right and walks ' + b + ' km. How far is he from the starting point?', 'रवि उत्तर की ओर ' + a + ' किमी चलता है, फिर दाएँ मुड़कर ' + b + ' किमी चलता है। वह प्रारंभिक बिंदु से कितनी दूर है?', c + ' km', [(a + b) + ' km', (c + 2) + ' km', (c - 1) + ' km', Math.abs(b - a) + ' km'], 'Distance = √(' + a + '² + ' + b + '²) = ' + c, 'दूरी = √(' + a + '² + ' + b + '²) = ' + c); }
    if (t === 1) { var s = r.int(0, 7), cw = r.int(1, 3) * 90, ccw = r.pick([45, 90, 135]), f = ((s * 45 + cw - ccw) % 360 + 360) % 360 / 45; var okS = DIRS[s]; return QP(r, 'Direction Sense', 'A man is facing ' + okS + '. He turns ' + cw + '° clockwise and then ' + ccw + '° anticlockwise. Which direction is he facing now?', 'एक व्यक्ति ' + DIRH[s] + ' की ओर मुँह करके खड़ा है। वह ' + cw + '° दक्षिणावर्त (घड़ी की दिशा में) और फिर ' + ccw + '° वामावर्त घूमता है। अब उसका मुँह किस दिशा में है?', [DIRS[f], DIRH[f]], [0, 1, 2, 3, 4, 5, 6, 7].filter(function (i) { return i !== f; }).slice(0, 7).sort(function () { return r() - .5; }).slice(0, 3).map(function (i) { return [DIRS[i], DIRH[i]]; }), 'Net turn = ' + cw + '° − ' + ccw + '° = ' + (cw - ccw) + '° clockwise from ' + okS, 'कुल घूर्णन = ' + (cw - ccw) + '° दक्षिणावर्त'); }
    var a2 = r.int(3, 12), b2 = r.int(2, 9); return QP(r, 'Direction Sense', 'A man walks ' + a2 + ' km North, turns right and walks ' + b2 + ' km, then turns right again and walks ' + a2 + ' km. In which direction is he from the starting point?', 'एक व्यक्ति उत्तर में ' + a2 + ' किमी चलता है, दाएँ मुड़कर ' + b2 + ' किमी चलता है, फिर दाएँ मुड़कर ' + a2 + ' किमी चलता है। वह प्रारंभिक बिंदु से किस दिशा में है?', ['East', 'पूर्व'], [['West', 'पश्चिम'], ['North', 'उत्तर'], ['South', 'दक्षिण']], 'North, East, then South: the north–south movement cancels, leaving ' + b2 + ' km East', 'उत्तर, पूर्व, फिर दक्षिण: उत्तर-दक्षिण गति कट जाती है, ' + b2 + ' किमी पूर्व शेष');
  };
  R.ranking = function (r) {
    var t = r.int(0, 2), n = r.int(30, 60), a = r.int(5, n - 5);
    if (t === 0) return Q(r, 'Ranking & Order', 'In a class of ' + n + ' students, Amit’s rank is ' + a + 'th from the top. What is his rank from the bottom?', n + ' विद्यार्थियों की कक्षा में अमित का स्थान ऊपर से ' + a + 'वाँ है। नीचे से उसका स्थान क्या है?', n - a + 1, [n - a, n - a + 2, n - a - 1, n + a - 1], 'Rank from bottom = total − rank from top + 1 = ' + n + ' − ' + a + ' + 1 = ' + (n - a + 1));
    if (t === 1) { var x = r.int(5, 20), y = r.int(5, 20); return Q(r, 'Ranking & Order', 'In a row, Sita is ' + x + 'th from the left and ' + y + 'th from the right. How many persons are there in the row?', 'एक पंक्ति में सीता बाएँ से ' + x + 'वीं और दाएँ से ' + y + 'वीं है। पंक्ति में कुल कितने व्यक्ति हैं?', x + y - 1, [x + y, x + y + 1, x + y - 2, x * 2], 'Total = x + y − 1 = ' + (x + y - 1)); }
    var p = r.int(5, 15), q = r.int(5, 15), N = p + q + r.int(6, 20); return Q(r, 'Ranking & Order', 'In a row of ' + N + ' people, A is ' + p + 'th from the left end and B is ' + q + 'th from the right end. How many people are between A and B?', N + ' व्यक्तियों की पंक्ति में A बाएँ छोर से ' + p + 'वाँ और B दाएँ छोर से ' + q + 'वाँ है। A और B के बीच कितने व्यक्ति हैं?', N - p - q, [N - p - q + 1, N - p - q - 1, N - p - q + 2, N - p - q + 3], 'Between = N − (p + q) = ' + N + ' − ' + (p + q) + ' = ' + (N - p - q));
  };
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], DAYH = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'बृहस्पतिवार', 'शुक्रवार', 'शनिवार'];
  R.calendar = function (r, h) {
    var d0 = r.int(0, 6), t = r.int(0, 2);
    if (t === 0) { var n = h ? r.int(100, 400) : r.int(10, 100), f = (d0 + n) % 7; return QP(r, 'Calendar & Clock', 'Today is ' + DAYS[d0] + '. What day of the week will it be after ' + n + ' days?', 'आज ' + DAYH[d0] + ' है। ' + n + ' दिन बाद कौन-सा दिन होगा?', [DAYS[f], DAYH[f]], [1, 2, 3].map(function (k) { return [DAYS[(f + k) % 7], DAYH[(f + k) % 7]]; }), n + ' mod 7 = ' + n % 7 + ' odd days ⇒ ' + DAYS[f], n + ' ÷ 7 का शेष = ' + n % 7 + ' ⇒ ' + DAYH[f]); }
    if (t === 1) { var dt = r.int(2, 9), dt2 = dt + 7 * r.int(1, 3) + r.int(0, 6), f2 = (d0 + (dt2 - dt)) % 7; return QP(r, 'Calendar & Clock', 'If the ' + dt + 'th of a month is a ' + DAYS[d0] + ', what day will the ' + dt2 + 'th be?', 'यदि किसी माह की ' + dt + ' तारीख ' + DAYH[d0] + ' है, तो ' + dt2 + ' तारीख को कौन-सा दिन होगा?', [DAYS[f2], DAYH[f2]], [1, 2, 3].map(function (k) { return [DAYS[(f2 + k) % 7], DAYH[(f2 + k) % 7]]; }), 'Difference ' + (dt2 - dt) + ' days ⇒ ' + (dt2 - dt) % 7 + ' odd days', 'अंतर ' + (dt2 - dt) + ' दिन ⇒ ' + (dt2 - dt) % 7 + ' अतिरिक्त दिन'); }
    var yrs = r.pick([[1900, 'No', 'नहीं'], [2000, 'Yes', 'हाँ'], [2024, 'Yes', 'हाँ'], [2100, 'No', 'नहीं'], [1996, 'Yes', 'हाँ'], [2023, 'No', 'नहीं'], [2400, 'Yes', 'हाँ'], [1800, 'No', 'नहीं']]);
    return QP(r, 'Calendar & Clock', 'Is the year ' + yrs[0] + ' a leap year?', 'क्या वर्ष ' + yrs[0] + ' एक अधिवर्ष (leap year) है?', [yrs[1], yrs[2]], yrs[1] === 'Yes' ? [['No', 'नहीं'], ['Cannot be determined', 'निर्धारित नहीं किया जा सकता'], ['Only in century', 'केवल शताब्दी में']] : [['Yes', 'हाँ'], ['Cannot be determined', 'निर्धारित नहीं किया जा सकता'], ['Only in century', 'केवल शताब्दी में']], 'Century years must be divisible by 400; other years by 4', 'शताब्दी वर्ष 400 से और अन्य वर्ष 4 से विभाज्य होने चाहिए');
  };
  R.clock = function (r) {
    var H = r.int(1, 12), M = r.int(0, 29) * 2, ang = Math.abs(30 * H - 5.5 * M); if (ang > 180) ang = 360 - ang;
    return Q(r, 'Calendar & Clock', 'What is the angle between the hour hand and the minute hand of a clock at ' + H + ':' + PT.pad(M) + '?', 'घड़ी में ' + H + ':' + PT.pad(M) + ' बजे घंटे और मिनट की सुइयों के बीच कितना कोण होगा?', fmt(ang) + '°', [fmt(Math.abs(ang + 15)) + '°', fmt(Math.abs(ang - 10)) + '°', fmt(ang + 30) + '°', fmt(Math.abs(ang - 20)) + '°'], 'Angle = |30H − 5.5M| = |' + 30 * H + ' − ' + 5.5 * M + '| = ' + fmt(ang) + '°');
  };
  R.operations = function (r, h) {
    var a = r.int(2, 9) * r.int(2, 4), b = r.int(2, 6), c = r.pick([2, 3, 4, 6]);
    var a2 = c * r.int(2, 6), b2 = r.int(2, 5); var d = r.int(2, 12), e = r.int(1, 9);
    var real = a2 * b2 / c + d - e; if (a2 * b2 % c) return R.operations(r, h);
    return Q(r, 'Mathematical Operations', 'If ‘+’ means ‘×’, ‘−’ means ‘÷’, ‘×’ means ‘+’ and ‘÷’ means ‘−’, then ' + a2 + ' + ' + b2 + ' − ' + c + ' × ' + d + ' ÷ ' + e + ' = ?', 'यदि ‘+’ का अर्थ ‘×’, ‘−’ का अर्थ ‘÷’, ‘×’ का अर्थ ‘+’ और ‘÷’ का अर्थ ‘−’ हो, तो ' + a2 + ' + ' + b2 + ' − ' + c + ' × ' + d + ' ÷ ' + e + ' = ?', real, [real + 2, real - 3, real + d, real + 5], 'Replace symbols: ' + a2 + ' × ' + b2 + ' ÷ ' + c + ' + ' + d + ' − ' + e + ' = ' + real, 'चिह्न बदलने पर: ' + a2 + ' × ' + b2 + ' ÷ ' + c + ' + ' + d + ' − ' + e + ' = ' + real);
  };
  var SYL = [
    ['All pens are books. All books are tables.', 'I. All pens are tables.  II. Some tables are pens.', 3, 'सभी कलमें किताबें हैं। सभी किताबें मेज़ें हैं।', 'I. सभी कलमें मेज़ें हैं।  II. कुछ मेज़ें कलमें हैं।'],
    ['Some cats are dogs. All dogs are rats.', 'I. Some cats are rats.  II. All cats are rats.', 0, 'कुछ बिल्लियाँ कुत्ते हैं। सभी कुत्ते चूहे हैं।', 'I. कुछ बिल्लियाँ चूहे हैं।  II. सभी बिल्लियाँ चूहे हैं।'],
    ['All A are B. No B is C.', 'I. No A is C.  II. Some C are A.', 0, 'सभी A, B हैं। कोई B, C नहीं है।', 'I. कोई A, C नहीं है।  II. कुछ C, A हैं।'],
    ['Some men are doctors. Some doctors are teachers.', 'I. Some men are teachers.  II. Some teachers are men.', 2, 'कुछ पुरुष डॉक्टर हैं। कुछ डॉक्टर शिक्षक हैं।', 'I. कुछ पुरुष शिक्षक हैं।  II. कुछ शिक्षक पुरुष हैं।'],
    ['No flower is a tree. All trees are plants.', 'I. No flower is a plant.  II. Some plants are not flowers.', 1, 'कोई फूल पेड़ नहीं है। सभी पेड़ पौधे हैं।', 'I. कोई फूल पौधा नहीं है।  II. कुछ पौधे फूल नहीं हैं।'],
    ['All roses are flowers. Some flowers are red.', 'I. Some roses are red.  II. All flowers are roses.', 2, 'सभी गुलाब फूल हैं। कुछ फूल लाल हैं।', 'I. कुछ गुलाब लाल हैं।  II. सभी फूल गुलाब हैं।'],
    ['Some books are pens. No pen is a pencil.', 'I. Some books are not pencils.  II. No book is a pencil.', 0, 'कुछ किताबें कलमें हैं। कोई कलम पेंसिल नहीं है।', 'I. कुछ किताबें पेंसिल नहीं हैं।  II. कोई किताब पेंसिल नहीं है।'],
    ['All mangoes are fruits. All fruits are sweet.', 'I. All mangoes are sweet.  II. Some sweet things are fruits.', 3, 'सभी आम फल हैं। सभी फल मीठे हैं।', 'I. सभी आम मीठे हैं।  II. कुछ मीठी चीज़ें फल हैं।']
  ];
  var SYLO = [['Only I follows', 'केवल I अनुसरण करता है'], ['Only II follows', 'केवल II अनुसरण करता है'], ['Neither I nor II follows', 'न तो I और न ही II अनुसरण करता है'], ['Both I and II follow', 'I और II दोनों अनुसरण करते हैं']];
  R.syllogism = function (r) {
    var s = r.pick(SYL), o = SYLO.slice(), cor = o[s[2]];
    var order = r.shuffle([0, 1, 2, 3]), arr = order.map(function (i) { return SYLO[i]; });
    return { t: 'Syllogism', q: ['Statements: ' + s[0] + '\nConclusions: ' + s[1], 'कथन: ' + s[3] + '\nनिष्कर्ष: ' + s[4]], o: arr, a: arr.indexOf(cor), e: ['Check each conclusion against the statements using Venn diagrams.', 'वेन आरेख से प्रत्येक निष्कर्ष की जाँच कीजिए।'] };
  };
  R.alphaPos = function (r) {
    var t = r.int(0, 2), i = r.int(1, 8), j = r.int(i + 3, 24);
    if (t === 0) return Q(r, 'Number & Alphabet Series', 'How many letters are there between ' + L(i - 1) + ' and ' + L(j - 1) + ' in the English alphabet?', 'अंग्रेज़ी वर्णमाला में ' + L(i - 1) + ' और ' + L(j - 1) + ' के बीच कितने अक्षर हैं?', j - i - 1, [j - i, j - i + 1, j - i - 2, j - i + 2], L(i - 1) + ' is ' + i + 'th and ' + L(j - 1) + ' is ' + j + 'th ⇒ between = ' + (j - i - 1));
    if (t === 1) { var n = r.int(3, 12), ans = L(26 - n); return Q(r, 'Number & Alphabet Series', 'Which letter is the ' + n + 'th from the end of the English alphabet?', 'अंग्रेज़ी वर्णमाला में अंत से ' + n + 'वाँ अक्षर कौन-सा है?', ans, [L(26 - n + 1), L(26 - n - 1), L(n - 1), L(n)], (n) + 'th from the end = position ' + (27 - n) + ' from the start = ' + ans); }
    var p = r.int(2, 24), q = r.int(2, 24); return Q(r, 'Number & Alphabet Series', 'If the letters of the alphabet are numbered 1 to 26, which letter is at position ' + (p + q) % 26 + (((p + q) % 26) === 0 ? 26 : 0) + '?', 'यदि वर्णमाला के अक्षरों को 1 से 26 तक क्रमांकित किया जाए, तो स्थान ' + ((p + q) % 26 || 26) + ' पर कौन-सा अक्षर है?', L(((p + q) % 26 || 26) - 1), [L(((p + q) % 26 || 26)), L(((p + q) % 26 || 26) - 2), L(((p + q) % 26 || 26) + 1)], 'Position ' + ((p + q) % 26 || 26) + ' ⇒ ' + L(((p + q) % 26 || 26) - 1));
  };
  R.pairs = function (r) {
    var f = r.pick([['n²', function (n) { return n * n; }], ['n³', function (n) { return n * n * n; }], ['2n + 1', function (n) { return 2 * n + 1; }], ['n² − 1', function (n) { return n * n - 1; }], ['n(n+1)', function (n) { return n * (n + 1); }], ['3n − 2', function (n) { return 3 * n - 2; }]]);
    var a = r.int(2, 6), n = a + 3, shown = [a, a + 1, a + 2].map(function (x) { return '(' + x + ', ' + f[1](x) + ')'; }).join(', '), ans = f[1](n);
    return Q(r, 'Number & Alphabet Series', 'Find the missing number: ' + shown + ', (' + n + ', ?)', 'लुप्त संख्या ज्ञात कीजिए: ' + shown + ', (' + n + ', ?)', ans, [ans + 2, ans - 1, ans + n, ans + 5], 'Rule: ' + f[0] + ' ⇒ ' + ans);
  };
  R.venn = function (r) {
    var N = r.int(6, 20) * 10, a = r.int(25, 60), b = r.int(25, 60), c = r.int(8, Math.min(a, b) - 5), neither = N - (a + b - c);
    if (neither < 0) { N = a + b - c + r.int(5, 30); neither = N - (a + b - c); }
    var t = r.int(0, 1);
    if (t === 0) return Q(r, 'Venn Diagrams', 'In a group of ' + N + ' students, ' + a + ' play cricket, ' + b + ' play football and ' + c + ' play both. How many play neither game?', N + ' विद्यार्थियों के समूह में ' + a + ' क्रिकेट, ' + b + ' फुटबॉल और ' + c + ' दोनों खेलते हैं। कितने कोई भी खेल नहीं खेलते?', neither, [neither + 5, neither - 3, neither + 10, a + b - c], 'Either or both = ' + a + ' + ' + b + ' − ' + c + ' = ' + (a + b - c) + '; neither = ' + N + ' − ' + (a + b - c) + ' = ' + neither);
    return Q(r, 'Venn Diagrams', 'In a group of ' + N + ' students, ' + a + ' play cricket, ' + b + ' play football and ' + c + ' play both. How many play only cricket?', N + ' विद्यार्थियों के समूह में ' + a + ' क्रिकेट, ' + b + ' फुटबॉल और ' + c + ' दोनों खेलते हैं। केवल क्रिकेट कितने खेलते हैं?', a - c, [a - c + 4, a - c - 2, b - c, a + b - c], 'Only cricket = ' + a + ' − ' + c + ' = ' + (a - c));
  };
  G.reasoning = {
    t1: [[R.numSeries, 5], [R.alphaSeries, 3], [R.codeShift, 4], [R.codeReverse, 2], [R.letterSum, 1], [R.analogyNum, 2], [R.analogyLetters, 1], [R.analogyWord, 3], [R.analogyCapital, 2], [R.oddNum, 3], [R.blood, 4], [R.direction, 4], [R.ranking, 3], [R.calendar, 3], [R.clock, 2], [R.operations, 2], [R.syllogism, 3], [R.alphaPos, 2], [R.pairs, 2], [R.venn, 2]],
    t2: [[R.numSeries, 6], [R.alphaSeries, 2], [R.codeShift, 4], [R.codeReverse, 2], [R.analogyNum, 3], [R.oddNum, 2], [R.blood, 3], [R.direction, 4], [R.ranking, 2], [R.calendar, 4], [R.clock, 3], [R.operations, 4], [R.syllogism, 4], [R.pairs, 3], [R.venn, 3], [R.letterSum, 1]]
  };
})();
