/* Exam patterns, quota weights, syllabus. Patterns follow recent SSC notices — always confirm with the official notification. */
(function () {
  var PT = window.PT = window.PT || {};
  function S(n, s, q) { return { n: n, s: s, q: q }; }
  PT.EXAMS = [
    { id: 'cgl1', tier: 1, name: 'SSC CGL — Tier-I', pos: 2, neg: .5, target: 155, blocks: [{ name: 'Tier-I paper', minutes: 60, sections: [S('General Intelligence & Reasoning', 'reasoning', 25), S('General Awareness', 'gk', 25), S('Quantitative Aptitude', 'maths', 25), S('English Comprehension', 'english', 25)] }] },
    { id: 'chsl1', tier: 1, name: 'SSC CHSL — Tier-I', pos: 2, neg: .5, target: 150, blocks: [{ name: 'Tier-I paper', minutes: 60, sections: [S('English Language', 'english', 25), S('General Intelligence', 'reasoning', 25), S('Quantitative Aptitude', 'maths', 25), S('General Awareness', 'gk', 25)] }] },
    { id: 'cpo1', tier: 1, name: 'SSC CPO — Paper-I', pos: 1, neg: .25, target: 125, blocks: [{ name: 'Paper-I', minutes: 120, sections: [S('General Intelligence & Reasoning', 'reasoning', 50), S('General Knowledge & Awareness', 'gk', 50), S('Quantitative Aptitude', 'maths', 50), S('English Comprehension', 'english', 50)] }] },
    { id: 'gd1', tier: 1, name: 'SSC GD Constable (CBE)', pos: 2, neg: .5, target: 125, blocks: [{ name: 'CBE paper', minutes: 60, sections: [S('General Intelligence & Reasoning', 'reasoning', 20), S('General Knowledge & Awareness', 'gk', 20), S('Elementary Mathematics', 'maths', 20), S('English / Hindi', 'english', 20)] }] },
    { id: 'steno1', tier: 1, name: 'SSC Steno (Gr C & D) — Paper', pos: 1, neg: .25, target: 150, blocks: [{ name: 'Written paper', minutes: 120, sections: [S('General Intelligence & Reasoning', 'reasoning', 50), S('General Awareness', 'gk', 50), S('English Language & Comprehension', 'english', 100)] }] },
    { id: 'cgl2', tier: 2, name: 'SSC CGL — Tier-II Paper-I (Maths, Reasoning, English, GA, Computer)', pos: 3, neg: 1, target: 330, blocks: [
      { name: 'Section-I (Maths + Reasoning)', minutes: 60, sections: [S('Mathematical Abilities', 'maths', 30), S('Reasoning & General Intelligence', 'reasoning', 30)] },
      { name: 'Section-II (English + GA)', minutes: 60, sections: [S('English Language & Comprehension', 'english', 45), S('General Awareness', 'gk', 25)] },
      { name: 'Section-III (Computer)', minutes: 15, sections: [S('Computer Knowledge', 'computer', 20)] }] },
    { id: 'cgl2p2', tier: 2, name: 'SSC CGL — Tier-II Paper-II (Statistics)', pos: 2, neg: .5, target: 120, blocks: [{ name: 'Statistics', minutes: 120, sections: [S('Statistics', 'stats', 100)] }] },
    { id: 'cgl2p3', tier: 2, name: 'SSC CGL — Tier-II Paper-III (General Studies: Finance & Economics)', pos: 2, neg: .5, target: 120, blocks: [{ name: 'GS — Finance & Economics', minutes: 120, sections: [S('Finance & Accounts', 'finance', 40), S('Economics & Governance', 'finance', 60)] }] },
    { id: 'cpo2', tier: 2, name: 'SSC CPO — Paper-II (English Language & Comprehension)', pos: 1, neg: .25, target: 120, blocks: [{ name: 'Paper-II', minutes: 120, sections: [S('English Language & Comprehension', 'english', 200)] }] },
    { id: 'chsl2', tier: 2, name: 'SSC CHSL — Tier-II (Descriptive: Essay + Letter)', manual: true, pos: 0, neg: 0, target: 60, blocks: [{ name: 'Descriptive paper', minutes: 60, sections: [{ n: 'Essay (200–250 words)', s: 'descriptive', q: 1, max: 60 }, { n: 'Letter / Application (150–200 words)', s: 'descriptive', q: 1, max: 40 }] }] }
  ];
  PT.exam = function (id) { id = id || PT.data.settings.exam; for (var i = 0; i < PT.EXAMS.length; i++) if (PT.EXAMS[i].id === id) return PT.EXAMS[i]; return PT.EXAMS[0]; };
  PT.examSections = function (e) { var a = []; e.blocks.forEach(function (b) { b.sections.forEach(function (s) { a.push(Object.assign({ block: b.name }, s)); }); }); return a; };
  PT.examMax = function (e) { var t = 0; PT.examSections(e).forEach(function (s) { t += e.manual ? s.max : s.q * e.pos; }); return t; };
  PT.examMinutes = function (e) { var t = 0; e.blocks.forEach(function (b) { t += b.minutes; }); return t; };

  /* base share of study hours (before weak-area adjustment); sums to 1 across listed subjects */
  PT.WEIGHTS = {
    cgl1: { maths: .34, reasoning: .22, english: .24, gk: .20 },
    chsl1: { maths: .28, reasoning: .22, english: .28, gk: .22 },
    cpo1: { maths: .28, reasoning: .24, english: .24, gk: .24 },
    gd1: { maths: .28, reasoning: .28, english: .14, gk: .30 },
    steno1: { maths: 0, reasoning: .25, english: .50, gk: .25 },
    cgl2: { maths: .38, reasoning: .14, english: .30, gk: .10, computer: .08 },
    cgl2p2: { stats: .65, maths: .20, english: .15 },
    cgl2p3: { finance: .70, gk: .20, english: .10 },
    cpo2: { english: .80, reasoning: .05, gk: .05, maths: .10 },
    chsl2: { descriptive: .55, english: .30, gk: .15 }
  };
  PT.SYLLABUS = {
    maths: ['Number System', 'Simplification & BODMAS', 'Percentage', 'Ratio & Proportion', 'Average', 'Profit, Loss & Discount', 'Simple & Compound Interest', 'Time & Work', 'Pipes & Cisterns', 'Time, Speed & Distance', 'Boats & Streams', 'Mixture & Alligation', 'Algebra', 'Geometry', 'Mensuration', 'Trigonometry', 'Height & Distance', 'Data Interpretation'],
    reasoning: ['Analogy', 'Classification (Odd one out)', 'Number & Alphabet Series', 'Coding–Decoding', 'Blood Relations', 'Direction Sense', 'Ranking & Order', 'Syllogism', 'Venn Diagrams', 'Calendar & Clock', 'Mathematical Operations', 'Non-verbal (mirror, paper folding)', 'Matrix & Puzzles'],
    english: ['Synonyms & Antonyms', 'Idioms & Phrases', 'One-word Substitution', 'Spelling Correction', 'Error Spotting', 'Fill in the Blanks', 'Active–Passive Voice', 'Direct–Indirect Speech', 'Sentence Improvement', 'Para Jumbles', 'Cloze Test', 'Reading Comprehension'],
    gk: ['Ancient History', 'Medieval History', 'Modern History', 'Polity & Constitution', 'Indian Geography', 'World Geography', 'Indian Economy', 'Physics', 'Chemistry', 'Biology', 'Static GK (capitals, currencies)', 'Awards, Books & Sports', 'Important Days', 'Science & Technology'],
    computer: ['Computer Fundamentals', 'MS Word / Excel / PowerPoint', 'Internet & Email', 'Keyboard Shortcuts', 'Networking & Security'],
    stats: ['Data Collection & Presentation', 'Mean, Median, Mode', 'Dispersion (SD, variance)', 'Skewness & Kurtosis', 'Correlation & Regression', 'Probability', 'Sampling & Estimation', 'Index Numbers', 'Time Series'],
    finance: ['Financial Accounting basics', 'Corporate & Cost Accounting', 'Micro-economics', 'Macro-economics', 'Public Finance & Budget', 'Indian Economy', 'Governance & Ethics']
  };
})();
