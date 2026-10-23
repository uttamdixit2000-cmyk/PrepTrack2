/* PrepTrack — Mains-level (SSC CGL Tier-II) question bank, offline.
   Multi-step, higher-difficulty questions. Used in Tier-II daily sets. */
(function () {
  var PT = window.PT;
  function m(subj, t, q, o, a, e) { return { subj: subj, tier: 2, t: t, q: q, o: o, a: a, e: e }; }
  PT.MAINS = [
    /* ---- Quantitative Aptitude ---- */
    m('maths', 'Work & time', 'Pipe A fills a tank in 12 h, pipe B in 16 h, and pipe C empties it in 24 h. All three are opened together. How long will the tank take to fill?', ['9 h 36 min', '10 h', '8 h 30 min', '12 h'], 0, 'Net rate = 1/12 + 1/16 − 1/24 = (4 + 3 − 2)/48 = 5/48 per hour. Time = 48/5 = 9.6 h = 9 h 36 min.'),
    m('maths', 'Compound interest', 'Find the difference between compound interest and simple interest on Rs 8,000 for 2 years at 10% p.a. (compounded annually).', ['Rs 60', 'Rs 70', 'Rs 80', 'Rs 90'], 2, 'CI = 8000 × 1.21 − 8000 = 1680. SI = 8000 × 10% × 2 = 1600. Difference = 80.'),
    m('maths', 'Ratio & proportion', 'A : B = 3 : 4 and B : C = 5 : 6. If C = Rs 4,800, what is A?', ['Rs 2,400', 'Rs 3,000', 'Rs 3,600', 'Rs 3,750'], 1, 'Make B equal: A:B:C = 15:20:24. Unit = 4800/24 = 200. A = 15 × 200 = 3000.'),
    m('maths', 'Probability', 'Two fair dice are thrown. What is the probability that the sum is 9 or 10?', ['7/36', '1/6', '5/36', '1/4'], 0, 'Sum 9: 4 outcomes; sum 10: 3 outcomes. Total 7 out of 36 = 7/36.'),
    m('maths', 'Average', 'The average of five numbers is 27. When one number is removed, the average becomes 25. What is the removed number?', ['30', '32', '35', '38'], 2, 'Total of five = 135; total of four = 100. Removed number = 135 − 100 = 35.'),
    m('maths', 'Speed & distance', 'A boat goes downstream at 14 km/h. How long does it take to cover 77 km downstream?', ['4.5 h', '5 h', '5.5 h', '6 h'], 2, 'Time = Distance / Speed = 77 / 14 = 5.5 hours.'),
    m('maths', 'Algebra (identities)', 'If x + 1/x = 5, find the value of x² + 1/x².', ['21', '23', '25', '27'], 1, '(x + 1/x)² = x² + 2 + 1/x² = 25, so x² + 1/x² = 23.'),
    m('maths', 'Mensuration', 'A cone has radius 7 cm and slant height 25 cm. What is its curved surface area? (π = 22/7)', ['440 cm²', '550 cm²', '616 cm²', '704 cm²'], 1, 'CSA = π r l = (22/7) × 7 × 25 = 550 cm².'),
    m('maths', 'Trigonometry', 'Evaluate sin²30° + cos²60° + tan²45°.', ['1', '1.5', '2', '2.5'], 1, 'sin²30 = 1/4, cos²60 = 1/4, tan²45 = 1. Sum = 1.5.'),
    m('maths', 'Number system (remainders)', 'What is the remainder when 7¹⁰⁰ is divided by 5?', ['1', '2', '3', '4'], 0, '7 ≡ 2 (mod 5). 2⁴ ≡ 1 (mod 5). 100 is a multiple of 4, so 2¹⁰⁰ ≡ 1.'),
    m('maths', 'Successive discount', 'An article of Rs 1,000 is given successive discounts of 20% and 10%. What is the final price?', ['Rs 700', 'Rs 720', 'Rs 750', 'Rs 800'], 1, '1000 × 0.8 × 0.9 = 720.'),
    m('maths', 'Triangle area', 'A triangle has sides 9 cm, 12 cm and 15 cm. What is its area?', ['45 cm²', '54 cm²', '60 cm²', '72 cm²'], 1, 'It is a right triangle (9² + 12² = 15²). Area = ½ × 9 × 12 = 54 cm².'),
    m('maths', 'Permutation', 'In how many ways can the letters of the word LEVEL be arranged?', ['20', '30', '60', '120'], 1, '5!/(2! × 2!) = 120/4 = 30.'),
    m('maths', 'Time & work', 'A alone can finish a job in 10 days and B alone in 15 days. In how many days will they finish it together?', ['5', '6', '7', '8'], 1, 'Combined rate = 1/10 + 1/15 = 1/6, so 6 days.'),
    /* ---- General Intelligence & Reasoning ---- */
    m('reasoning', 'Coding-decoding', 'If MANGO is coded as NBOHP (each letter moved one place forward), how is APPLE coded?', ['BQQMF', 'BQPLF', 'BQQLF', 'CQQMF'], 0, 'Each letter moves +1: A→B, P→Q, P→Q, L→M, E→F. So BQQMF.'),
    m('reasoning', 'Blood relations', 'A is the brother of B. B is the father of C. D is the mother of C. How is A related to D?', ['Brother-in-law', 'Son-in-law', 'Cousin', 'Father'], 0, 'B and D are husband and wife (parents of C). A is B\'s brother, so A is D\'s brother-in-law.'),
    m('reasoning', 'Number series', 'Find the next term: 2, 6, 12, 20, 30, ?', ['40', '42', '44', '46'], 1, 'Differences: +4, +6, +8, +10, so the next difference is +12. 30 + 12 = 42.'),
    m('reasoning', 'Direction sense', 'A walks 10 m north, turns right and walks 6 m, then turns right again and walks 10 m. How far is he from the starting point, and in which direction?', ['0 m', '6 m east', '10 m', '16 m'], 1, 'Path: (0,0) → (0,10) → (6,10) → (6,0). He is 6 m east of the start.'),
    m('reasoning', 'Clock', 'What is the angle between the hour and minute hands of a clock at 3:30?', ['60°', '75°', '90°', '105°'], 1, 'Hour hand at 3:30 = 105°; minute hand at 30 min = 180°. Difference = 75°.'),
    m('reasoning', 'Odd one out', 'Which number does not belong: 4, 9, 25, 36, 49, 60?', ['4', '9', '60', '49'], 2, 'All others are perfect squares (2², 3², 5², 6², 7²). 60 is not.'),
    m('reasoning', 'Position & order', 'In a row of 40 students, A is 14th from the left and B is 12th from the right. How many students are between A and B?', ['13', '14', '15', '16'], 1, 'B is at position 40 − 12 + 1 = 29. Between: 29 − 14 − 1 = 14.'),
    m('reasoning', 'Ranking', 'Ravi is 8th from the top and 14th from the bottom in a class. How many students are in the class?', ['20', '21', '22', '23'], 1, 'Total = 8 + 14 − 1 = 21.'),
    m('reasoning', 'Venn & logic', 'Statement: All roses are flowers. Some flowers are red. Conclusion I: Some roses are red. Conclusion II: All flowers are roses.', ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'], 3, 'I does not necessarily follow (the red flowers may not be roses). II does not follow (not every flower is a rose).'),
    /* ---- English Language & Comprehension ---- */
    m('english', 'Idioms', 'Meaning of the idiom "to bite the dust":', ['To be defeated or to die', 'To eat food hastily', 'To clean a surface', 'To be very happy'], 0, '"To bite the dust" means to be defeated, or to die.'),
    m('english', 'Synonyms', 'Choose the synonym of EPHEMERAL:', ['Permanent', 'Fleeting', 'Ancient', 'Vast'], 1, 'Ephemeral means lasting for a very short time, like fleeting.'),
    m('english', 'Antonyms', 'Choose the antonym of BENEVOLENT:', ['Kind', 'Malevolent', 'Generous', 'Wise'], 1, 'Benevolent means well-meaning and kind; its opposite is malevolent.'),
    m('english', 'Subject-verb agreement', 'Choose the correct sentence.', ['Neither of the boys were present.', 'Neither of the boys was present.', 'Neither of the boys are present.', 'Neither of the boy were present.'], 1, '"Neither" takes a singular verb, so "was" is correct.'),
    m('english', 'Fill in the blanks', 'The committee ____ its decision after a long deliberation.', ['announced', 'announce', 'announcing', 'announces'], 0, 'The past tense "announced" fits the completed action.'),
    m('english', 'One-word substitution', 'A person who believes in the existence of only one God is called:', ['Atheist', 'Monotheist', 'Agnostic', 'Polytheist'], 1, 'Monotheist: belief in one God. Polytheist: many gods. Atheist: no god. Agnostic: unsure.'),
    m('english', 'Direct & indirect speech', 'Change into indirect speech: He said, "I am ill."', ['He said that he is ill.', 'He said that he was ill.', 'He told he was ill.', 'He said he were ill.'], 1, 'Present tense changes to past in reported speech: "am" → "was".'),
    m('english', 'Active & passive voice', 'Change into passive voice: The dog bit the boy.', ['The boy is bitten by the dog.', 'The boy was bit by the dog.', 'The boy was bitten by the dog.', 'The dog was bitten by the boy.'], 2, 'Simple past active → past passive: was/were + past participle (bitten) + by + agent.'),
    m('english', 'Spelling', 'Choose the correctly spelt word.', ['Accomodate', 'Accommodate', 'Acommodate', 'Acomodate'], 1, 'The correct spelling is "accommodate" (two c, two m).'),
    m('english', 'Reading comprehension (vocabulary in context)', '"The river had shrunk to a trickle." This means the river had:', ['Flooded the area', 'Dwindled to a small flow', 'Become deeper', 'Changed its course'], 1, 'A trickle is a thin, small flow of water, so the river had reduced greatly.'),
    m('english', 'Idioms', 'Meaning of "once in a blue moon":', ['Very often', 'Rarely', 'At night', 'Never'], 1, 'It means very rarely.'),
    /* ---- General Awareness (static + current-awareness) ---- */
    m('gk', 'Constitution', 'Which Article of the Indian Constitution deals with the Comptroller and Auditor General (CAG)?', ['Article 148', 'Article 324', 'Article 280', 'Article 315'], 0, 'Article 148 provides for the CAG. Article 324: Election Commission. Article 280: Finance Commission. Article 315: Public Service Commissions.'),
    m('gk', 'Sports history', 'Who was the first Indian woman to win an individual Olympic medal?', ['P. T. Usha', 'Karnam Malleswari', 'Saina Nehwal', 'Mary Kom'], 1, 'Karnam Malleswari won bronze in weightlifting at Sydney 2000.'),
    m('gk', 'Geography (rivers)', 'The "Marble Rocks" (Bhedaghat) are on which river?', ['Narmada', 'Tapi', 'Son', 'Mahanadi'], 0, 'Marble Rocks are on the Narmada river near Jabalpur (Madhya Pradesh).'),
    m('gk', 'Environment', 'Which tiger reserve is the largest in India by area?', ['Nagarjunsagar-Srisailam', 'Jim Corbett', 'Bandipur', 'Ranthambore'], 0, 'Nagarjunsagar-Srisailam (Andhra Pradesh / Telangana) is the largest tiger reserve in India.'),
    m('gk', 'Geography (waterfalls)', 'Which is the highest single-drop waterfall in India?', ['Dudhsagar', 'Kunchikal (Sharavathi)', 'Jog', 'Nohkalikai'], 1, 'Kunchikal Falls on the Sharavathi river, Karnataka, drops about 455 m.'),
    m('gk', 'Literature', 'Who wrote "The Discovery of India"?', ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Rabindranath Tagore', 'B. R. Ambedkar'], 1, 'Written by Jawaharlal Nehru in 1944 while in prison (Ahmednagar Fort).'),
    m('gk', 'Places', 'Which city is known as the "Pink City" of India?', ['Jodhpur', 'Jaipur', 'Udaipur', 'Bikaner'], 1, 'Jaipur, Rajasthan, is called the Pink City.'),
    m('gk', 'Parliament', 'What is the current maximum strength of the Rajya Sabha (elected + nominated)?', ['238', '245', '250', '543'], 2, 'Maximum 250 members (238 elected + 12 nominated). Current strength is about 245.'),
    m('gk', 'Institutions', 'Which organisation is headquartered in Geneva and sets global health standards?', ['WHO', 'UNESCO', 'ILO', 'IMF'], 0, 'World Health Organization (WHO), Geneva. UNESCO is in Paris; ILO is in Geneva but deals with labour; IMF is in Washington.')
  ];
})();
