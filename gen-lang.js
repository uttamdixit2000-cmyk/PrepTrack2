/* Generators — English, GK, Computer (bilingual) + Computer bank & Statistics concepts */
(function () {
  var PT = window.PT = window.PT || {};
  var G = PT.GEN = PT.GEN || {};
  function QP(r, t, en, hi, cor, wr, ee, eh) { return PT.mkQP(r, t, en, hi, cor, wr, ee, eh); }
  function strOpts(r, t, en, hi, cor, wrongs, ee, eh) {
    var set = [cor], seen = {}; seen[cor] = 1;
    wrongs.forEach(function (w) { if (!seen[w]) { seen[w] = 1; set.push(w); } });
    set = set.slice(0, 4); var sh = r.shuffle(set);
    return { t: t, q: [en, hi], o: sh, a: sh.indexOf(cor), e: [ee || '', eh || ee || ''] };
  }
  function others(r, arr, cur, n) { var a = r.shuffle(arr.filter(function (x) { return x !== cur; })); return a.slice(0, n); }

  /* ---------------- English ---------------- */
  var E = {};
  E.syn = function (r) {
    var v = r.pick(PT.VOCAB), o = others(r, PT.VOCAB.filter(function (x) { return x[1] !== v[1] && x[2] !== v[1]; }), v, 3);
    return QP(r, 'Synonyms & Antonyms', 'Choose the word most similar in meaning to “' + v[0].toUpperCase() + '”.', '“' + v[0].toUpperCase() + '” (' + v[3] + ') का समानार्थी शब्द चुनिए।', [v[1], v[3]], o.map(function (x) { return [x[1], x[3]]; }), v[0] + ' = ' + v[1] + ' (' + v[3] + ')', v[0] + ' = ' + v[1] + ' (' + v[3] + ')');
  };
  E.ant = function (r) {
    var v = r.pick(PT.VOCAB), o = others(r, PT.VOCAB.filter(function (x) { return x[1] !== v[1] && x[1] !== v[2] && x[2] !== v[2]; }), v, 2);
    var wr = [[v[1], v[3]]].concat(o.map(function (x) { return [x[1], x[3]]; }));
    return QP(r, 'Synonyms & Antonyms', 'Choose the word opposite in meaning to “' + v[0].toUpperCase() + '”.', '“' + v[0].toUpperCase() + '” (' + v[3] + ') का विलोम शब्द चुनिए।', [v[2], v[4]], wr, v[0] + ' ↔ ' + v[2] + ' (' + v[4] + ')', v[0] + ' ↔ ' + v[2] + ' (' + v[4] + ')');
  };
  E.idiom = function (r) {
    var v = r.pick(PT.IDIOMS), o = others(r, PT.IDIOMS.filter(function (x) { return x[1] !== v[1]; }), v, 3);
    return QP(r, 'Idioms & Phrases', 'Choose the correct meaning of the idiom: “' + v[0] + '”.', 'मुहावरे “' + v[0] + '” का सही अर्थ चुनिए।', [v[1], v[2]], o.map(function (x) { return [x[1], x[2]]; }), '“' + v[0] + '” means: ' + v[1], '“' + v[0] + '” का अर्थ: ' + v[2]);
  };
  E.ows = function (r) {
    var v = r.pick(PT.OWS), o = others(r, PT.OWS, v, 3);
    return QP(r, 'One-word Substitution', 'One-word substitute for: “' + v[0] + '”', 'एक शब्द में लिखिए: “' + v[2] + '” (' + v[0] + ')', [v[1], v[3]], o.map(function (x) { return [x[1], x[3]]; }), v[0] + ' = ' + v[1], v[2] + ' = ' + v[1] + ' (' + v[3] + ')');
  };
  E.spell = function (r) {
    var v = r.pick(PT.SPELL); return strOpts(r, 'Spelling Correction', 'Choose the correctly spelt word.', 'सही वर्तनी वाला शब्द चुनिए।', v[0], [v[1], v[2], v[3]], 'Correct spelling: ' + v[0], 'सही वर्तनी: ' + v[0]);
  };
  E.fill = function (r) {
    var v = r.pick(PT.FILL); return strOpts(r, 'Fill in the Blanks', 'Fill in the blank:\n' + v[0], 'रिक्त स्थान भरिए:\n' + v[0], v[1], [v[2], v[3], v[4]], v[5], v[6]);
  };
  E.err = function (r) {
    var v = r.pick(PT.ERR), seg = v[0], sent = seg.join(' '), no = ['No error', 'कोई त्रुटि नहीं'], opts = seg.map(function (s) { return s; }).concat([no]);
    var cor = v[1] === -1 ? 3 : v[1];
    return { t: 'Error Spotting', q: ['Find the part of the sentence that has an error (choose “No error” if it is correct).\n' + sent, 'वाक्य का वह भाग चुनिए जिसमें त्रुटि है (त्रुटि न हो तो “कोई त्रुटि नहीं” चुनिए)।\n' + sent], o: opts, a: cor, e: [v[2], v[3]] };
  };
  E.voice = function (r) {
    var v = r.pick(PT.VOICE), hiType = v[1] === 'Passive voice' ? 'कर्मवाच्य (Passive voice)' : 'अप्रत्यक्ष कथन (Indirect speech)';
    return strOpts(r, 'Voice & Narration', 'Change into ' + v[1] + ':\n' + v[0], hiType + ' में बदलिए:\n' + v[0], v[2], [v[3], v[4], v[5]], 'Correct: ' + v[2], 'सही उत्तर: ' + v[2]);
  };
  G.english = {
    t1: [[E.syn, 9], [E.ant, 7], [E.idiom, 7], [E.ows, 6], [E.spell, 4], [E.fill, 9], [E.err, 5], [E.voice, 3]],
    t2: [[E.syn, 8], [E.ant, 6], [E.idiom, 6], [E.ows, 7], [E.spell, 3], [E.fill, 8], [E.err, 8], [E.voice, 4]]
  };

  /* ---------------- GK table generators ---------------- */
  var K = {};
  function pairsOf(tbl, ia, ib, cur, n, r) { return r.shuffle(tbl.filter(function (x) { return x[ia] !== cur[ia]; })).slice(0, n * 2).filter(function (x, i, a) { return a.findIndex(function (y) { return y[ia] === x[ia]; }) === i; }).slice(0, n); }
  K.stateCap = function (r) {
    var T = PT.TABLES.stateCap, v = r.pick(T), o = pairsOf(T, 2, 3, v, 6, r).filter(function (x) { return x[2] !== v[2]; }).slice(0, 3);
    if (r.int(0, 2) === 0 && v[2] !== 'Chandigarh') return QP(r, 'Static GK (capitals, currencies)', v[2] + ' is the capital of which State?', v[2] + ' किस राज्य की राजधानी है?', [v[0], v[1]], o.map(function (x) { return [x[0], x[1]]; }), 'Capital of ' + v[0] + ' is ' + v[2], v[1] + ' की राजधानी ' + v[3] + ' है');
    return QP(r, 'Static GK (capitals, currencies)', 'What is the capital of ' + v[0] + '?', v[1] + ' की राजधानी क्या है?', [v[2], v[3]], o.map(function (x) { return [x[2], x[3]]; }), 'Capital of ' + v[0] + ' is ' + v[2], v[1] + ' की राजधानी ' + v[3] + ' है');
  };
  K.countryCap = function (r) {
    var T = PT.TABLES.countryCap, v = r.pick(T), o = pairsOf(T, 1, 3, v, 3, r);
    if (r.int(0, 1)) return QP(r, 'Static GK (capitals, currencies)', 'What is the capital of ' + v[0] + '?', v[2] + ' की राजधानी क्या है?', [v[1], v[3]], o.map(function (x) { return [x[1], x[3]]; }), v[1] + ' is the capital of ' + v[0], v[3] + ' ' + v[2] + ' की राजधानी है');
    return QP(r, 'Static GK (capitals, currencies)', v[1] + ' is the capital of which country?', v[3] + ' किस देश की राजधानी है?', [v[0], v[2]], o.map(function (x) { return [x[0], x[2]]; }), v[1] + ' is the capital of ' + v[0], v[3] + ' ' + v[2] + ' की राजधानी है');
  };
  K.currency = function (r) {
    var T = PT.TABLES.currency, v = r.pick(T), o = pairsOf(T, 2, 3, v, 6, r).filter(function (x) { return x[2] !== v[2]; }).slice(0, 3);
    return QP(r, 'Static GK (capitals, currencies)', 'What is the currency of ' + v[0] + '?', v[1] + ' की मुद्रा क्या है?', [v[2], v[3]], o.map(function (x) { return [x[2], x[3]]; }), 'Currency of ' + v[0] + ': ' + v[2], v[1] + ' की मुद्रा: ' + v[3]);
  };
  K.river = function (r) {
    var T = PT.TABLES, c = r.pick(T.cityRiver), R = T.rivers, cor = R[c[2]], o = r.shuffle(R.filter(function (x) { return x[0] !== cor[0]; })).slice(0, 3);
    return QP(r, 'Indian Geography', c[0] + ' is situated on the banks of which river?', c[1] + ' किस नदी के तट पर स्थित है?', [cor[0], cor[1]], o.map(function (x) { return [x[0], x[1]]; }), c[0] + ' lies on the ' + cor[0], c[1] + ' ' + cor[1] + ' नदी के तट पर है');
  };
  K.park = function (r) {
    var T = PT.TABLES, v = r.pick(T.parks), pool = T.stateCap.filter(function (x) { return x[0] !== v[2]; }), o = r.shuffle(pool).slice(0, 3);
    return QP(r, 'Indian Geography', v[0] + ' is located in which State?', v[1] + ' किस राज्य में स्थित है?', [v[2], v[3]], o.map(function (x) { return [x[0], x[1]]; }), v[0] + ' is in ' + v[2], v[1] + ' ' + v[3] + ' में है');
  };
  K.dance = function (r) {
    var T = PT.TABLES, v = r.pick(T.dances), pool = T.stateCap.filter(function (x) { return x[0] !== v[2] && (v[2] !== 'Kerala' || x[0] !== 'Kerala'); }), o = r.shuffle(pool).slice(0, 3);
    return QP(r, 'Static GK (capitals, currencies)', v[0] + ' is a classical/folk dance of which State?', v[1] + ' किस राज्य का नृत्य है?', [v[2], v[3]], o.map(function (x) { return [x[0], x[1]]; }), v[0] + ' belongs to ' + v[2], v[1] + ' ' + v[3] + ' का नृत्य है');
  };
  K.day = function (r) {
    var T = PT.TABLES.days, v = r.pick(T), o = r.shuffle(T.filter(function (x) { return x[0] !== v[0]; })).slice(0, 3);
    return QP(r, 'Important Days', 'Which day is observed on ' + v[0] + '?', v[1] + ' को कौन-सा दिवस मनाया जाता है?', [v[2], v[3]], o.map(function (x) { return [x[2], x[3]]; }), v[2] + ' is observed on ' + v[0], v[3] + ' ' + v[1] + ' को मनाया जाता है');
  };
  K.book = function (r) {
    var T = PT.TABLES.books, v = r.pick(T);
    if (r.int(0, 1)) { var o = r.shuffle(T.filter(function (x) { return x[2] !== v[2]; })).slice(0, 3); return QP(r, 'Awards, Books & Authors', 'Who wrote “' + v[0] + '”?', '“' + v[1] + '” (' + v[0] + ') के लेखक कौन हैं?', [v[2], v[3]], o.map(function (x) { return [x[2], x[3]]; }), '“' + v[0] + '” was written by ' + v[2], '“' + v[1] + '” के लेखक ' + v[3] + ' हैं'); }
    var o2 = r.shuffle(T.filter(function (x) { return x[0] !== v[0]; })).slice(0, 3); return QP(r, 'Awards, Books & Authors', 'Which of the following books was written by ' + v[2] + '?', 'निम्नलिखित में से कौन-सी पुस्तक ' + v[3] + ' ने लिखी है?', [v[0], v[1]], o2.map(function (x) { return [x[0], x[1]]; }), v[2] + ' wrote “' + v[0] + '”', v[3] + ' ने “' + v[1] + '” लिखी');
  };
  /* fact bank question */
  PT.factQ = function (r, f) {
    var cat = PT.GKCAT[f.c], wr = f.w.slice(), set = [f.a].concat(wr), sh = r.shuffle(set);
    return { t: cat[0], q: f.q, o: sh, a: sh.indexOf(f.a), e: ['Answer: ' + f.a[0], 'उत्तर: ' + f.a[1]] };
  };
  PT.tableGens = [[K.stateCap, 3], [K.countryCap, 3], [K.currency, 2], [K.river, 2], [K.park, 2], [K.dance, 1], [K.day, 2], [K.book, 2]];

  /* ---------------- Computer bank ---------------- */
  var CB = PT.COMPBANK = [];
  function c(qe, qh, a, w) { function p(s) { var x = s.split('|'); return [x[0], x.length > 1 ? x[1] : x[0]]; } CB.push({ c: 'C', l: 1, q: [qe, qh], a: p(a), w: w.map(p) }); }
  c('Who is known as the “Father of the Computer”?', 'कंप्यूटर का जनक किसे कहा जाता है?', 'Charles Babbage|चार्ल्स बैबेज', ['Alan Turing|एलन ट्यूरिंग', 'Bill Gates|बिल गेट्स', 'John von Neumann|जॉन वॉन न्यूमैन']);
  c('The first general-purpose electronic computer was —', 'पहला सामान्य-उद्देश्य इलेक्ट्रॉनिक कंप्यूटर कौन-सा था?', 'ENIAC', ['UNIVAC', 'EDSAC', 'Mark I']);
  c('Which part is called the “brain” of the computer?', 'कंप्यूटर का “मस्तिष्क” किसे कहते हैं?', 'CPU|सीपीयू', ['RAM|रैम', 'Hard disk|हार्ड डिस्क', 'Monitor|मॉनिटर']);
  c('RAM is a —', 'RAM किस प्रकार की मेमोरी है?', 'Volatile memory|अस्थायी (वोलेटाइल) मेमोरी', ['Permanent memory|स्थायी मेमोरी', 'Read-only memory|केवल-पठन मेमोरी', 'Secondary storage|द्वितीयक भंडारण']);
  c('ROM is a —', 'ROM किस प्रकार की मेमोरी है?', 'Non-volatile memory|स्थायी (नॉन-वोलेटाइल) मेमोरी', ['Volatile memory|अस्थायी मेमोरी', 'Cache memory|कैश मेमोरी', 'Virtual memory|वर्चुअल मेमोरी']);
  c('1 byte equals how many bits?', '1 बाइट में कितने बिट होते हैं?', '8', ['4', '16', '10']);
  c('1 Kilobyte (KB) equals —', '1 किलोबाइट (KB) बराबर है —', '1024 bytes|1024 बाइट', ['1000 bytes|1000 बाइट', '512 bytes|512 बाइट', '1024 bits|1024 बिट']);
  c('The shortcut key for “Copy” in Windows is —', 'विंडोज़ में “कॉपी” की शॉर्टकट कुंजी है —', 'Ctrl + C', ['Ctrl + V', 'Ctrl + X', 'Ctrl + P']);
  c('The shortcut key for “Paste” is —', '“पेस्ट” की शॉर्टकट कुंजी है —', 'Ctrl + V', ['Ctrl + C', 'Ctrl + Z', 'Ctrl + A']);
  c('The shortcut key for “Undo” is —', '“अनडू” की शॉर्टकट कुंजी है —', 'Ctrl + Z', ['Ctrl + Y', 'Ctrl + U', 'Ctrl + X']);
  c('The shortcut key for “Select All” is —', '“सभी चुनें” की शॉर्टकट कुंजी है —', 'Ctrl + A', ['Ctrl + S', 'Ctrl + L', 'Ctrl + E']);
  c('The shortcut key to print a document is —', 'दस्तावेज़ प्रिंट करने की शॉर्टकट कुंजी है —', 'Ctrl + P', ['Ctrl + O', 'Ctrl + N', 'Ctrl + T']);
  c('The default file extension of a modern MS Word document is —', 'आधुनिक MS Word फ़ाइल का डिफ़ॉल्ट एक्सटेंशन है —', '.docx', ['.xlsx', '.pptx', '.txt']);
  c('The default file extension of a modern MS Excel workbook is —', 'आधुनिक MS Excel वर्कबुक का डिफ़ॉल्ट एक्सटेंशन है —', '.xlsx', ['.docx', '.pptx', '.csv']);
  c('The World Wide Web (WWW) was invented by —', 'वर्ल्ड वाइड वेब (WWW) का आविष्कार किसने किया?', 'Tim Berners-Lee|टिम बर्नर्स-ली', ['Vint Cerf|विंट सर्फ', 'Steve Jobs|स्टीव जॉब्स', 'Larry Page|लैरी पेज']);
  c('The full form of URL is —', 'URL का पूर्ण रूप क्या है?', 'Uniform Resource Locator', ['Universal Resource Link', 'Uniform Retrieval Locator', 'United Resource Locator']);
  c('The full form of HTTP is —', 'HTTP का पूर्ण रूप क्या है?', 'HyperText Transfer Protocol', ['HyperText Transmission Process', 'High Transfer Text Protocol', 'HyperText Terminal Protocol']);
  c('The full form of USB is —', 'USB का पूर्ण रूप क्या है?', 'Universal Serial Bus', ['United Serial Bus', 'Universal System Bus', 'Unique Serial Bus']);
  c('The full form of BIOS is —', 'BIOS का पूर्ण रूप क्या है?', 'Basic Input Output System', ['Binary Input Output System', 'Basic Internal Operating System', 'Basic Input Operating Software']);
  c('The full form of VPN is —', 'VPN का पूर्ण रूप क्या है?', 'Virtual Private Network', ['Virtual Public Network', 'Visual Private Network', 'Variable Private Network']);
  c('Which of the following is an input device?', 'इनमें से कौन-सा इनपुट डिवाइस है?', 'Scanner|स्कैनर', ['Monitor|मॉनिटर', 'Printer|प्रिंटर', 'Speaker|स्पीकर']);
  c('Which of the following is an output device?', 'इनमें से कौन-सा आउटपुट डिवाइस है?', 'Printer|प्रिंटर', ['Keyboard|कीबोर्ड', 'Mouse|माउस', 'Scanner|स्कैनर']);
  c('The binary number system has base —', 'द्विआधारी (बाइनरी) संख्या पद्धति का आधार है —', '2', ['8', '10', '16']);
  c('The hexadecimal number system has base —', 'हेक्साडेसिमल संख्या पद्धति का आधार है —', '16', ['8', '10', '2']);
  c('HTML is a —', 'HTML क्या है?', 'Markup language|मार्कअप भाषा', ['Programming language|प्रोग्रामिंग भाषा', 'Operating system|ऑपरेटिंग सिस्टम', 'Database|डेटाबेस']);
  c('The computer mouse was invented by —', 'कंप्यूटर माउस का आविष्कार किसने किया?', 'Douglas Engelbart|डगलस एंगेलबर्ट', ['Tim Berners-Lee|टिम बर्नर्स-ली', 'Charles Babbage|चार्ल्स बैबेज', 'Bill Gates|बिल गेट्स']);
  c('“Phishing” refers to —', '“फ़िशिंग” का अर्थ है —', 'Fraudulent attempt to steal personal data|व्यक्तिगत जानकारी चुराने का धोखाधड़ी प्रयास', ['A type of antivirus|एक प्रकार का एंटीवायरस', 'A file format|एक फ़ाइल प्रारूप', 'A search engine|एक सर्च इंजन']);
  c('A firewall is used to —', 'फ़ायरवॉल का उपयोग किसलिए होता है?', 'Protect a network from unauthorised access|नेटवर्क को अनधिकृत पहुँच से बचाना', ['Speed up the internet|इंटरनेट तेज़ करना', 'Store data|डेटा संग्रहित करना', 'Print documents|दस्तावेज़ प्रिंट करना']);
  c('Which of the following is an operating system?', 'इनमें से कौन-सा ऑपरेटिंग सिस्टम है?', 'Linux|लिनक्स', ['MS Word|एमएस वर्ड', 'Chrome|क्रोम', 'Photoshop|फ़ोटोशॉप']);
  c('In MS Excel, every formula begins with the sign —', 'MS Excel में हर सूत्र किस चिह्न से शुरू होता है?', '= (equal to)|= (बराबर)', ['+ (plus)|+ (धन)', '# (hash)|# (हैश)', '@ (at)|@ (एट)']);
  c('Which Excel function adds a range of numbers?', 'Excel का कौन-सा फ़ंक्शन संख्याओं की सीमा जोड़ता है?', 'SUM', ['ADD', 'TOTAL', 'COUNT']);
  c('In e-mail, “BCC” stands for —', 'ई-मेल में “BCC” का अर्थ है —', 'Blind Carbon Copy', ['Basic Carbon Copy', 'Binary Carbon Copy', 'Broad Carbon Copy']);
  c('The smallest unit of data in a computer is a —', 'कंप्यूटर में डेटा की सबसे छोटी इकाई है —', 'Bit|बिट', ['Byte|बाइट', 'Nibble|निबल', 'Word|वर्ड']);
  c('A compiler converts —', 'कंपाइलर क्या बदलता है?', 'High-level language into machine code|उच्च-स्तरीय भाषा को मशीन कोड में', ['Machine code into English|मशीन कोड को अंग्रेज़ी में', 'Images into text|चित्र को पाठ में', 'Files into folders|फ़ाइल को फ़ोल्डर में']);
  c('Which of the following is a programming language?', 'इनमें से कौन-सी प्रोग्रामिंग भाषा है?', 'Python|पायथन', ['HTTP', 'Windows|विंडोज़', 'Google|गूगल']);
  c('A Trojan horse is a type of —', 'ट्रोजन हॉर्स किस प्रकार का होता है?', 'Malware disguised as legitimate software|वैध सॉफ़्टवेयर के रूप में छिपा मैलवेयर', ['Hardware|हार्डवेयर', 'Search engine|सर्च इंजन', 'Operating system|ऑपरेटिंग सिस्टम']);
  c('DBMS stands for —', 'DBMS का पूर्ण रूप है —', 'Database Management System', ['Data Backup Management System', 'Digital Base Management Software', 'Database Memory Storage']);
  c('Which key is used to rename a selected file in Windows?', 'विंडोज़ में चुनी हुई फ़ाइल का नाम बदलने के लिए कौन-सी कुंजी है?', 'F2', ['F1', 'F5', 'F12']);
  c('The shortcut to switch between open windows is —', 'खुली हुई विंडोज़ के बीच बदलने का शॉर्टकट है —', 'Alt + Tab', ['Ctrl + Tab', 'Shift + Tab', 'Alt + F4']);
  c('Which memory is non-volatile and used for long-term storage?', 'कौन-सी मेमोरी स्थायी है और दीर्घकालीन भंडारण के लिए प्रयुक्त होती है?', 'Hard disk|हार्ड डिस्क', ['RAM|रैम', 'Cache|कैश', 'Register|रजिस्टर']);
  c('The secure version of HTTP is —', 'HTTP का सुरक्षित संस्करण है —', 'HTTPS', ['FTP', 'SMTP', 'HTML']);
  PT.computerGen = function (r) { var f = r.pick(CB), cat = ['Computer Knowledge', 'कंप्यूटर ज्ञान'], set = [f.a].concat(f.w), sh = r.shuffle(set); return { t: cat[0], q: f.q, o: sh, a: sh.indexOf(f.a), e: ['Answer: ' + f.a[0], 'उत्तर: ' + f.a[1]] }; };

  /* ---------------- Statistics concepts ---------------- */
  function sp(s) { var x = s.split('|'); return [x[0], x.length > 1 ? x[1] : x[0]]; }
  function sc(t, qe, qh, ans, ee, eh) { return { t: t, q: [qe, qh], o: ans.map(sp), e: [ee || '', eh || ee || ''] }; }
  PT.STATS_CONCEPTS = [
    sc('Mean, Median, Mode', 'The sum of deviations of observations from their arithmetic mean is always —', 'प्रेक्षणों के समांतर माध्य से विचलनों का योग सदैव ______ होता है।', ['Zero|शून्य', 'One|एक', 'Positive|धनात्मक', 'Negative|ऋणात्मक'], 'Σ(x − x̄) = 0', 'Σ(x − x̄) = 0'),
    sc('Mean, Median, Mode', 'Which average is most affected by extreme values?', 'किस माध्य पर अतिवादी मानों का सबसे अधिक प्रभाव पड़ता है?', ['Arithmetic mean|समांतर माध्य', 'Median|माध्यिका', 'Mode|बहुलक', 'Positional average|स्थानीय माध्य']),
    sc('Mean, Median, Mode', 'The median can be located graphically using —', 'माध्यिका को ग्राफ द्वारा ज्ञात करने में किसका उपयोग होता है?', ['Ogive|तोरण (ओजाइव)', 'Histogram|आयतचित्र', 'Frequency polygon|बारंबारता बहुभुज', 'Pie chart|पाई चार्ट']),
    sc('Correlation & Regression', 'Karl Pearson’s coefficient of correlation lies between —', 'कार्ल पियर्सन का सहसंबंध गुणांक किन मानों के बीच होता है?', ['−1 and +1|−1 और +1', '0 and 1|0 और 1', '−∞ and +∞|−∞ और +∞', '0 and 100|0 और 100']),
    sc('Correlation & Regression', 'If the correlation coefficient r = 0, the variables are —', 'यदि सहसंबंध गुणांक r = 0 हो, तो चर —', ['Linearly uncorrelated|रैखिक रूप से असंबद्ध', 'Perfectly correlated|पूर्ण सहसंबद्ध', 'Perfectly negatively correlated|पूर्ण ऋणात्मक सहसंबद्ध', 'Independent always|सदैव स्वतंत्र']),
    sc('Correlation & Regression', 'The two regression lines intersect at the point —', 'दो समाश्रयण रेखाएँ किस बिंदु पर काटती हैं?', ['(mean of x, mean of y)|(x का माध्य, y का माध्य)', '(0, 0)', '(1, 1)', '(median x, median y)|(x की माध्यिका, y की माध्यिका)']),
    sc('Dispersion (SD, variance)', 'Standard deviation is the —', 'मानक विचलन क्या है?', ['Positive square root of variance|प्रसरण का धनात्मक वर्गमूल', 'Square of variance|प्रसरण का वर्ग', 'Half of the range|परास का आधा', 'Mean of deviations|विचलनों का माध्य']),
    sc('Mean, Median, Mode', 'In a moderately skewed distribution, the empirical relation is —', 'मध्यम विषम बंटन में अनुभवजन्य संबंध है —', ['Mode = 3 Median − 2 Mean|बहुलक = 3 माध्यिका − 2 माध्य', 'Mode = 2 Median − 3 Mean|बहुलक = 2 माध्यिका − 3 माध्य', 'Mean = 3 Median − 2 Mode|माध्य = 3 माध्यिका − 2 बहुलक', 'Median = Mean + Mode|माध्यिका = माध्य + बहुलक']),
    sc('Dispersion (SD, variance)', 'Which measure of dispersion is considered the best?', 'किस अपकिरण माप को सर्वश्रेष्ठ माना जाता है?', ['Standard deviation|मानक विचलन', 'Range|परास', 'Quartile deviation|चतुर्थक विचलन', 'Mean deviation|माध्य विचलन']),
    sc('Data Collection & Presentation', 'A graph drawn by joining the mid-points of the tops of histogram rectangles is called a —', 'आयतचित्र के आयतों की ऊपरी भुजाओं के मध्य-बिंदुओं को मिलाकर बना आलेख कहलाता है —', ['Frequency polygon|बारंबारता बहुभुज', 'Ogive|तोरण', 'Bar diagram|दंड आरेख', 'Pie chart|पाई चार्ट']),
    sc('Probability', 'The probability of an impossible event is —', 'असंभव घटना की प्रायिकता होती है —', ['0', '1', '0.5', '−1']),
    sc('Probability', 'The sum of probabilities of all mutually exclusive and exhaustive events is —', 'सभी परस्पर अपवर्जी व निःशेष घटनाओं की प्रायिकताओं का योग होता है —', ['1', '0', '2', '0.5']),
    sc('Dispersion (SD, variance)', 'The variance of a constant is —', 'किसी अचर राशि का प्रसरण होता है —', ['Zero|शून्य', 'One|एक', 'The constant itself|वह अचर स्वयं', 'Undefined|अपरिभाषित']),
    sc('Index Numbers', 'The Laspeyres price index uses —', 'लैस्पेयर मूल्य सूचकांक किसका उपयोग करता है?', ['Base-year quantities as weights|आधार वर्ष की मात्राएँ भार के रूप में', 'Current-year quantities as weights|चालू वर्ष की मात्राएँ भार के रूप में', 'No weights|कोई भार नहीं', 'Average of both years|दोनों वर्षों का औसत']),
    sc('Index Numbers', 'Fisher’s Ideal Index is the —', 'फिशर का आदर्श सूचकांक किसका होता है?', ['Geometric mean of Laspeyres and Paasche|लैस्पेयर और पाशे का गुणोत्तर माध्य', 'Arithmetic mean of Laspeyres and Paasche|लैस्पेयर और पाशे का समांतर माध्य', 'Harmonic mean of both|दोनों का हरात्मक माध्य', 'Sum of both|दोनों का योग']),
    sc('Time Series', 'The long-term movement of a time series is called —', 'समय श्रेणी की दीर्घकालीन गति कहलाती है —', ['Secular trend|दीर्घकालिक प्रवृत्ति', 'Seasonal variation|मौसमी परिवर्तन', 'Cyclical variation|चक्रीय परिवर्तन', 'Irregular variation|अनियमित परिवर्तन']),
    sc('Sampling & Estimation', 'Sampling error generally decreases when the sample size —', 'प्रतिदर्श का आकार बढ़ने पर प्रतिचयन त्रुटि प्रायः —', ['Increases|बढ़ता है', 'Decreases|घटता है', 'Stays constant|स्थिर रहता है', 'Becomes negative|ऋणात्मक हो जाता है']),
    sc('Skewness & Kurtosis', 'Skewness is zero for a —', 'किस बंटन के लिए विषमता शून्य होती है?', ['Symmetric distribution|सममित बंटन', 'Positively skewed distribution|धनात्मक विषम बंटन', 'Negatively skewed distribution|ऋणात्मक विषम बंटन', 'J-shaped distribution|J-आकार बंटन']),
    sc('Dispersion (SD, variance)', 'Quartile deviation is equal to —', 'चतुर्थक विचलन बराबर है —', ['(Q3 − Q1)/2', 'Q3 − Q1', '(Q3 + Q1)/2', 'Q3 × Q1']),
    sc('Dispersion (SD, variance)', 'The coefficient of variation is used to compare —', 'विचरण गुणांक का उपयोग किसकी तुलना के लिए होता है?', ['Relative variability of two series|दो श्रेणियों की सापेक्ष परिवर्तिता', 'Means of two series|दो श्रेणियों के माध्य', 'Ranges only|केवल परास', 'Sample sizes|प्रतिदर्श आकार']),
    sc('Mean, Median, Mode', 'In a normal distribution, mean = median = —', 'सामान्य बंटन में माध्य = माध्यिका = —', ['Mode|बहुलक', 'Range|परास', 'Variance|प्रसरण', 'Zero|शून्य']),
    sc('Data Collection & Presentation', 'A census is a survey in which data are collected from —', 'जनगणना में आँकड़े किससे एकत्र किए जाते हैं?', ['Every unit of the population|समष्टि की प्रत्येक इकाई', 'A small sample|एक छोटे प्रतिदर्श', 'Only urban areas|केवल शहरी क्षेत्र', 'Randomly chosen units|यादृच्छिक चुनी इकाइयाँ'])
  ];
})();
