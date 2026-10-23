/* Reference tables used to build GK / reasoning questions (bilingual). */
(function () {
  var PT = window.PT = window.PT || {};
  PT.TABLES = {
    /* country, capital, country(hi), capital(hi) */
    countryCap: [
      ['India', 'New Delhi', 'भारत', 'नई दिल्ली'], ['France', 'Paris', 'फ्रांस', 'पेरिस'], ['Japan', 'Tokyo', 'जापान', 'टोक्यो'], ['Italy', 'Rome', 'इटली', 'रोम'],
      ['Germany', 'Berlin', 'जर्मनी', 'बर्लिन'], ['Egypt', 'Cairo', 'मिस्र', 'काहिरा'], ['Nepal', 'Kathmandu', 'नेपाल', 'काठमांडू'], ['Australia', 'Canberra', 'ऑस्ट्रेलिया', 'कैनबरा'],
      ['Canada', 'Ottawa', 'कनाडा', 'ओटावा'], ['China', 'Beijing', 'चीन', 'बीजिंग'], ['Russia', 'Moscow', 'रूस', 'मॉस्को'], ['Bangladesh', 'Dhaka', 'बांग्लादेश', 'ढाका'],
      ['Spain', 'Madrid', 'स्पेन', 'मैड्रिड'], ['Brazil', 'Brasília', 'ब्राज़ील', 'ब्रासीलिया'], ['Turkey', 'Ankara', 'तुर्की', 'अंकारा'], ['Afghanistan', 'Kabul', 'अफ़ग़ानिस्तान', 'काबुल'],
      ['Bhutan', 'Thimphu', 'भूटान', 'थिंपू'], ['Argentina', 'Buenos Aires', 'अर्जेंटीना', 'ब्यूनस आयर्स'], ['Kenya', 'Nairobi', 'केन्या', 'नैरोबी'], ['Pakistan', 'Islamabad', 'पाकिस्तान', 'इस्लामाबाद'],
      ['Thailand', 'Bangkok', 'थाईलैंड', 'बैंकॉक'], ['South Korea', 'Seoul', 'दक्षिण कोरिया', 'सियोल'], ['Indonesia', 'Jakarta', 'इंडोनेशिया', 'जकार्ता'], ['Iran', 'Tehran', 'ईरान', 'तेहरान']
    ],
    /* state, capital, state(hi), capital(hi) */
    stateCap: [
      ['Andhra Pradesh', 'Amaravati', 'आंध्र प्रदेश', 'अमरावती'], ['Arunachal Pradesh', 'Itanagar', 'अरुणाचल प्रदेश', 'ईटानगर'], ['Assam', 'Dispur', 'असम', 'दिसपुर'], ['Bihar', 'Patna', 'बिहार', 'पटना'],
      ['Chhattisgarh', 'Raipur', 'छत्तीसगढ़', 'रायपुर'], ['Goa', 'Panaji', 'गोवा', 'पणजी'], ['Gujarat', 'Gandhinagar', 'गुजरात', 'गांधीनगर'], ['Haryana', 'Chandigarh', 'हरियाणा', 'चंडीगढ़'],
      ['Himachal Pradesh', 'Shimla', 'हिमाचल प्रदेश', 'शिमला'], ['Jharkhand', 'Ranchi', 'झारखंड', 'रांची'], ['Karnataka', 'Bengaluru', 'कर्नाटक', 'बेंगलुरु'], ['Kerala', 'Thiruvananthapuram', 'केरल', 'तिरुवनंतपुरम'],
      ['Madhya Pradesh', 'Bhopal', 'मध्य प्रदेश', 'भोपाल'], ['Maharashtra', 'Mumbai', 'महाराष्ट्र', 'मुंबई'], ['Manipur', 'Imphal', 'मणिपुर', 'इंफाल'], ['Meghalaya', 'Shillong', 'मेघालय', 'शिलांग'],
      ['Mizoram', 'Aizawl', 'मिज़ोरम', 'आइजोल'], ['Nagaland', 'Kohima', 'नागालैंड', 'कोहिमा'], ['Odisha', 'Bhubaneswar', 'ओडिशा', 'भुवनेश्वर'], ['Punjab', 'Chandigarh', 'पंजाब', 'चंडीगढ़'],
      ['Rajasthan', 'Jaipur', 'राजस्थान', 'जयपुर'], ['Sikkim', 'Gangtok', 'सिक्किम', 'गंगटोक'], ['Tamil Nadu', 'Chennai', 'तमिलनाडु', 'चेन्नई'], ['Telangana', 'Hyderabad', 'तेलंगाना', 'हैदराबाद'],
      ['Tripura', 'Agartala', 'त्रिपुरा', 'अगरतला'], ['Uttar Pradesh', 'Lucknow', 'उत्तर प्रदेश', 'लखनऊ'], ['Uttarakhand', 'Dehradun', 'उत्तराखंड', 'देहरादून'], ['West Bengal', 'Kolkata', 'पश्चिम बंगाल', 'कोलकाता']
    ],
    /* country, currency, country(hi), currency(hi) */
    currency: [
      ['India', 'Rupee', 'भारत', 'रुपया'], ['USA', 'US Dollar', 'अमेरिका', 'अमेरिकी डॉलर'], ['United Kingdom', 'Pound Sterling', 'यूनाइटेड किंगडम', 'पाउंड स्टर्लिंग'], ['Japan', 'Yen', 'जापान', 'येन'],
      ['China', 'Yuan', 'चीन', 'युआन'], ['Russia', 'Ruble', 'रूस', 'रूबल'], ['Saudi Arabia', 'Riyal', 'सऊदी अरब', 'रियाल'], ['Bangladesh', 'Taka', 'बांग्लादेश', 'टका'],
      ['South Korea', 'Won', 'दक्षिण कोरिया', 'वोन'], ['Thailand', 'Baht', 'थाईलैंड', 'बाट'], ['Switzerland', 'Swiss Franc', 'स्विट्ज़रलैंड', 'स्विस फ्रैंक'], ['South Africa', 'Rand', 'दक्षिण अफ्रीका', 'रैंड'],
      ['Malaysia', 'Ringgit', 'मलेशिया', 'रिंगित'], ['Indonesia', 'Rupiah', 'इंडोनेशिया', 'रुपिया'], ['Vietnam', 'Dong', 'वियतनाम', 'डोंग'], ['Turkey', 'Lira', 'तुर्की', 'लीरा'],
      ['Brazil', 'Real', 'ब्राज़ील', 'रियल'], ['France', 'Euro', 'फ्रांस', 'यूरो'], ['Israel', 'Shekel', 'इज़राइल', 'शेकेल'], ['Nepal', 'Nepalese Rupee', 'नेपाल', 'नेपाली रुपया']
    ],
    /* park, state, park(hi), state(hi) */
    parks: [
      ['Jim Corbett National Park', 'Uttarakhand', 'जिम कॉर्बेट राष्ट्रीय उद्यान', 'उत्तराखंड'], ['Kaziranga National Park', 'Assam', 'काज़ीरंगा राष्ट्रीय उद्यान', 'असम'], ['Gir National Park', 'Gujarat', 'गिर राष्ट्रीय उद्यान', 'गुजरात'],
      ['Ranthambore National Park', 'Rajasthan', 'रणथंभौर राष्ट्रीय उद्यान', 'राजस्थान'], ['Bandipur National Park', 'Karnataka', 'बांदीपुर राष्ट्रीय उद्यान', 'कर्नाटक'], ['Sundarbans National Park', 'West Bengal', 'सुंदरबन राष्ट्रीय उद्यान', 'पश्चिम बंगाल'],
      ['Periyar National Park', 'Kerala', 'पेरियार राष्ट्रीय उद्यान', 'केरल'], ['Kanha National Park', 'Madhya Pradesh', 'कान्हा राष्ट्रीय उद्यान', 'मध्य प्रदेश'], ['Keoladeo National Park', 'Rajasthan', 'केवलादेव राष्ट्रीय उद्यान', 'राजस्थान'],
      ['Manas National Park', 'Assam', 'मानस राष्ट्रीय उद्यान', 'असम'], ['Simlipal National Park', 'Odisha', 'सिमलीपाल राष्ट्रीय उद्यान', 'ओडिशा'], ['Nagarhole National Park', 'Karnataka', 'नागरहोल राष्ट्रीय उद्यान', 'कर्नाटक']
    ],
    /* dance, state, dance(hi), state(hi) */
    dance: [
      ['Kuchipudi', 'Andhra Pradesh', 'कुचिपुड़ी', 'आंध्र प्रदेश'], ['Bharatanatyam', 'Tamil Nadu', 'भरतनाट्यम', 'तमिलनाडु'], ['Odissi', 'Odisha', 'ओडिसी', 'ओडिशा'], ['Kathakali', 'Kerala', 'कथकली', 'केरल'],
      ['Manipuri', 'Manipur', 'मणिपुरी', 'मणिपुर'], ['Sattriya', 'Assam', 'सत्रिया', 'असम'], ['Bihu', 'Assam', 'बिहू', 'असम'], ['Garba', 'Gujarat', 'गरबा', 'गुजरात'], ['Bhangra', 'Punjab', 'भांगड़ा', 'पंजाब'],
      ['Ghoomar', 'Rajasthan', 'घूमर', 'राजस्थान'], ['Lavani', 'Maharashtra', 'लावणी', 'महाराष्ट्र'], ['Yakshagana', 'Karnataka', 'यक्षगान', 'कर्नाटक'], ['Chhau', 'Odisha', 'छऊ', 'ओडिशा']
    ],
    /* dam, river, dam(hi), river(hi) */
    dams: [
      ['Hirakud Dam', 'Mahanadi', 'हीराकुंड बाँध', 'महानदी'], ['Bhakra Nangal Dam', 'Sutlej', 'भाखड़ा नांगल बाँध', 'सतलुज'], ['Tehri Dam', 'Bhagirathi', 'टिहरी बाँध', 'भागीरथी'], ['Sardar Sarovar Dam', 'Narmada', 'सरदार सरोवर बाँध', 'नर्मदा'],
      ['Nagarjuna Sagar Dam', 'Krishna', 'नागार्जुन सागर बाँध', 'कृष्णा'], ['Mettur Dam', 'Cauvery', 'मेट्टूर बाँध', 'कावेरी'], ['Idukki Dam', 'Periyar', 'इडुक्की बाँध', 'पेरियार'], ['Koyna Dam', 'Koyna', 'कोयना बाँध', 'कोयना'],
      ['Tungabhadra Dam', 'Tungabhadra', 'तुंगभद्रा बाँध', 'तुंगभद्रा'], ['Maithon Dam', 'Barakar', 'मैथन बाँध', 'बराकर'], ['Gandhi Sagar Dam', 'Chambal', 'गांधी सागर बाँध', 'चंबल']
    ],
    /* date en, day en, date hi, day hi */
    days: [
      ['12 January', 'National Youth Day', '12 जनवरी', 'राष्ट्रीय युवा दिवस'], ['15 January', 'Army Day', '15 जनवरी', 'सेना दिवस'], ['25 January', 'National Voters’ Day', '25 जनवरी', 'राष्ट्रीय मतदाता दिवस'],
      ['26 January', 'Republic Day', '26 जनवरी', 'गणतंत्र दिवस'], ['30 January', 'Martyrs’ Day', '30 जनवरी', 'शहीद दिवस'], ['28 February', 'National Science Day', '28 फरवरी', 'राष्ट्रीय विज्ञान दिवस'],
      ['8 March', 'International Women’s Day', '8 मार्च', 'अंतर्राष्ट्रीय महिला दिवस'], ['22 March', 'World Water Day', '22 मार्च', 'विश्व जल दिवस'], ['7 April', 'World Health Day', '7 अप्रैल', 'विश्व स्वास्थ्य दिवस'],
      ['22 April', 'Earth Day', '22 अप्रैल', 'पृथ्वी दिवस'], ['1 May', 'International Labour Day', '1 मई', 'अंतर्राष्ट्रीय श्रमिक दिवस'], ['11 May', 'National Technology Day', '11 मई', 'राष्ट्रीय प्रौद्योगिकी दिवस'],
      ['5 June', 'World Environment Day', '5 जून', 'विश्व पर्यावरण दिवस'], ['21 June', 'International Yoga Day', '21 जून', 'अंतर्राष्ट्रीय योग दिवस'], ['15 August', 'Independence Day', '15 अगस्त', 'स्वतंत्रता दिवस'],
      ['29 August', 'National Sports Day', '29 अगस्त', 'राष्ट्रीय खेल दिवस'], ['5 September', 'Teachers’ Day', '5 सितंबर', 'शिक्षक दिवस'], ['14 September', 'Hindi Diwas', '14 सितंबर', 'हिंदी दिवस'],
      ['2 October', 'Gandhi Jayanti', '2 अक्टूबर', 'गांधी जयंती'], ['31 October', 'National Unity Day', '31 अक्टूबर', 'राष्ट्रीय एकता दिवस'], ['11 November', 'National Education Day', '11 नवंबर', 'राष्ट्रीय शिक्षा दिवस'],
      ['14 November', 'Children’s Day', '14 नवंबर', 'बाल दिवस'], ['26 November', 'Constitution Day', '26 नवंबर', 'संविधान दिवस'], ['1 December', 'World AIDS Day', '1 दिसंबर', 'विश्व एड्स दिवस'], ['4 December', 'Navy Day', '4 दिसंबर', 'नौसेना दिवस'],
      ['10 December', 'Human Rights Day', '10 दिसंबर', 'मानवाधिकार दिवस'], ['16 December', 'Vijay Diwas', '16 दिसंबर', 'विजय दिवस'], ['24 October', 'United Nations Day', '24 अक्टूबर', 'संयुक्त राष्ट्र दिवस']
    ],
    /* title, author, title(hi), author(hi) */
    books: [
      ['The Discovery of India', 'Jawaharlal Nehru', 'द डिस्कवरी ऑफ इंडिया', 'जवाहरलाल नेहरू'], ['Gitanjali', 'Rabindranath Tagore', 'गीतांजलि', 'रवींद्रनाथ टैगोर'], ['Wings of Fire', 'A. P. J. Abdul Kalam', 'विंग्स ऑफ फायर', 'ए. पी. जे. अब्दुल कलाम'],
      ['Godan', 'Premchand', 'गोदान', 'प्रेमचंद'], ['Anandamath', 'Bankim Chandra Chatterjee', 'आनंदमठ', 'बंकिमचंद्र चट्टोपाध्याय'], ['The God of Small Things', 'Arundhati Roy', 'द गॉड ऑफ स्मॉल थिंग्स', 'अरुंधति रॉय'],
      ['Malgudi Days', 'R. K. Narayan', 'मालगुडी डेज़', 'आर. के. नारायण'], ['Train to Pakistan', 'Khushwant Singh', 'ट्रेन टू पाकिस्तान', 'खुशवंत सिंह'], ['Kamayani', 'Jaishankar Prasad', 'कामायनी', 'जयशंकर प्रसाद'],
      ['Madhushala', 'Harivansh Rai Bachchan', 'मधुशाला', 'हरिवंश राय बच्चन'], ['Panchatantra', 'Vishnu Sharma', 'पंचतंत्र', 'विष्णु शर्मा'], ['Arthashastra', 'Kautilya', 'अर्थशास्त्र', 'कौटिल्य'],
      ['Rajatarangini', 'Kalhana', 'राजतरंगिणी', 'कल्हण'], ['Mudrarakshasa', 'Vishakhadatta', 'मुद्राराक्षस', 'विशाखदत्त'], ['Ain-i-Akbari', 'Abul Fazl', 'आइन-ए-अकबरी', 'अबुल फ़ज़ल'],
      ['Harshacharita', 'Banabhatta', 'हर्षचरित', 'बाणभट्ट'], ['Abhijnanashakuntalam', 'Kalidasa', 'अभिज्ञानशाकुन्तलम्', 'कालिदास'], ['Gita Govinda', 'Jayadeva', 'गीत गोविंद', 'जयदेव'],
      ['Indica', 'Megasthenes', 'इंडिका', 'मेगस्थनीज़'], ['The Origin of Species', 'Charles Darwin', 'द ओरिजिन ऑफ स्पीशीज़', 'चार्ल्स डार्विन'], ['A Brief History of Time', 'Stephen Hawking', 'अ ब्रीफ हिस्ट्री ऑफ टाइम', 'स्टीफन हॉकिंग'],
      ['Das Kapital', 'Karl Marx', 'दास कैपिटल', 'कार्ल मार्क्स'], ['The Wealth of Nations', 'Adam Smith', 'द वेल्थ ऑफ नेशंस', 'एडम स्मिथ'], ['Hind Swaraj', 'M. K. Gandhi', 'हिंद स्वराज', 'एम. के. गांधी']
    ],
    /* discovery, scientist, discovery(hi), scientist(hi) */
    inventors: [
      ['Law of Gravitation', 'Isaac Newton', 'गुरुत्वाकर्षण का नियम', 'आइज़ैक न्यूटन'], ['Penicillin', 'Alexander Fleming', 'पेनिसिलिन', 'अलेक्जेंडर फ्लेमिंग'], ['Electron', 'J. J. Thomson', 'इलेक्ट्रॉन', 'जे. जे. थॉमसन'],
      ['Atomic Nucleus', 'Ernest Rutherford', 'परमाणु नाभिक', 'अर्नेस्ट रदरफोर्ड'], ['Neutron', 'James Chadwick', 'न्यूट्रॉन', 'जेम्स चैडविक'], ['Radium', 'Marie Curie', 'रेडियम', 'मैरी क्यूरी'],
      ['Circulation of Blood', 'William Harvey', 'रक्त परिसंचरण', 'विलियम हार्वे'], ['Telephone', 'Alexander Graham Bell', 'टेलीफोन', 'अलेक्जेंडर ग्राहम बेल'], ['Electric Bulb', 'Thomas Edison', 'विद्युत बल्ब', 'थॉमस एडिसन'],
      ['Dynamite', 'Alfred Nobel', 'डायनामाइट', 'अल्फ्रेड नोबेल'], ['Smallpox Vaccine', 'Edward Jenner', 'चेचक का टीका', 'एडवर्ड जेनर'], ['X-rays', 'Wilhelm Röntgen', 'एक्स-किरणें', 'विल्हेल्म रॉन्टगन'],
      ['Periodic Table', 'Dmitri Mendeleev', 'आवर्त सारणी', 'दिमित्री मेंडेलीव'], ['Theory of Relativity', 'Albert Einstein', 'सापेक्षता का सिद्धांत', 'अल्बर्ट आइंस्टीन'], ['Raman Effect', 'C. V. Raman', 'रमन प्रभाव', 'सी. वी. रमन'],
      ['Cell', 'Robert Hooke', 'कोशिका', 'रॉबर्ट हुक'], ['Natural Selection', 'Charles Darwin', 'प्राकृतिक चयन', 'चार्ल्स डार्विन'], ['Rabies Vaccine', 'Louis Pasteur', 'रेबीज़ का टीका', 'लुई पाश्चर'],
      ['Radio (wireless telegraphy)', 'Guglielmo Marconi', 'रेडियो (बेतार तार)', 'गुग्लिल्मो मार्कोनी'], ['First powered aeroplane', 'Wright Brothers', 'पहला चालित हवाई जहाज', 'राइट बंधु']
    ],
    /* quantity, SI unit, quantity(hi), unit(hi) */
    units: [
      ['Force', 'Newton', 'बल', 'न्यूटन'], ['Work / Energy', 'Joule', 'कार्य / ऊर्जा', 'जूल'], ['Power', 'Watt', 'शक्ति', 'वाट'], ['Pressure', 'Pascal', 'दाब', 'पास्कल'], ['Frequency', 'Hertz', 'आवृत्ति', 'हर्ट्ज़'],
      ['Electric Resistance', 'Ohm', 'विद्युत प्रतिरोध', 'ओम'], ['Electric Current', 'Ampere', 'विद्युत धारा', 'एम्पियर'], ['Electric Charge', 'Coulomb', 'विद्युत आवेश', 'कूलॉम'], ['Potential Difference', 'Volt', 'विभवांतर', 'वोल्ट'],
      ['Magnetic Flux Density', 'Tesla', 'चुंबकीय क्षेत्र की तीव्रता', 'टेस्ला'], ['Capacitance', 'Farad', 'धारिता', 'फैराड'], ['Radioactivity', 'Becquerel', 'रेडियोधर्मिता', 'बेकरेल']
    ],
    /* element, symbol, element(hi), symbol */
    elements: [
      ['Gold', 'Au', 'सोना', 'Au'], ['Silver', 'Ag', 'चाँदी', 'Ag'], ['Iron', 'Fe', 'लोहा', 'Fe'], ['Sodium', 'Na', 'सोडियम', 'Na'], ['Potassium', 'K', 'पोटैशियम', 'K'], ['Lead', 'Pb', 'सीसा', 'Pb'],
      ['Mercury', 'Hg', 'पारा', 'Hg'], ['Copper', 'Cu', 'ताँबा', 'Cu'], ['Tin', 'Sn', 'टिन', 'Sn'], ['Tungsten', 'W', 'टंगस्टन', 'W'], ['Calcium', 'Ca', 'कैल्शियम', 'Ca'], ['Helium', 'He', 'हीलियम', 'He']
    ],
    /* deficiency, disease, deficiency(hi), disease(hi) */
    deficiency: [
      ['Vitamin A', 'Night blindness', 'विटामिन A', 'रतौंधी'], ['Vitamin B1 (Thiamine)', 'Beri-beri', 'विटामिन B1 (थायमिन)', 'बेरी-बेरी'], ['Vitamin C', 'Scurvy', 'विटामिन C', 'स्कर्वी'], ['Vitamin D', 'Rickets', 'विटामिन D', 'रिकेट्स'],
      ['Vitamin K', 'Delayed blood clotting', 'विटामिन K', 'रक्त का देर से थक्का जमना'], ['Vitamin B12', 'Pernicious anaemia', 'विटामिन B12', 'घातक रक्ताल्पता'], ['Iodine', 'Goitre', 'आयोडीन', 'घेंघा'], ['Iron', 'Anaemia', 'आयरन', 'रक्ताल्पता']
    ]
  };
})();
