const bcrypt = require('bcryptjs');
const db = require('./database');

async function seed() {
  console.log('🌱 Seeding EduSaarthi database...');

  // Clear existing data to allow idempotent re-seeding
  db.exec(`
    DELETE FROM mentor_requests;
    DELETE FROM quiz_attempts;
    DELETE FROM quiz_questions;
    DELETE FROM quizzes;
    DELETE FROM user_settings;
    DELETE FROM progress;
    DELETE FROM lessons;
    DELETE FROM courses;
    DELETE FROM scholarships;
    DELETE FROM mentors;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);

  // 1. Seed Demo User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Demo@123', salt);

  const userInsert = db.run(
    `INSERT INTO users (name, email, password_hash, state, preferred_language, education_level)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['Rahul Kumar', 'demo@edusaarthi.test', passwordHash, 'Jharkhand', 'hi', 'Class 10']
  );
  const demoUserId = userInsert.lastInsertRowid;
  console.log(`✓ Demo student created: demo@edusaarthi.test (ID: ${demoUserId})`);

  // 2. Seed Courses
  const courses = [
    {
      slug: 'class-10-science',
      title: 'Class 10 Science',
      title_hi: 'कक्षा 10 विज्ञान',
      category: 'Science',
      education_level: 'Class 10',
      description: 'Master core concepts of Physics, Chemistry, and Biology with everyday village and practical life examples.',
      description_hi: 'दैनिक जीवन और ग्रामीण उदाहरणों के साथ भौतिकी, रसायन और जीव विज्ञान की मुख्य अवधारणाओं को समझें।',
      icon: 'atom',
      color: '#0284C7',
      total_lessons: 5,
      order_index: 1
    },
    {
      slug: 'class-10-mathematics',
      title: 'Class 10 Mathematics',
      title_hi: 'कक्षा 10 गणित',
      category: 'Mathematics',
      education_level: 'Class 10',
      description: 'Step-by-step problem solving for numbers, algebra, geometry, and real-life mathematical reasoning.',
      description_hi: 'संख्याओं, बीजगणित, ज्यामिति और वास्तविक जीवन के गणितीय प्रश्नों का चरण-दर-चरण समाधान।',
      icon: 'calculator',
      color: '#16A34A',
      total_lessons: 5,
      order_index: 2
    },
    {
      slug: 'class-10-english',
      title: 'Class 10 English',
      title_hi: 'कक्षा 10 अंग्रेज़ी',
      category: 'English',
      education_level: 'Class 10',
      description: 'Build confidence in reading, writing formal letters, spoken conversation, and grammatical foundations.',
      description_hi: 'अंग्रेज़ी पढ़ने, औपचारिक पत्र लिखने, बातचीत करने और व्याकरण के बुनियादी नियमों में आत्मविश्वास बढ़ाएं।',
      icon: 'book-open',
      color: '#9333EA',
      total_lessons: 4,
      order_index: 3
    },
    {
      slug: 'class-10-social-science',
      title: 'Class 10 Social Science',
      title_hi: 'कक्षा 10 सामाजिक विज्ञान',
      category: 'Social Science',
      education_level: 'Class 10',
      description: 'Explore Indian history, democratic rights, resources, and rural economic livelihood systems.',
      description_hi: 'भारतीय इतिहास, लोकतांत्रिक अधिकारों, प्राकृतिक संसाधनों और ग्रामीण आजीविका प्रणालियों को समझें।',
      icon: 'globe',
      color: '#D97706',
      total_lessons: 3,
      order_index: 4
    },
    {
      slug: 'digital-literacy-cs',
      title: 'Computer Science & Digital Literacy',
      title_hi: 'कंप्यूटर विज्ञान एवं डिजिटल साक्षरता',
      category: 'Computer Science',
      education_level: 'Class 10',
      description: 'Learn computer fundamentals, internet safety, smartphone digital tools, and introductory logic.',
      description_hi: 'कंप्यूटर के बुनियादी सिद्धांत, इंटरनेट सुरक्षा, उपयोगी डिजिटल सेवाएं और कोडिंग का परिचय।',
      icon: 'laptop',
      color: '#4F46E5',
      total_lessons: 3,
      order_index: 5
    }
  ];

  const courseIds = {};
  for (const c of courses) {
    const res = db.run(
      `INSERT INTO courses (slug, title, title_hi, category, education_level, description, description_hi, icon, color, total_lessons, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [c.slug, c.title, c.title_hi, c.category, c.education_level, c.description, c.description_hi, c.icon, c.color, c.total_lessons, c.order_index]
    );
    courseIds[c.slug] = res.lastInsertRowid;
  }
  console.log(`✓ 5 Courses seeded`);

  // 3. Seed Lessons (20 lessons total)
  const lessons = [
    // Course 1: Science (5 mandatory specified lessons)
    {
      course_id: courseIds['class-10-science'],
      slug: 'chemical-reactions',
      title: 'Chemical Reactions and Equations',
      title_hi: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
      order_index: 1,
      summary: 'Understand how substances transform when old bonds break and new bonds form, with everyday agricultural and kitchen observations.',
      summary_hi: 'समझें कि रासायनिक बंध टूटने और नए बंध बनने से पदार्थ कैसे बदलते हैं, रसोई और खेती के आम उदाहरणों के साथ।',
      content: `### What is a Chemical Reaction?
A chemical reaction is a process where one or more substances (called **reactants**) react to form completely new substances with different properties (called **products**).

#### How to Identify a Chemical Change:
1. **Change in state** (e.g., liquid turning into a solid precipitate)
2. **Change in color** (e.g., iron rusting turns reddish-brown)
3. **Evolution of gas** (e.g., zinc in acid creates hydrogen gas bubbles)
4. **Change in temperature** (e.g., adding water to unslaked lime produces intense heat)

### Balanced Chemical Equations
According to the **Law of Conservation of Mass**, matter can neither be created nor destroyed in a chemical reaction. Therefore:
*The total number of atoms of each element on the reactant side must equal the total number of atoms on the product side.*

For example:
$$\\text{CH}_4 + 2\\text{O}_2 \\rightarrow \\text{CO}_2 + 2\\text{H}_2\\text{O} + \\text{Heat}$$`,
      content_hi: `### रासायनिक अभिक्रिया क्या है?
रासायनिक अभिक्रिया वह प्रक्रिया है जिसमें एक या एक से अधिक पदार्थ (जिन्हें **अभिकारक** कहा जाता है) आपस में मिलकर नए गुणों वाले नए पदार्थ (जिन्हें **उत्पाद** कहा जाता है) बनाते हैं।

#### रासायनिक परिवर्तन के मुख्य संकेत:
1. **अवस्था में परिवर्तन** (जैसे दूध का दही में बदलना)
2. **रंग में परिवर्तन** (जैसे लोहे के औजारों पर लाल-भूरे रंग का जंग लगना)
3. **गैस का निकलना** (जैसे चूने के पानी में बुलबुले बनना)
4. **तापमान में परिवर्तन** (जैसे बिना बुझे चूने में पानी डालने पर गर्मी निकलना)

### संतुलित रासायनिक समीकरण
**द्रव्यमान संरक्षण के नियम** के अनुसार, किसी भी रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण होता है और न ही विनाश। इसलिए अभिकारक और उत्पाद दोनों तरफ प्रत्येक तत्व के परमाणुओं की संख्या बराबर होनी चाहिए।`,
      examples: `**Everyday Village Observation:**
1. **Slaking of Lime (सफेदी की तैयारी):** When quicklime (CaO) is soaked in water for whitewashing house walls, it sizzles vigorously and becomes calcium hydroxide [Ca(OH)2], releasing huge heat.
2. **Rusting of Iron Plow:** An iron plow blade left out in monsoon dampness reacts with atmospheric oxygen and moisture to form hydrated ferric oxide (rust).`,
      examples_hi: `**दैनिक जीवन के उदाहरण:**
1. **दीवारों की सफेदी:** जब बिना बुझे चूने (CaO) में पानी डाला जाता है, तो सनसनाहट के साथ भारी मात्रा में ऊष्मा निकलती है और बुझा हुआ चूना [Ca(OH)2] बनता है।
2. **लोहे के हल में जंग लगना:** बरसात में नमी और हवा के संपर्क में आने से लोहे के औजारों पर लाल-भूरे रंग की परत जम जाती है।`,
      key_points: JSON.stringify([
        'Reactants transform into products with entirely new physical and chemical properties.',
        'Mass is always conserved: balance equations by changing coefficients, never chemical formulas.',
        'Exothermic reactions release heat (like respiration); endothermic reactions absorb heat (like photosynthesis).'
      ]),
      key_points_hi: JSON.stringify([
        'अभिकारक नए रासायनिक गुणों वाले उत्पादों में परिवर्तित होते हैं।',
        'द्रव्यमान सदैव संरक्षित रहता है: केवल गुणांक बदलें, रासायनिक सूत्र कभी न बदलें।',
        'ऊष्माक्षेपी अभिक्रियाओं में ऊष्मा निकलती है (जैसे श्वसन), ऊष्माशोषी में ऊष्मा सोखी जाती है।'
      ]),
      quiz_data: JSON.stringify([
        {
          question: 'What is formed when Quicklime (CaO) reacts vigorously with water?',
          options: ['Calcium Carbonate', 'Slaked Lime [Ca(OH)2]', 'Calcium Chloride', 'Oxygen gas'],
          answer: 1,
          explanation: 'Calcium oxide reacts vigorously with water to produce slaked lime (calcium hydroxide) releasing a large amount of heat.'
        },
        {
          question: 'Why do we balance chemical equations?',
          options: ['To look neat', 'To satisfy the Law of Conservation of Mass', 'To increase speed', 'To produce more gas'],
          answer: 1,
          explanation: 'Chemical equations must be balanced to satisfy the Law of Conservation of Mass: atoms are neither created nor destroyed.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-science'],
      slug: 'acids-bases-salts',
      title: 'Acids, Bases and Salts',
      title_hi: 'अम्ल, क्षारक एवं लवण',
      order_index: 2,
      summary: 'Distinguish between sour acids and bitter bases, understand the pH scale, and explore common salts used in every household.',
      summary_hi: 'खट्टे अम्ल और कड़वे क्षारकों में अंतर समझें, pH स्केल जानें और घर-घर में उपयोग होने वाले लवणों के बारे में पढ़ें।',
      content: `### Nature of Acids and Bases
- **Acids:** Sour in taste, turn blue litmus paper red, release $H^+$ ions in aqueous solution (e.g., citric acid in lemons, acetic acid in vinegar).
- **Bases:** Bitter in taste, soapy to touch, turn red litmus paper blue, release $OH^-$ ions in water (e.g., soap solution, baking soda, slaked lime).

### The pH Scale (Power of Hydrogen)
The pH scale measures how acidic or basic a water-based solution is:
- **pH < 7:** Acidic (stomach acid is ~1.5 - 2.0; lemon juice is ~2.2)
- **pH = 7:** Neutral (pure drinking water)
- **pH > 7:** Basic (blood is ~7.4; soap solution is ~9-10; milk of magnesia is ~10.5)

### Neutralization Reaction
When an acid and a base react, they neutralize each other to produce salt and water:
$$\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water}$$
$$\\text{HCl} + \\text{NaOH} \\rightarrow \\text{NaCl} + \\text{H}_2\\text{O}$$`,
      content_hi: `### अम्ल और क्षारक की पहचान
- **अम्ल:** स्वाद में खट्टे होते हैं, नीले लिटमस को लाल कर देते हैं और जल में $H^+$ आयन देते हैं (जैसे नींबू, इमली, सिरका)।
- **क्षारक:** स्वाद में कड़वे और छूने में साबुन जैसे चिकने होते हैं, लाल लिटमस को नीला करते हैं और जल में $OH^-$ आयन देते हैं (जैसे चूना, साबुन, बेकिंग सोडा)।

### pH पैमाना
pH पैमाना किसी विलयन में हाइड्रोजन आयन की सांद्रता मापता है:
- **pH 7 से कम:** अम्लीय विलयन
- **pH 7:** उदासीन (शुद्ध जल)
- **pH 7 से अधिक:** क्षारकीय विलयन`,
      examples: `**Everyday Remedy:**
When someone suffers from stomach acidity after heavy meals, taking an antacid (a mild base like Baking Soda or Milk of Magnesia) neutralizes the excess stomach acid and provides rapid relief.`,
      examples_hi: `**घरेलू उपाय:**
जब पेट में अधिक अम्लता (एसिडिटी) हो जाती है, तो हल्का क्षारक जैसे बेकिंग सोडा या मिल्क ऑफ मैग्नीशिया लेने से अतिरिक्त अम्ल उदासीन हो जाता है और तुरंत आराम मिलता है।`,
      key_points: JSON.stringify([
        'Acids produce H+ ions; Bases produce OH- ions in water.',
        'pH of soil directly influences crop yield; farmers add lime to overly acidic fields.',
        'Common salt (NaCl) is the raw material for making baking soda, washing soda, and bleaching powder.'
      ]),
      key_points_hi: JSON.stringify([
        'अम्ल जल में H+ आयन और क्षारक OH- आयन प्रदान करते हैं।',
        'मिट्टी का pH फसल की पैदावार तय करता है; किसान अम्लीय खेत में चूना मिलाते हैं।',
        'साधारण नमक (NaCl) बेकिंग सोडा, धावन सोडा और ब्लीचिंग पाउडर बनाने का आधार है।'
      ]),
      quiz_data: JSON.stringify([
        {
          question: 'What color does blue litmus paper turn when dipped in lemon juice?',
          options: ['Yellow', 'Red', 'Green', 'No change'],
          answer: 1,
          explanation: 'Lemon juice contains citric acid, which turns blue litmus paper red.'
        },
        {
          question: 'What is the pH value of pure neutral water at room temperature?',
          options: ['0', '7', '14', '5.5'],
          answer: 1,
          explanation: 'Pure water is neutral and has a pH of exactly 7.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-science'],
      slug: 'life-processes',
      title: 'Life Processes: Nutrition, Respiration & Transport',
      title_hi: 'जैव प्रक्रम: पोषण, श्वसन एवं वहन',
      order_index: 3,
      summary: 'Explore the fundamental bodily processes that maintain life: nutrition, cellular respiration, transport, and excretion.',
      summary_hi: 'सजीवों के जीवन को बनाए रखने वाले आवश्यक प्रक्रमों जैसे पोषण, श्वसन, परिवहन और उत्सर्जन को विस्तार से समझें।',
      content: `### What are Life Processes?
The maintenance functions of living organisms must go on even when they are asleep. The basic biological processes essential for maintaining life are **Nutrition**, **Respiration**, **Transportation**, and **Excretion**.

### 1. Autotrophic Nutrition (Photosynthesis)
Green plants capture sunlight energy using **chlorophyll** to convert water and carbon dioxide into glucose:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{Chlorophyll}]{\\text{Sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

Key stages:
1. Absorption of light energy by chlorophyll.
2. Conversion of light energy to chemical energy and splitting of water molecules into hydrogen and oxygen.
3. Reduction of carbon dioxide to carbohydrates.

### 2. Human Transportation
The human heart is a muscular pump with 4 chambers (two atria and two ventricles) ensuring oxygen-rich blood does not mix with carbon dioxide-rich blood.`,
      content_hi: `### जैव प्रक्रम क्या हैं?
वे सभी प्रक्रम जो संयुक्त रूप से सजीवों के शरीर की मरम्मत और रख-रखाव का कार्य करते हैं, जैव प्रक्रम कहलाते हैं। इसमें मुख्य रूप से **पोषण**, **श्वसन**, **वहन** और **उत्सर्जन** शामिल हैं।

### 1. प्रकाश संश्लेषण (Photosynthesis)
पौधे सूर्य के प्रकाश और क्लोरोफिल की उपस्थिति में वायु से कार्बन डाइऑक्साइड ($CO_2$) और भूमि से जल ($H_2O$) लेकर कार्बोहाइड्रेट (ग्लूकोज) और ऑक्सीजन बनाते हैं:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\rightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$`,
      examples: `**Nature Connection:**
Plants open their microscopic leaf pores (stomata) to exchange gases. During dry afternoons, desert and dry-region plants close their stomata to prevent excessive water loss by transpiration.`,
      examples_hi: `**प्रकृति से जुड़ाव:**
पत्तियों की निचली सतह पर छोटे-छोटे छिद्र (रंध्र / स्टोमेटा) होते हैं जिनसे गैसों का आदान-प्रदान होता है। दोपहर की तेज धूप में पानी की बर्बादी रोकने के लिए रंध्र बंद हो जाते हैं।`,
      key_points: JSON.stringify([
        'Autotrophs make their own food; heterotrophs depend directly or indirectly on autotrophs.',
        'Stomata regulate gas exchange and transpiration using guard cells.',
        'Xylem transports water and minerals upward; Phloem transports food prepared in leaves.'
      ]),
      key_points_hi: JSON.stringify([
        'स्वपोषी अपना भोजन स्वयं बनाते हैं; विषमपोषी दूसरों पर निर्भर होते हैं।',
        'रंध्र (स्टोमेटा) द्वार कोशिकाओं द्वारा गैसों का आदान-प्रदान नियंत्रित करते हैं।',
        'जाइलम जड़ों से जल और खनिज पहुंचाता है; फ्लोएम पत्तियों में बने भोजन का संवहन करता है।'
      ]),
      quiz_data: JSON.stringify([
        {
          question: 'Which plant tissue is responsible for carrying water from roots to leaves?',
          options: ['Phloem', 'Xylem', 'Cortex', 'Pith'],
          answer: 1,
          explanation: 'Xylem conducts water and dissolved minerals upward from roots throughout the plant.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-science'],
      slug: 'light-reflection-refraction',
      title: 'Light - Reflection and Refraction',
      title_hi: 'प्रकाश - परावर्तन तथा अपवर्तन',
      order_index: 4,
      summary: 'Discover how curved mirrors form images, why pencils look bent in water, and the formulas behind lenses and spectacles.',
      summary_hi: 'गोलीय दर्पणों से बनने वाले प्रतिबिंब, पानी में रखी पेंसिल का मुड़ा दिखना और चश्मे के लेंस का रहस्य समझें।',
      content: `### Laws of Reflection
1. The angle of incidence ($\\angle i$) is always equal to the angle of reflection ($\\angle r$).
2. The incident ray, reflected ray, and normal at the point of incidence all lie in the same plane.

### Spherical Mirrors
- **Concave Mirror (अभिसारी):** Curves inward. Used in headlights, solar cookers, and dentist mirrors because it can focus light or form enlarged upright images when placed close.
- **Convex Mirror (अपसारी):** Curves outward. Gives an upright, diminished image with a very wide field of view. Used as vehicle rear-view mirrors.

### Refraction of Light
When light passes from one transparent medium to another with different optical density (e.g., from air to water or glass), its speed changes, causing it to bend.
- Denser to rarer medium: bends **away** from the normal.
- Rarer to denser medium: bends **towards** the normal.`,
      content_hi: `### परावर्तन के नियम
1. आपतन कोण ($\\angle i$) सदैव परावर्तन कोण ($\\angle r$) के बराबर होता है।
2. आपतित किरण, परावर्तित किरण तथा आपतन बिंदु पर अभिलंब तीनों एक ही तल में होते हैं।

### गोलीय दर्पण
- **अवतल दर्पण:** अंदर की ओर मुड़ा होता है। इसका उपयोग टॉर्च, गाड़ियों की हेडलाइट और सौर कुकर में प्रकाश को एक जगह केंद्रित करने के लिए किया जाता है।
- **उत्तल दर्पण:** बाहर की ओर उभरा होता है। यह हमेशा सीधा और छोटा प्रतिबिंब बनाता है, जिससे पीछे का बहुत बड़ा क्षेत्र दिखाई देता है (गाड़ियों का साइड मिरर)।`,
      examples: `**Observing Refraction in a Village Well or Bucket:**
If you place a straight wooden stick into a clear bucket of water, the stick appears broken or bent at the water surface due to the bending of light rays as they leave water into air.`,
      examples_hi: `**बाल्टी में अपवर्तन का प्रयोग:**
पानी से भरी बाल्टी में जब आप एक सीधी छड़ी या पेंसिल डालते हैं, तो पानी की सतह पर वह मुड़ी हुई नजर आती है क्योंकि प्रकाश पानी से हवा में आते समय मुड़ जाता है।`,
      key_points: JSON.stringify([
        'Convex mirrors are used in car rear-view mirrors because they always give an erect image with a wide rear view.',
        'Refraction is caused by the change in speed of light as it moves between different media.',
        'Power of a lens is measured in Dioptres (D = 1/f in meters).'
      ]),
      key_points_hi: JSON.stringify([
        'उत्तल दर्पण गाड़ियों के साइड मिरर में लगते हैं क्योंकि वे सीधा प्रतिबिंब और विस्तृत दृष्टि-क्षेत्र देते हैं।',
        'प्रकाश की चाल बदलने के कारण अपवर्तन (मुड़ना) होता है।',
        'लेंस की क्षमता का मात्रक डायोप्टर (D = 1/f मीटर में) होता है।'
      ]),
      quiz_data: JSON.stringify([
        {
          question: 'Why are convex mirrors preferred as vehicle rear-view mirrors?',
          options: ['They show magnified upside-down images', 'They show erect images and offer a much wider field of view', 'They absorb sunlight', 'They cost nothing'],
          answer: 1,
          explanation: 'Convex mirrors always provide an upright, diminished view, giving drivers a comprehensive view of the traffic behind them.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-science'],
      slug: 'electricity',
      title: 'Electricity: Circuits, Ohm’s Law & Power',
      title_hi: 'विद्युत: परिपथ, ओम का नियम एवं शक्ति',
      order_index: 5,
      summary: 'Master electrical current, voltage differences, Ohm’s law, domestic wiring, and electrical energy conservation.',
      summary_hi: 'विद्युत धारा, विभवांतर, ओम का नियम, घरेलू वायरिंग और बिजली की बचत के सिद्धांतों को स्पष्ट समझें।',
      content: `### Electric Current and Circuit
An electric current ($I$) is defined as the rate of flow of electric charges through a conductor:
$$I = \\frac{Q}{t}$$
The SI unit of electric charge is Coulomb ($C$) and electric current is Ampere ($A$).

### Ohm's Law
At a constant temperature, the electric current flowing through a metallic conductor is directly proportional to the potential difference ($V$) across its ends:
$$V \\propto I \\implies V = I \\times R$$
Where $R$ is the electrical **Resistance** of the conductor, measured in Ohms ($\\Omega$).

### Resistors in Series and Parallel
- **Series:** $R_{\\text{eq}} = R_1 + R_2 + R_3$ (current is constant; if one breaks, all go out).
- **Parallel:** $\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\frac{1}{R_3}$ (voltage is equal across each branch; ideal for home wiring).`,
      content_hi: `### विद्युत धारा और परिपथ
किसी चालक तार में विद्युत आवेश के प्रवाह की दर को **विद्युत धारा** ($I$) कहते हैं:
$$I = \\frac{Q}{t}$$
विद्युत धारा का SI मात्रक **एम्पीयर** ($A$) होता है।

### ओम का नियम
नियत ताप पर किसी चालक के सिरों के बीच का विभवांतर ($V$) उसमें बहने वाली धारा ($I$) के समानुपाती होता है:
$$V = I \\times R$$
जहाँ $R$ चालक का **प्रतिरोध** है, जिसका मात्रक ओम ($\\Omega$) होता है।`,
      examples: `**Solar Lanterns in Off-Grid Hamlets:**
In rural solar home lights, 12V DC storage batteries feed LED lamps wired in parallel so that switching off the porch light does not cut power to the study bulb or charging socket.`,
      examples_hi: `**सोलर लाइट का व्यावहारिक उदाहरण:**
गांवों में सोलर बैटरी से चलने वाली लाइटें समानांतर क्रम (Parallel) में जुड़ी होती हैं, ताकि अगर आंगन का बल्ब बंद भी किया जाए, तो कमरे की लाइट और मोबाइल चार्जिंग चलती रहे।`,
      key_points: JSON.stringify([
        'Current is charge over time (I = Q/t).',
        'Ohm’s law relates Voltage, Current, and Resistance (V = IR).',
        'Homes are wired in parallel so each appliance receives full standard voltage independently.'
      ]),
      key_points_hi: JSON.stringify([
        'धारा आवेश प्रवाह की दर है (I = Q/t)।',
        'ओम का नियम विभवांतर, धारा और प्रतिरोध को जोड़ता है (V = IR)।',
        'घरों में उपकरण समानांतर क्रम में जोड़े जाते हैं ताकि सबको पूरी वोल्टेज मिले।'
      ]),
      quiz_data: JSON.stringify([
        {
          question: 'If a 12V battery produces a 3A current in a coil, what is the resistance?',
          options: ['36 Ohms', '4 Ohms', '15 Ohms', '0.25 Ohms'],
          answer: 1,
          explanation: 'Using Ohm’s Law: R = V / I = 12 / 3 = 4 Ohms.'
        }
      ])
    },

    // Course 2: Mathematics (5 lessons)
    {
      course_id: courseIds['class-10-mathematics'],
      slug: 'real-numbers',
      title: 'Real Numbers & Fundamental Theorem of Arithmetic',
      title_hi: 'वास्तविक संख्याएं एवं अंकगणित की आधारभूत प्रमेय',
      order_index: 1,
      summary: 'Explore prime factorizations, HCF and LCM calculations, and proving irrationality of square roots.',
      summary_hi: 'अभाज्य गुणनखंडन, म.स. (HCF) और ल.स. (LCM) की गणना तथा अपरिमेय संख्याओं के प्रमाण।',
      content: `### Fundamental Theorem of Arithmetic
Every composite number can be expressed (factorized) as the product of primes uniquely, apart from the order in which the prime factors occur.

#### HCF and LCM Relationship:
For any two positive integers $a$ and $b$:
$$\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b$$`,
      content_hi: `### अंकगणित की आधारभूत प्रमेय
प्रत्येक भाज्य संख्या को अभाज्य संख्याओं के एक गुणनफल के रूप में व्यक्त किया जा सकता है।

#### म.स. और ल.स. का संबंध:
किन्हीं दो धनात्मक पूर्णांकों $a$ और $b$ के लिए:
$$\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b$$`,
      examples: `**Tiling a Courtyard:**
Finding the largest square tile to pave a 12m by 18m veranda without cutting any tile requires finding the HCF(12, 18) = 6 meters.`,
      examples_hi: `**आंगन में टाइल लगाना:**
12 मीटर लंबे और 18 मीटर चौड़े दालान में बिना काटे सबसे बड़ी वर्गाकार टाइल लगाने के लिए 12 और 18 का HCF = 6 मीटर होगा।`,
      key_points: JSON.stringify(['Prime factorization is unique.', 'HCF x LCM = Product of two numbers.', 'Square root of any prime is irrational.']),
      key_points_hi: JSON.stringify(['अभाज्य गुणनखंड अद्वितीय होता है।', 'HCF x LCM = दोनों संख्याओं का गुणनफल।', 'अभाज्य संख्या का वर्गमूल अपरिमेय होता है।']),
      quiz_data: JSON.stringify([
        {
          question: 'If HCF(a, b) = 4 and a * b = 120, what is LCM(a, b)?',
          options: ['480', '30', '16', '124'],
          answer: 1,
          explanation: 'LCM = (a * b) / HCF = 120 / 4 = 30.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-mathematics'],
      slug: 'polynomials',
      title: 'Polynomials and Zeroes',
      title_hi: 'बहुपद और उनके शून्यक',
      order_index: 2,
      summary: 'Learn quadratic polynomials, relationships between coefficients and zeroes, and graph intersections.',
      summary_hi: 'द्विघात बहुपद, गुणांकों और शून्यकों के बीच संबंध और आलेखीय विधि।',
      content: `For a quadratic polynomial $ax^2 + bx + c$, if $\\alpha$ and $\\beta$ are zeroes:
- Sum of zeroes: $\\alpha + \\beta = -\\frac{b}{a}$
- Product of zeroes: $\\alpha \\cdot \\beta = \\frac{c}{a}$`,
      content_hi: `द्विघात बहुपद $ax^2 + bx + c$ के लिए, यदि शून्यक $\\alpha$ और $\\beta$ हैं:
- शून्यकों का योग: $\\alpha + \\beta = -\\frac{b}{a}$
- शून्यकों का गुणनफल: $\\alpha \\cdot \\beta = \\frac{c}{a}$`,
      examples: `In projectile motion (throwing a cricket ball or stone), the path follows a parabolic curve represented by a quadratic polynomial.`,
      examples_hi: `क्रिकेट की गेंद या पत्थर फेंकने पर उसका मार्ग एक परवलय (Parabola) बनाता है जिसे द्विघात बहुपद से दर्शाते हैं।`,
      key_points: JSON.stringify(['The degree tells the maximum number of zeroes.', 'The graph cuts x-axis at its real zeroes.']),
      key_points_hi: JSON.stringify(['बहुपद की घात उसके अधिकतम शून्यकों की संख्या बताती है।', 'ग्राफ x-अक्ष को शून्यकों पर काटता है।']),
      quiz_data: JSON.stringify([
        {
          question: 'What is the sum of zeroes for x^2 - 5x + 6?',
          options: ['-5', '5', '6', '-6'],
          answer: 1,
          explanation: 'Sum = -(-5)/1 = 5.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-mathematics'],
      slug: 'linear-equations',
      title: 'Pair of Linear Equations in Two Variables',
      title_hi: 'दो चरों वाले रैखिक समीकरण युग्म',
      order_index: 3,
      summary: 'Solve simultaneous equations using elimination, substitution, and graphical intersection methods.',
      summary_hi: 'विलोपन, प्रतिस्थापन और आलेखीय विधियों से दो अज्ञात मानों को ज्ञात करना सीखें।',
      content: `A pair of linear equations $a_1x + b_1y + c_1 = 0$ and $a_2x + b_2y + c_2 = 0$ has:
- Exactly one unique solution if $\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2}$ (Intersecting lines)
- Infinitely many solutions if $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} = \\frac{c_1}{c_2}$ (Coincident lines)
- No solution if $\\frac{a_1}{a_2} = \\frac{b_1}{b_2} \\neq \\frac{c_1}{c_2}$ (Parallel lines)`,
      content_hi: `दो चरों वाले समीकरणों के हल:
- अद्वितीय हल: $\\frac{a_1}{a_2} \\neq \\frac{b_1}{b_2}$
- अनंत हल: तीनों अनुपात बराबर होने पर
- कोई हल नहीं: रेखाएं समानांतर होने पर`,
      examples: `Cost of 2 notebooks and 3 pens is Rs 70. Cost of 4 notebooks and 1 pen is Rs 90. Finding the cost of each item uses two linear equations.`,
      examples_hi: `2 कॉपियों और 3 पेनों का मूल्य ₹70 है। 4 कॉपियों और 1 पेन का मूल्य ₹90 है। प्रत्येक का मूल्य ज्ञात करने के लिए दो चरों वाले समीकरण का उपयोग होता है।`,
      key_points: JSON.stringify(['Substitution or elimination methods simplify calculations.', 'Parallel lines never intersect, yielding no common solution.']),
      key_points_hi: JSON.stringify(['विलोपन और प्रतिस्थापन विधियों से आसानी से हल निकलता है।', 'समानांतर रेखाएं कभी नहीं मिलतीं, इसलिए कोई हल नहीं होता।']),
      quiz_data: JSON.stringify([
        {
          question: 'If two lines are parallel, how many solutions exist?',
          options: ['One', 'Two', 'Infinite', 'Zero'],
          answer: 3,
          explanation: 'Parallel lines never meet at any point, so there is zero (no) solution.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-mathematics'],
      slug: 'quadratic-equations',
      title: 'Quadratic Equations & The Quadratic Formula',
      title_hi: 'द्विघात समीकरण एवं श्रीधराचार्य सूत्र',
      order_index: 4,
      summary: 'Solve second-degree equations with the discriminant ($b^2 - 4ac$) and quadratic formula.',
      summary_hi: 'विविक्तकर ($b^2 - 4ac$) और द्विघाती सूत्र द्वारा अज्ञात समीकरणों को हल करें।',
      content: `Roots of $ax^2 + bx + c = 0$ are given by:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
- If $D = b^2 - 4ac > 0$: two distinct real roots.
- If $D = 0$: two equal real roots.
- If $D < 0$: no real roots.`,
      content_hi: `द्विघात समीकरण $ax^2 + bx + c = 0$ के मूल:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
- यदि $D > 0$: दो भिन्न वास्तविक मूल।
- यदि $D = 0$: दो बराबर वास्तविक मूल।
- यदि $D < 0$: कोई वास्तविक मूल नहीं।`,
      examples: `Calculating the speed of a stream or river current when a boat travels upstream and downstream.`,
      examples_hi: `नदी के बहाव के अनुकूल और प्रतिकूल नाव चलाने पर चाल की गणना करना।`,
      key_points: JSON.stringify(['Discriminant determines the nature of roots.', 'Quadratic formula solves any quadratic equation reliably.']),
      key_points_hi: JSON.stringify(['विविक्तकर मूलों की प्रकृति तय करता है।', 'द्विघाती सूत्र हर द्विघात समीकरण को हल कर सकता है।']),
      quiz_data: JSON.stringify([
        {
          question: 'What is the discriminant of x^2 - 4x + 4 = 0?',
          options: ['16', '0', '-4', '8'],
          answer: 1,
          explanation: 'D = (-4)^2 - 4(1)(4) = 16 - 16 = 0 (two equal real roots).'
        }
      ])
    },
    {
      course_id: courseIds['class-10-mathematics'],
      slug: 'arithmetic-progressions',
      title: 'Arithmetic Progressions (AP)',
      title_hi: 'समानांतर श्रेढ़ी (AP)',
      order_index: 5,
      summary: 'Find the nth term and sum of sequences where terms increase or decrease by a constant difference.',
      summary_hi: 'निश्चित अंतर से बढ़ने या घटने वाली संख्याओं के nवें पद और योगफल की गणना करें।',
      content: `In an Arithmetic Progression with first term $a$ and common difference $d$:
- $n$-th term: $a_n = a + (n - 1)d$
- Sum of first $n$ terms: $S_n = \\frac{n}{2}[2a + (n - 1)d] = \\frac{n}{2}(a + l)$`,
      content_hi: `प्रथम पद $a$ और सार्व अंतर $d$ वाली AP के लिए:
- $n$वां पद: $a_n = a + (n - 1)d$
- प्रथम $n$ पदों का योग: $S_n = \\frac{n}{2}[2a + (n - 1)d]$`,
      examples: `A student saves Rs 50 in month 1, Rs 75 in month 2, Rs 100 in month 3. Here a=50, d=25. In month 12 she saves 50 + 11*25 = Rs 325.`,
      examples_hi: `एक छात्र पहले महीने ₹50, दूसरे महीने ₹75 और तीसरे महीने ₹100 बचाता है। 12वें महीने की बचत की गणना AP से की जा सकती है।`,
      key_points: JSON.stringify(['Constant difference between consecutive terms is d.', 'Sum formula quickly totals large sequences.']),
      key_points_hi: JSON.stringify(['दो लगातार पदों का अंतर सदैव समान (d) रहता है।', 'योग सूत्र से लंबी श्रृंखलाओं का योग तुरंत मिल जाता है।']),
      quiz_data: JSON.stringify([
        {
          question: 'In the AP 3, 7, 11, 15..., what is the 10th term?',
          options: ['39', '43', '36', '40'],
          answer: 0,
          explanation: 'a10 = 3 + (10 - 1)*4 = 3 + 36 = 39.'
        }
      ])
    },

    // Course 3: English (4 lessons)
    {
      course_id: courseIds['class-10-english'],
      slug: 'formal-letter-writing',
      title: 'Formal Letter Writing (Applications & Complaints)',
      title_hi: 'औपचारिक पत्र लेखन (आवेदन एवं शिकायत पत्र)',
      order_index: 1,
      summary: 'Master standard formal letter formats for village panchayats, school principals, and government officers.',
      summary_hi: 'विद्यालय प्रधानाचार्य, ग्राम पंचायत और सरकारी अधिकारियों को औपचारिक पत्र लिखने का सही प्रारूप।',
      content: `### Structure of a Formal Letter
1. **Sender’s Address:** Top left corner.
2. **Date:** e.g., 28 September 2026.
3. **Receiver’s Designation and Address:** (e.g., The Principal / The Block Development Officer).
4. **Subject Line:** Concise and clear (e.g., *Subject: Application for Scholarship Certificate*).
5. **Salutation:** Respected Sir / Madam.
6. **Body:** 
   - Opening (state purpose clearly)
   - Details/Facts
   - Polite closing request
7. **Complimentary Close:** *Yours faithfully* or *Yours sincerely*.`,
      content_hi: `### औपचारिक पत्र का प्रारूप
1. प्रेषक का पता
2. दिनांक
3. प्राप्तकर्ता का पद एवं पता (जैसे प्रधानाचार्य / प्रखंड विकास पदाधिकारी)
4. विषय (संक्षिप्त और स्पष्ट)
5. महोदय / महोदया
6. मुख्य विषय-वस्तु (समस्या या अनुरोध)
7. आपका आज्ञाकारी छात्र / भवदीय`,
      examples: `Writing an application requesting a fee concession or certificate from your school headmaster.`,
      examples_hi: `शुल्क माफी या चरित्र प्रमाण पत्र प्राप्त करने के लिए प्रधानाचार्य को आवेदन पत्र।`,
      key_points: JSON.stringify(['Always include a clear subject line.', 'Maintain a polite, respectful, and factual tone.']),
      key_points_hi: JSON.stringify(['विषय रेखा सदैव स्पष्ट रखें।', 'विनम्र और सम्मानजनक भाषा का प्रयोग करें।']),
      quiz_data: JSON.stringify([
        {
          question: 'Where is the Subject line placed in a formal letter?',
          options: ['At the very end', 'Before the sender address', 'Between Receiver address and Salutation', 'On the envelope only'],
          answer: 2,
          explanation: 'The subject line is placed right above or below the salutation after the receiver’s address.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-english'],
      slug: 'tenses-and-verbs',
      title: 'Essential Tenses for Daily Communication',
      title_hi: 'दैनिक बातचीत के लिए आवश्यक Tenses (काल)',
      order_index: 2,
      summary: 'Confidently use Present, Past, and Future tenses in spoken and written English.',
      summary_hi: 'वर्तमान, भूत और भविष्य काल का सही प्रयोग करके धाराप्रवाह वाक्य बनाना सीखें।',
      content: `### The Three Main Tenses
1. **Simple Present:** For routines, habits, universal truths. *(I walk to school every morning. The sun rises in the east.)*
2. **Simple Past:** For finished actions at a specific past time. *(Yesterday, we visited the community health center.)*
3. **Simple Future:** For decisions, promises, and future actions. *(I will study computer programming after school.)*`,
      content_hi: `### तीन मुख्य काल
1. **Present Tense (वर्तमान):** नित्य कर्म और आदतें (जैसे: मैं रोज स्कूल जाता हूँ)।
2. **Past Tense (भूतकाल):** बीती हुई बातें (जैसे: हमने कल परीक्षा दी)।
3. **Future Tense (भविष्यकाल):** आने वाले समय के कार्य (जैसे: मैं खूब मेहनत करूँगा)।`,
      examples: `Daily conversation: "Do you understand this question?" vs "Did you finish the homework yesterday?"`,
      examples_hi: `दैनिक बोलचाल में सही क्रिया रूप का चयन करना।`,
      key_points: JSON.stringify(['Verbs change forms with tenses.', 'Use do/does for present questions, did for past.']),
      key_points_hi: JSON.stringify(['काल के अनुसार क्रिया का रूप बदलता है।', 'वर्तमान में do/does तथा भूतकाल में did का प्रयोग होता है।']),
      quiz_data: JSON.stringify([
        {
          question: 'Which sentence is in the Simple Past tense?',
          options: ['She writes a story', 'She wrote a story', 'She will write a story', 'She is writing'],
          answer: 1,
          explanation: '"wrote" is the past tense form of the verb "write".'
        }
      ])
    },
    {
      course_id: courseIds['class-10-english'],
      slug: 'active-passive-voice',
      title: 'Active and Passive Voice',
      title_hi: 'कर्तृवाच्य और कर्मवाच्य (Active & Passive Voice)',
      order_index: 3,
      summary: 'Learn how to shift focus from the doer of an action to the receiver in formal and scientific writing.',
      summary_hi: 'वैज्ञानिक और सरकारी सूचनाओं में कर्म को प्रमुखता देने के लिए पैसिव वॉइस का प्रयोग।',
      content: `### Active vs Passive
- **Active Voice:** The subject performs the action. *(Rahul planted five mango saplings.)*
- **Passive Voice:** The subject receives the action. *(Five mango saplings were planted by Rahul.)*
Formula: Object + helping verb (be form) + past participle (V3) + by + Subject.`,
      content_hi: `### एक्टिव और पैसिव में अंतर
- **Active:** कर्ता कार्य करता है। (राहुल ने पौधे लगाए।)
- **Passive:** कार्य या कर्म पर जोर दिया जाता है। (राहुल द्वारा पौधे लगाए गए।)`,
      examples: `News reports and textbook instructions: "The experiment was conducted under controlled temperature."`,
      examples_hi: `समाचार और सरकारी विज्ञप्तियों में: "सड़क का निर्माण पूरा कर लिया गया है।"`,
      key_points: JSON.stringify(['Always use third form of verb (V3) in passive voice.', 'Subject becomes object.']),
      key_points_hi: JSON.stringify(['पैसिव वॉइस में हमेशा क्रिया की तीसरी फॉर्म (V3) लगती है।']),
      quiz_data: JSON.stringify([
        {
          question: 'What is the passive form of: "The farmer plows the field"?',
          options: ['The field is plowed by the farmer', 'The field was plowed', 'The farmer was plowed', 'The field will plow'],
          answer: 0,
          explanation: 'In simple present, use is/am/are + V3: "The field is plowed by the farmer".'
        }
      ])
    },
    {
      course_id: courseIds['class-10-english'],
      slug: 'reading-comprehension',
      title: 'Reading Comprehension & Critical Thinking',
      title_hi: 'अपठित गद्यांश एवं तार्किक सोच',
      order_index: 4,
      summary: 'Strategies to quickly read unseen passages, extract key vocabulary, and score full marks.',
      summary_hi: 'अनदेखे पैराग्राफ को तेजी से पढ़ने, मुख्य भाव समझने और सटीक उत्तर देने की तकनीक।',
      content: `### How to Tackle Unseen Passages:
1. **Skim first:** Read the passage rapidly to grasp the general topic.
2. **Read questions carefully:** Identify keywords in the questions before re-reading.
3. **Locate evidence:** Find sentences in the text that support your answer.
4. **Answer in your own words:** Avoid copying long entire sentences verbatim.`,
      content_hi: `### अपठित गद्यांश हल करने के नियम:
1. पहले पूरा गद्यांश सरसरी नजर से पढ़ें।
2. प्रश्नों को ध्यान से देखें और मुख्य शब्द पहचानें।
3. गद्यांश में से सटीक उत्तर रेखांकित करें।
4. उत्तर सरल और स्पष्ट भाषा में लिखें।`,
      examples: `Reading a health advisory leaflet or a newspaper article about rainwater harvesting.`,
      examples_hi: `अखबार के लेख या जल संरक्षण पर छपे किसी विवरण को पढ़कर समझना।`,
      key_points: JSON.stringify(['Skimming gives context; scanning finds specifics.', 'Context clues reveal word meanings.']),
      key_points_hi: JSON.stringify(['संदर्भ से कठिन शब्दों का अर्थ समझें।', 'अपने शब्दों में सटीक उत्तर लिखें।']),
      quiz_data: JSON.stringify([
        {
          question: 'What is the first step in solving a reading comprehension passage?',
          options: ['Memorize every word', 'Skim quickly for the main theme', 'Write random answers', 'Skip reading'],
          answer: 1,
          explanation: 'Skimming gives you an immediate bird’s-eye view of what the text is about.'
        }
      ])
    },

    // Course 4: Social Science (3 lessons)
    {
      course_id: courseIds['class-10-social-science'],
      slug: 'resources-and-development',
      title: 'Resources and Sustainable Development',
      title_hi: 'संसाधन एवं सतत पोषणीय विकास',
      order_index: 1,
      summary: 'Understand renewable and non-renewable natural resources, soil conservation, and forest stewardship.',
      summary_hi: 'प्राकृतिक संसाधन, मिट्टी का संरक्षण, वन संपदा और सतत पोषणीय विकास की रणनीतियां।',
      content: `### Classification of Resources
- **On origin:** Biotic (living, e.g., forests, wildlife) & Abiotic (non-living, e.g., rocks, minerals).
- **On exhaustibility:** Renewable (solar, wind, water) & Non-renewable (coal, petroleum).
- **Sustainable Development:** Development that meets present needs without compromising the ability of future generations to meet their own needs.`,
      content_hi: `### संसाधनों का वर्गीकरण
- **उत्पत्ति के आधार पर:** जैव (वन, जीव-जंतु) और अजैव (खनिज, धातुएं)।
- **समाप्यता के आधार पर:** नवीकरणीय (सौर ऊर्जा, पवन ऊर्जा) और अनवीकरणीय (कोयला, पेट्रोलियम)।
- **सतत पोषणीय विकास:** ऐसा विकास जो पर्यावरण को नुकसान पहुंचाए बिना वर्तमान और भविष्य दोनों की जरूरतें पूरी करे।`,
      examples: `Traditional tribal sacred groves (Jaherthan/Sarna) preserve biological biodiversity and perennial freshwater springs.`,
      examples_hi: `झारखंड और मध्य भारत में सरना स्थल और पवित्र उपवन पीढ़ियों से वनों और जल स्रोतों की रक्षा करते आए हैं।`,
      key_points: JSON.stringify(['Resources must be planned judiciously.', 'Soil erosion can be prevented by contour farming and afforestation.']),
      key_points_hi: JSON.stringify(['संसाधनों का विवेकपूर्ण नियोजन अनिवार्य है।', 'सीढ़ीदार खेती और पेड़ लगाने से मिट्टी का कटाव रुकता है।']),
      quiz_data: JSON.stringify([
        {
          question: 'Which of the following is a renewable resource?',
          options: ['Coal', 'Petroleum', 'Solar Energy', 'Natural Gas'],
          answer: 2,
          explanation: 'Solar energy replenishes naturally every day and does not get depleted.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-social-science'],
      slug: 'nationalism-in-india',
      title: 'Nationalism in India & Tribal Resistance Movements',
      title_hi: 'भारत में राष्ट्रवाद एवं जनजातीय आंदोलन',
      order_index: 2,
      summary: 'The freedom struggle, Non-Cooperation movement, Civil Disobedience, and legendary leaders like Birsa Munda.',
      summary_hi: 'स्वतंत्रता संग्राम, असहयोग आंदोलन, दांडी यात्रा और भगवान बिरसा मुंडा का उलगुलान।',
      content: `### Awakening of Nationalism
The shared experience of colonial oppression bonded different communities together in British India.

#### Tribal & Peasant Movements:
Tribal communities rose against forest laws that stripped their ancestral right to gather produce and graze cattle.
- **Birsa Munda (Ulgulan movement):** Fought against British land exploitation and missionary interference in Chotanagpur.
- **Alluri Sitarama Raju:** Led the Gudem Hills guerrilla uprising in Andhra Pradesh.`,
      content_hi: `### राष्ट्रवाद का उदय
अंग्रेजी शासन के शोषण के विरुद्ध देश के सभी वर्गों ने एकजुट होकर स्वतंत्रता की लड़ाई लड़ी।

#### जनजातीय उलगुलान:
जल, जंगल, जमीन के अधिकारों की रक्षा के लिए भगवान बिरसा मुंडा ने छोटानागपुर में विशाल जन-आंदोलन चलाया।`,
      examples: `The Salt March (Dandi March) of 1930 demonstrated how a simple natural element like salt could unite people across India.`,
      examples_hi: `1930 की दांडी यात्रा में नमक जैसी आम चीज ने पूरे देश के लोगों को एक सूत्र में बांध दिया।`,
      key_points: JSON.stringify(['Birsa Munda fought for tribal land rights.', 'Non-violence and civil disobedience mobilized millions.']),
      key_points_hi: JSON.stringify(['भगवान बिरसा मुंडा ने जनजातीय स्वाभिमान और जमीन की रक्षा की।']),
      quiz_data: JSON.stringify([
        {
          question: 'The Ulgulan (Great Tumult) tribal movement was led by which revered leader?',
          options: ['Bhagat Singh', 'Birsa Munda', 'Mangal Pandey', 'Subhas Chandra Bose'],
          answer: 1,
          explanation: 'Bhagwan Birsa Munda led the historic Ulgulan movement for tribal autonomy and rights.'
        }
      ])
    },
    {
      course_id: courseIds['class-10-social-science'],
      slug: 'sectors-of-indian-economy',
      title: 'Sectors of the Indian Economy',
      title_hi: 'भारतीय अर्थव्यवस्था के क्षेत्रक',
      order_index: 3,
      summary: 'Primary (agriculture), Secondary (manufacturing), and Tertiary (services) sectors and rural employment.',
      summary_hi: 'प्राथमिक (कृषि), द्वितीयक (उद्योग) और तृतीयक (सेवा) क्षेत्रक तथा ग्रामीण रोजगार के अवसर।',
      content: `### Three Economic Sectors:
1. **Primary Sector:** Activities directly exploiting natural resources (agriculture, dairy, fishing, forestry).
2. **Secondary Sector:** Processing raw materials into finished goods (factories, weaving, construction).
3. **Tertiary Sector:** Services that support production and daily living (transport, banking, education, healthcare, IT).`,
      content_hi: `### अर्थव्यवस्था के तीन मुख्य क्षेत्रक:
1. **प्राथमिक क्षेत्रक:** सीधे प्रकृति पर आधारित (खेती, पशुपालन, मछली पालन)।
2. **द्वितीयक क्षेत्रक:** कच्चे माल से नई वस्तुएं बनाना (कारखाने, हथकरघा, निर्माण)।
3. **तृतीयक क्षेत्रक:** सेवाएं प्रदान करना (परिवहन, बैंकिंग, शिक्षा, मोबाइल इंटरनेट)।`,
      examples: `A farmer grows sugarcane (Primary) -> A mill turns it into jaggery/sugar (Secondary) -> A truck transports it to city shops and banks handle payment (Tertiary).`,
      examples_hi: `किसान गन्ना उगाता है (प्राथमिक) -> गुड़ या चीनी बनती है (द्वितीयक) -> ट्रक उसे बाजार पहुंचाता है (तृतीयक)।`,
      key_points: JSON.stringify(['Most rural workers are in the primary sector.', 'Tertiary sector contributes the highest share to GDP.']),
      key_points_hi: JSON.stringify(['ग्रामीण भारत में अधिकांश लोग प्राथमिक क्षेत्र में कार्यरत हैं।', 'सेवा क्षेत्र देश की जीडीपी में सबसे बड़ा योगदान देता है।']),
      quiz_data: JSON.stringify([
        {
          question: 'Which sector does dairy farming belong to?',
          options: ['Primary', 'Secondary', 'Tertiary', 'Quaternary'],
          answer: 0,
          explanation: 'Dairy farming directly utilizes biological animal resources, making it part of the Primary sector.'
        }
      ])
    },

    // Course 5: Computer Science (3 lessons)
    {
      course_id: courseIds['digital-literacy-cs'],
      slug: 'computer-fundamentals',
      title: 'Hardware, Software and Operating Systems',
      title_hi: 'कंप्यूटर के मूल अंग: हार्डवेयर, सॉफ्टवेयर एवं ओएस',
      order_index: 1,
      summary: 'Understand CPU, RAM, storage, input/output devices, and how an operating system coordinates hardware.',
      summary_hi: 'सीपीयू, रैम, मेमोरी, कीबोर्ड-माउस और ऑपरेटिंग सिस्टम की कार्यप्रणाली को सरल रूप में समझें।',
      content: `### Anatomy of a Computer:
- **Input Devices:** Keyboard, mouse, microphone, camera.
- **CPU (Central Processing Unit):** The "brain" executing instructions and performing math.
- **RAM (Random Access Memory):** Super-fast temporary workspace for apps currently in use.
- **Storage (SSD/Hard Drive):** Permanent storage for files, photos, and apps even when powered off.
- **Output Devices:** Monitor/screen, speakers, printer.`,
      content_hi: `### कंप्यूटर के मुख्य अंग:
- **इनपुट उपकरण:** कीबोर्ड, माउस, माइक (जानकारी अंदर भेजने के लिए)।
- **CPU:** कंप्यूटर का दिमाग जो सभी गणनाएं और आदेश पूरे करता है।
- **RAM:** अस्थायी तेज मेमोरी, जहां चालू ऐप काम करते हैं।
- **स्टोरेज (हार्ड डिस्क/मेमोरी कार्ड):** स्थायी रूप से फाइलें सहेजने की जगह।
- **आउटपुट उपकरण:** स्क्रीन, स्पीकर, प्रिंटर।`,
      examples: `Think of CPU as a chef, RAM as the kitchen countertop where ingredients are placed while cooking, and Storage as the pantry cupboard.`,
      examples_hi: `CPU को रसोईया समझें, RAM वह मेज है जिस पर खाना बनाते समय सामान रखा जाता है, और स्टोरेज वह अलमारी है जहाँ सारा अनाज सुरक्षित रहता है।`,
      key_points: JSON.stringify(['CPU executes commands; RAM provides workspace.', 'Storage holds data permanently.']),
      key_points_hi: JSON.stringify(['CPU गणना करता है, RAM तात्कालिक काम संभालती है और स्टोरेज में डेटा सुरक्षित रहता है।']),
      quiz_data: JSON.stringify([
        {
          question: 'Which component acts as the primary "brain" of a computer?',
          options: ['RAM', 'CPU', 'Hard Disk', 'Monitor'],
          answer: 1,
          explanation: 'The CPU (Central Processing Unit) processes all calculations and program instructions.'
        }
      ])
    },
    {
      course_id: courseIds['digital-literacy-cs'],
      slug: 'internet-and-web-browsing',
      title: 'The Internet, Search Engines & Useful Digital Services',
      title_hi: 'इंटरनेट, सर्च इंजन एवं सरकारी डिजिटल सेवाएं',
      order_index: 2,
      summary: 'How the internet works, using search effectively, and accessing DigiLocker, Aadhaar, and scholarship portals.',
      summary_hi: 'इंटरनेट की दुनिया, सटीक सर्च के तरीके और डिजिलॉकर, आधार तथा छात्रवृत्ति पोर्टल का उपयोग।',
      content: `### How the Web Works
The Internet is a global network of interconnected computers communicating via standardized protocols (like HTTP/HTTPS).
- **URL (Uniform Resource Locator):** Web address (e.g., *scholarships.gov.in*).
- **HTTPS:** The 'S' stands for Secure; all data between your phone and website is encrypted.
- **DigiLocker:** Official Indian digital locker to store board marksheets, caste certificates, and driving licenses safely online.`,
      content_hi: `### इंटरनेट कैसे काम करता है?
इंटरनेट दुनिया भर के कंप्यूटरों और मोबाइल फोन का आपस में जुड़ा विशाल जाल है।
- **URL:** वेबसाइट का पता।
- **HTTPS:** सुरक्षित कनेक्शन का संकेत।
- **डिजीलॉकर (DigiLocker):** भारत सरकार की आधिकारिक सेवा जहाँ 10वीं की मार्कशीट, जाति प्रमाण पत्र सुरक्षित रहते हैं।`,
      examples: `Instead of carrying original certificates to an exam center or office, a verified digital marksheet from DigiLocker is legally valid everywhere.`,
      examples_hi: `मूल मार्कशीट खोने के डर के बिना डिजिलॉकर से डिजिटल कॉपी दिखाना हर जगह कानूनी रूप से मान्य है।`,
      key_points: JSON.stringify(['Always verify the padlock icon and HTTPS for online forms.', 'DigiLocker keeps essential documents safe.']),
      key_points_hi: JSON.stringify(['ऑनलाइन फॉर्म भरते समय हमेशा सुरक्षित वेबसाइट (HTTPS) देखें।']),
      quiz_data: JSON.stringify([
        {
          question: 'What does the "S" in HTTPS indicate?',
          options: ['Speed', 'Secure', 'Server', 'Simple'],
          answer: 1,
          explanation: 'The S stands for Secure, meaning the communication is encrypted against eavesdropping.'
        }
      ])
    },
    {
      course_id: courseIds['digital-literacy-cs'],
      slug: 'introduction-to-coding',
      title: 'Introduction to Algorithms, Logic & Coding',
      title_hi: 'कोडिंग का परिचय: तर्क और एल्गोरिदम',
      order_index: 3,
      summary: 'Think like a software engineer: sequencing, conditionals (If-Else), loops, and problem solving.',
      summary_hi: 'सॉफ्टवेयर इंजीनियर की तरह सोचें: क्रम, शर्तें (यदि-तो), लूप और समस्याओं का तार्किक समाधान।',
      content: `### What is an Algorithm?
An algorithm is a step-by-step set of clear instructions to solve a particular problem or accomplish a task.

#### Core Coding Concepts:
1. **Sequence:** Doing steps one after another in exact order.
2. **Conditionals (If-Else):** Making decisions. *(IF it rains, take an umbrella, ELSE wear a hat.)*
3. **Loops (Repetition):** Repeating an action until a condition is met. *(WHILE bucket is not full, keep adding water.)*
4. **Variables:** Named containers that store values (like score = 100).`,
      content_hi: `### एल्गोरिदम क्या है?
किसी भी समस्या को हल करने के लिए क्रमबद्ध दिए गए निर्देशों को एल्गोरिदम कहते हैं।

#### कोडिंग के मूल स्तंभ:
1. **क्रम (Sequence):** एक के बाद एक चरण पूरा करना।
2. **शर्त (Condition - If/Else):** यदि ऐसा हो तो यह करो, वरना दूसरा काम करो।
3. **लूप (Loop):** किसी काम को बार-बार दोहराना जब तक लक्ष्य पूरा न हो जाए।
4. **वेरिएबल:** मान सहेजने का डिब्बा।`,
      examples: `A recipe for making chai (tea) is a perfect real-life algorithm with steps, conditions (how much sugar?), and loops (boil for 2 minutes).`,
      examples_hi: `चाय बनाने की विधि एक वास्तविक जीवन का एल्गोरिदम है जिसमें सही क्रम, शर्तें और समय शामिल होता है।`,
      key_points: JSON.stringify(['Algorithms break big problems into small actionable steps.', 'Code is just human logic written in languages computers understand.']),
      key_points_hi: JSON.stringify(['एल्गोरिदम बड़ी समस्याओं को छोटे चरणों में तोड़ता है।', 'कोडिंग कंप्यूटर से अपनी भाषा में बात करने का माध्यम है।']),
      quiz_data: JSON.stringify([
        {
          question: 'What programming concept repeats a set of steps until a condition is met?',
          options: ['Variable', 'Loop', 'Comment', 'Constant'],
          answer: 1,
          explanation: 'A loop executes code repeatedly until its termination condition is satisfied.'
        }
      ])
    }
  ];

  for (const l of lessons) {
    db.run(
      `INSERT INTO lessons (course_id, slug, title, title_hi, order_index, summary, summary_hi, content, content_hi, examples, examples_hi, key_points, key_points_hi, quiz_data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [l.course_id, l.slug, l.title, l.title_hi, l.order_index, l.summary, l.summary_hi, l.content, l.content_hi, l.examples, l.examples_hi, l.key_points, l.key_points_hi, l.quiz_data]
    );
  }
  console.log(`✓ 20 Lessons seeded across 5 courses`);

  // 4. Seed Scholarships (8 realistic government & foundation scholarships)
  const scholarships = [
    {
      name: 'Pre-Matric Scholarship for ST Students',
      name_hi: 'अनुसूचित जनजाति (ST) के छात्रों के लिए प्री-मैट्रिक छात्रवृत्ति',
      provider: 'Ministry of Tribal Affairs, Govt. of India',
      education_level: 'Class 9-10',
      category: 'ST',
      state: 'All India',
      gender: 'All',
      max_income: 250000,
      min_percentage: 50.0,
      disability_status: 'No',
      benefit_amount: '₹3,500/year + Maintenance Allowance',
      deadline: '31 October 2026',
      description: 'Supports tribal students in secondary classes to reduce dropouts in rural and forested regions.',
      description_hi: 'माध्यमिक कक्षाओं में ड्रॉपआउट कम करने और दूरदराज के क्षेत्रों के जनजातीय छात्रों की पढ़ाई जारी रखने के लिए।',
      required_documents: JSON.stringify(['ST Caste Certificate', 'Income Certificate', 'Previous Year Marksheet', 'Aadhaar Card', 'Bank Passbook']),
      official_portal: 'https://scholarships.gov.in'
    },
    {
      name: 'Post-Matric Scholarship for SC Students',
      name_hi: 'अनुसूचित जाति (SC) के छात्रों के लिए पोस्ट-मैट्रिक छात्रवृत्ति',
      provider: 'Ministry of Social Justice and Empowerment',
      education_level: 'Class 11-12 & Higher',
      category: 'SC',
      state: 'All India',
      gender: 'All',
      max_income: 250000,
      min_percentage: 50.0,
      disability_status: 'No',
      benefit_amount: 'Full Tuition Fee Reimbursement + Monthly Allowance',
      deadline: '15 November 2026',
      description: 'Provides financial assistance for higher secondary, polytechnic, degree, and professional education.',
      description_hi: 'उच्चतर माध्यमिक, पॉलिटेक्निक और कॉलेज स्तर पर ट्यूशन फीस प्रतिपूर्ति और मासिक भत्ता प्रदान करता है।',
      required_documents: JSON.stringify(['SC Caste Certificate', 'Income Certificate', 'Class 10 Marksheet', 'College Admission Proof', 'Bank Account']),
      official_portal: 'https://scholarships.gov.in'
    },
    {
      name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
      name_hi: 'राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना (NMMSS)',
      provider: 'Department of School Education & Literacy, MoE',
      education_level: 'Class 9-12',
      category: 'All',
      state: 'All India',
      gender: 'All',
      max_income: 350000,
      min_percentage: 55.0,
      disability_status: 'No',
      benefit_amount: '₹12,000 per annum (₹1,000/month)',
      deadline: '30 November 2026',
      description: 'Awarded to meritorious students from economically weaker sections to prevent dropout at class 8 stage.',
      description_hi: 'कक्षा 8 के बाद आर्थिक तंगी के कारण पढ़ाई छोड़ने वाले मेधावी छात्रों को निरंतर 4 वर्षों तक सहायता।',
      required_documents: JSON.stringify(['Income Certificate (< 3.5 Lakh)', 'Selection Test Admit/Score Card', 'Class 8 Marksheet', 'Aadhaar']),
      official_portal: 'https://scholarships.gov.in'
    },
    {
      name: 'AICTE Pragati Scholarship for Girl Students',
      name_hi: 'बालिकाओं के लिए एआईसीटीई प्रगति छात्रवृत्ति',
      provider: 'All India Council for Technical Education (AICTE)',
      education_level: 'Polytechnic / Diploma / B.Tech',
      category: 'All',
      state: 'All India',
      gender: 'Female',
      max_income: 800000,
      min_percentage: 60.0,
      disability_status: 'No',
      benefit_amount: '₹50,000 per annum for tuition & books',
      deadline: '31 December 2026',
      description: 'Empowers young women from rural and backward areas to pursue professional technical and engineering education.',
      description_hi: 'तकनीकी और इंजीनियरिंग शिक्षा में बालिकाओं की भागीदारी बढ़ाने के लिए वार्षिक ₹50,000 की सहायता।',
      required_documents: JSON.stringify(['Admission Letter in AICTE Approved Institute', 'Income Certificate', 'Class 10/12 Marksheet', 'Aadhaar Card']),
      official_portal: 'https://www.aicte-india.org'
    },
    {
      name: 'Begum Hazrat Mahal National Scholarship',
      name_hi: 'बेगम हज़रत महल राष्ट्रीय छात्रवृत्ति',
      provider: 'Maulana Azad Education Foundation, Minority Affairs',
      education_level: 'Class 9-12',
      category: 'Minority',
      state: 'All India',
      gender: 'Female',
      max_income: 200000,
      min_percentage: 50.0,
      disability_status: 'No',
      benefit_amount: '₹5,000 to ₹6,000 per year',
      deadline: '15 October 2026',
      description: 'Direct benefit transfer for meritorious girl students belonging to notified minority communities.',
      description_hi: 'अल्पसंख्यक समुदाय की मेधावी छात्राओं के लिए सीधी छात्रवृत्ति सहायता।',
      required_documents: JSON.stringify(['Self-declared Minority Certificate', 'Income Certificate', 'Previous Marksheet', 'School Verification']),
      official_portal: 'https://scholarships.gov.in'
    },
    {
      name: 'Jharkhand E-Kalyan Post-Matric Welfare Scholarship',
      name_hi: 'झारखंड ई-कल्याण पोस्ट-मैट्रिक कल्याण छात्रवृत्ति',
      provider: 'Scheduled Tribe, Scheduled Caste, Minority and Backward Class Welfare Dept, Jharkhand',
      education_level: 'Class 11-12 & Higher',
      category: 'ST',
      state: 'Jharkhand',
      gender: 'All',
      max_income: 250000,
      min_percentage: 45.0,
      disability_status: 'No',
      benefit_amount: 'Complete Course Fee + Hosteller/Day Scholar Maintenance',
      deadline: '20 November 2026',
      description: 'Special welfare scheme for SC/ST/OBC students of Jharkhand pursuing post-matric studies in and outside the state.',
      description_hi: 'झारखंड के अनुसूचित जाति, जनजाति एवं पिछड़ा वर्ग के विद्यार्थियों के लिए विशेष राज्य स्तरीय छात्रवृत्ति।',
      required_documents: JSON.stringify(['Jharkhand Residential Certificate', 'Caste Certificate', 'Income Certificate', 'College Bonafide', 'Bank Passbook']),
      official_portal: 'https://ekalyan.cgg.gov.in'
    },
    {
      name: 'Scholarship for Students with Disabilities (Divyangjan)',
      name_hi: 'दिव्यांग विद्यार्थियों के लिए राष्ट्रीय छात्रवृत्ति योजना',
      provider: 'Department of Empowerment of Persons with Disabilities',
      education_level: 'Class 9-12 & Higher',
      category: 'All',
      state: 'All India',
      gender: 'All',
      max_income: 250000,
      min_percentage: 40.0,
      disability_status: 'Yes',
      benefit_amount: '₹4,000/year + Book Grant + Assistive Device allowance',
      deadline: '30 October 2026',
      description: 'Financial support and assistive device allowances for students with over 40% benchmark disability.',
      description_hi: '40% या अधिक दिव्यांगता वाले छात्रों को शिक्षा उपकरण, पुस्तक अनुदान और भत्ते सहित सहायता।',
      required_documents: JSON.stringify(['UDID Card / Disability Certificate', 'Income Certificate', 'Marksheet', 'Aadhaar Card']),
      official_portal: 'https://scholarships.gov.in'
    },
    {
      name: 'Tata Steel Millennium Tribal STEM Scholarship',
      name_hi: 'टाटा स्टील मिलेनियम ट्राइबल एसटीईएम छात्रवृत्ति',
      provider: 'Tata Steel Corporate Foundation',
      education_level: 'Class 11-12 & Higher',
      category: 'ST',
      state: 'Jharkhand',
      gender: 'All',
      max_income: 400000,
      min_percentage: 60.0,
      disability_status: 'No',
      benefit_amount: '₹30,000 per year towards tuition and study equipment',
      deadline: '10 December 2026',
      description: 'Private foundation fellowship encouraging tribal youth in mining and rural belts to excel in Science & Tech careers.',
      description_hi: 'ग्रामीण और खनन क्षेत्रों के जनजातीय युवाओं को विज्ञान और इंजीनियरिंग में आगे बढ़ाने के लिए वार्षिक छात्रवृत्ति।',
      required_documents: JSON.stringify(['ST Certificate', 'Domicile Proof (Jharkhand/Odisha)', 'Academic Transcripts', 'Recommendation from School Head']),
      official_portal: 'https://tatasteelfoundation.org'
    }
  ];

  for (const s of scholarships) {
    db.run(
      `INSERT INTO scholarships (name, name_hi, provider, education_level, category, state, gender, max_income, min_percentage, disability_status, benefit_amount, deadline, description, description_hi, required_documents, official_portal)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.name, s.name_hi, s.provider, s.education_level, s.category, s.state, s.gender, s.max_income, s.min_percentage, s.disability_status, s.benefit_amount, s.deadline, s.description, s.description_hi, s.required_documents, s.official_portal]
    );
  }
  console.log(`✓ 8 Realistic scholarships seeded`);

  // 5. Seed Mentors (6 mentors with diverse expertise)
  const mentors = [
    {
      name: 'Ankit Sharma',
      field: 'Computer Science & Software Engineering',
      field_hi: 'कंप्यूटर विज्ञान एवं सॉफ्टवेयर इंजीनियरिंग',
      experience_years: 6,
      languages: 'Hindi + English',
      availability: 'Weekends (10 AM - 1 PM)',
      rating: 4.9,
      bio: 'Former rural student from Bihar, now a Software Engineer at a leading tech company. Passionate about teaching coding from scratch and breaking tech career myths.',
      avatar_initials: 'AS',
      avatar_bg: '#2563EB'
    },
    {
      name: 'Dr. Sunita Soren',
      field: 'Medical Sciences & Rural Public Health',
      field_hi: 'चिकित्सा विज्ञान एवं ग्रामीण स्वास्थ्य',
      experience_years: 8,
      languages: 'Santhali + Hindi + English',
      availability: 'Tue & Thu Evenings (6 PM - 8 PM)',
      rating: 5.0,
      bio: 'Tribal doctor practicing in community health centers. Guides students on preparing for NEET, nursing, paramedical diplomas, and community healthcare careers.',
      avatar_initials: 'SS',
      avatar_bg: '#059669'
    },
    {
      name: 'Rajesh Murmu',
      field: 'Civil Services & Government Administration',
      field_hi: 'प्रशासनिक सेवाएं एवं सरकारी प्रतियोगी परीक्षाएं',
      experience_years: 10,
      languages: 'Hindi + English + Ho',
      availability: 'Sunday Mornings (9 AM - 12 PM)',
      rating: 4.8,
      bio: 'Senior State Administrative Officer. Mentors underprivileged youth on UPSC, JPSC/BPSC exams, essay writing, and public service opportunities.',
      avatar_initials: 'RM',
      avatar_bg: '#D97706'
    },
    {
      name: 'Priya Patel',
      field: 'Data Science & Applied Mathematics',
      field_hi: 'डेटा साइंस एवं व्यावहारिक गणित',
      experience_years: 5,
      languages: 'Hindi + English + Gujarati',
      availability: 'Mon & Wed Evenings (7 PM - 9 PM)',
      rating: 4.9,
      bio: 'Math olympiad mentor and data scientist. Specializes in helping students overcome math anxiety through relatable patterns and games.',
      avatar_initials: 'PP',
      avatar_bg: '#7C3AED'
    },
    {
      name: 'Amit Verma',
      field: 'Agritech & Sustainable Horticulture',
      field_hi: 'कृषि तकनीक एवं सतत जैविक खेती',
      experience_years: 7,
      languages: 'Hindi + English',
      availability: 'Flexible (Afternoons)',
      rating: 4.7,
      bio: 'Agricultural scientist researching drone tech and soil health. Guides students on ICAR entrance, B.Sc Agriculture, and modern agribusiness ventures.',
      avatar_initials: 'AV',
      avatar_bg: '#16A34A'
    },
    {
      name: 'Kavita Rao',
      field: 'Digital Literacy & English Communication',
      field_hi: 'डिजिटल साक्षरता एवं अंग्रेज़ी संचार',
      experience_years: 9,
      languages: 'Telugu + Hindi + English',
      availability: 'Saturdays (3 PM - 6 PM)',
      rating: 4.9,
      bio: 'Educator who has trained over 4,000 village youth in functional spoken English, interview preparation, and digital workplace readiness.',
      avatar_initials: 'KR',
      avatar_bg: '#DB2777'
    }
  ];

  for (const m of mentors) {
    db.run(
      `INSERT INTO mentors (name, field, field_hi, experience_years, languages, availability, rating, bio, avatar_initials, avatar_bg)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [m.name, m.field, m.field_hi, m.experience_years, m.languages, m.availability, m.rating, m.bio, m.avatar_initials, m.avatar_bg]
    );
  }
  console.log(`✓ 6 Diverse mentors seeded`);

  // 6. Seed Sample Progress for Demo Student Rahul
  // Mark 2 science lessons completed, 3 math lessons completed, 2 english lessons completed
  const sampleLessons = db.query(`SELECT id, course_id FROM lessons ORDER BY id ASC LIMIT 8`);
  for (let i = 0; i < sampleLessons.length; i++) {
    const l = sampleLessons[i];
    const completed = i < 5 ? 1 : 0;
    const score = i < 5 ? 100 : 0;
    db.run(
      `INSERT INTO progress (user_id, lesson_id, completed, quiz_score) VALUES (?, ?, ?, ?)`,
      [demoUserId, l.id, completed, score]
    );
  }
  console.log(`✓ Sample student progress seeded for Rahul`);

  // 7. Seed User Settings for Demo Student
  db.run(
    `INSERT INTO user_settings (user_id, preferred_language, low_data, voice_enabled, theme, college_name, target_career, subjects)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      demoUserId,
      'hi',
      0,
      1,
      'light',
      'Birsa Munda Inter College, Ranchi',
      'State Administrative Services & Civil Services',
      'Geography, Political Science, Economics, Science, English'
    ]
  );
  console.log(`✓ User settings seeded for demo student`);

  // 8. Seed Quizzes & Questions
  const quizzesData = [
    {
      slug: 'daily-challenge-geography',
      title: 'Daily Challenge: Indian Geography & Resources',
      title_hi: 'दैनिक चुनौती: भारतीय भूगोल एवं संसाधन',
      category: 'Geography',
      education_level: 'Higher Secondary & College',
      description: 'Quick 5-question daily drill on Indian river basins, soils, natural resources, and physical divisions.',
      description_hi: 'भारतीय नदी घाटियों, मृदा, प्राकृतिक संसाधनों एवं भौतिक विभाजन पर 5 प्रश्नों का त्वरित दैनिक टेस्ट।',
      time_limit_minutes: 5,
      total_questions: 5,
      difficulty: 'Intermediate',
      icon: '🌍',
      is_daily_challenge: 1,
      questions: [
        {
          question: 'Which river is known as the "Dakshin Ganga" (Ganga of the South) owing to its length and spiritual significance?',
          question_hi: 'अपनी लंबाई और पवित्रता के कारण किस नदी को "दक्षिण गंगा" कहा जाता है?',
          options: ['Godavari', 'Krishna', 'Cauvery', 'Mahanadi'],
          options_hi: ['गोदावरी', 'कृष्णा', 'कावेरी', 'महानदी'],
          correct_index: 0,
          explanation: 'The Godavari is the longest river of peninsular India (1,465 km) and is traditionally called Dakshin Ganga.',
          explanation_hi: 'गोदावरी प्रायद्वीपीय भारत की सबसे लंबी नदी (1,465 किमी) है और इसे दक्षिण गंगा के नाम से जाना जाता है।'
        },
        {
          question: 'Which soil type covers over 40% of India and is the most fertile for agricultural food production?',
          question_hi: 'भारत के 40% से अधिक क्षेत्र में कौन सी उपजाऊ मिट्टी फैली हुई है जो खाद्यान्न उत्पादन के लिए सर्वोत्तम है?',
          options: ['Black Soil', 'Alluvial Soil', 'Red Soil', 'Laterite Soil'],
          options_hi: ['काली मिट्टी', 'जलोढ़ मिट्टी', 'लाल मिट्टी', 'लेटराइट मिट्टी'],
          correct_index: 1,
          explanation: 'Alluvial soil brought down by Himalayan and peninsular river systems is rich in potash and humic nutrients.',
          explanation_hi: 'नदियों द्वारा लाई गई जलोढ़ मिट्टी भारत के उत्तरी मैदानों और तटीय क्षेत्रों में सबसे उपजाऊ मिट्टी है।'
        },
        {
          question: 'Through how many Indian states does the Tropic of Cancer (23.5° N) pass?',
          question_hi: 'कर्क रेखा (23.5° N) भारत के कितने राज्यों से होकर गुजरती है?',
          options: ['6 States', '7 States', '8 States', '9 States'],
          options_hi: ['6 राज्य', '7 राज्य', '8 राज्य', '9 राज्य'],
          correct_index: 2,
          explanation: 'Tropic of Cancer passes through 8 states: Gujarat, Rajasthan, MP, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.',
          explanation_hi: 'कर्क रेखा 8 राज्यों से गुजरती है: गुजरात, राजस्थान, म.प्र., छत्तीसगढ़, झारखंड, प. बंगाल, त्रिपुरा और मिज़ोरम।'
        },
        {
          question: 'Which is the highest mountain peak in the Western Ghats and peninsular India?',
          question_hi: 'पश्चिमी घाट और प्रायद्वीपीय भारत की सबसे ऊँची पर्वत चोटी कौन सी है?',
          options: ['Anamudi (Kerala)', 'Doddabetta (Tamil Nadu)', 'Kalsubai (Maharashtra)', 'Mahendragiri (Odisha)'],
          options_hi: ['अनामुडी (केरल)', 'दोद्दाबेट्टा (तमिलनाडु)', 'कलसुबाई (महाराष्ट्र)', 'महेंद्रगिरि (ओडिशा)'],
          correct_index: 0,
          explanation: 'Anamudi, located in the Anamalai Hills of Kerala at an elevation of 2,695 meters, is the highest peak in peninsular India.',
          explanation_hi: 'केरल के अन्नामलाई पर्वतमाला में स्थित अनामुडी (2,695 मीटर) प्रायद्वीपीय भारत की सबसे ऊँची चोटी है।'
        },
        {
          question: 'Which Indian state is currently the leader in solar energy generation capacity?',
          question_hi: 'भारत में वर्तमान में सौर ऊर्जा उत्पादन क्षमता में कौन सा राज्य शीर्ष पर है?',
          options: ['Punjab', 'Rajasthan', 'Kerala', 'Assam'],
          options_hi: ['पंजाब', 'राजस्थान', 'केरल', 'असम'],
          correct_index: 1,
          explanation: 'Rajasthan leads India in solar power capacity due to its Thar desert landscape and highest solar insolation.',
          explanation_hi: 'विशाल भू-भाग और प्रचुर धूप के कारण राजस्थान सौर ऊर्जा उत्पादन क्षमता में भारत में सबसे आगे है।'
        }
      ]
    },
    {
      slug: 'human-geography-population',
      title: 'Human Geography: Population & Migration',
      title_hi: 'मानव भूगोल: जनसंख्या, प्रवास एवं ग्रामीण विकास',
      category: 'Geography',
      education_level: 'Undergraduate & Class 12',
      description: 'Understand demographic transitions, push-pull factors of migration, and rural livelihood challenges.',
      description_hi: 'जनसांख्यिकीय संक्रमण, प्रवास के प्रेरक कारक तथा ग्रामीण आजीविका के अवसरों का परीक्षण।',
      time_limit_minutes: 6,
      total_questions: 5,
      difficulty: 'Intermediate',
      icon: '👥',
      is_daily_challenge: 0,
      questions: [
        {
          question: 'Which factor is considered a prominent "Push Factor" causing rural youth to migrate towards urban agglomerations?',
          question_hi: 'ग्रामीण युवाओं को शहरों की ओर प्रवास करने के लिए विवश करने वाला प्रमुख "प्रतिकर्ष (Push) कारक" कौन सा है?',
          options: ['Desire for high entertainment', 'Lack of local healthcare and viable employment', 'Cheap urban housing', 'Excess rural rainfall'],
          options_hi: ['मनोरंजन की चाहत', 'स्थानीय स्वास्थ्य सुविधाओं और आजीविका के अवसरों की कमी', 'सस्ता शहरी आवास', 'अत्यधिक वर्षा'],
          correct_index: 1,
          explanation: 'Push factors are adverse conditions (underemployment, crop failure, lack of hospitals) that push people away from their origin.',
          explanation_hi: 'प्रतिकर्ष कारक वे प्रतिकूल परिस्थितियाँ हैं (बेरोजगारी, सूखा, स्वास्थ्य सेवाओं की कमी) जो लोगों को अपना मूल स्थान छोड़ने पर मजबूर करती हैं।'
        },
        {
          question: 'What is the term for the economic growth potential that results when a country has a higher share of working-age population compared to dependents?',
          question_hi: 'उस आर्थिक विकास क्षमता को क्या कहते हैं जब किसी देश में आश्रितों की तुलना में कामकाजी आयु वर्ग की आबादी अधिक होती है?',
          options: ['Dependency Ratio', 'Demographic Dividend', 'Population Explosion', 'Brain Drain'],
          options_hi: ['आश्रितता अनुपात', 'जनसांख्यिकीय लाभांश (Demographic Dividend)', 'जनसंख्या विस्फोट', 'प्रतिभा पलायन'],
          correct_index: 1,
          explanation: 'Demographic dividend occurs when the proportion of working people in the total population is high, boosting productivity.',
          explanation_hi: 'जनसांख्यिकीय लाभांश तब प्राप्त होता है जब कार्यशील आयु वर्ग (15-59 वर्ष) का अनुपात कुल आबादी में सर्वाधिक होता है।'
        },
        {
          question: 'According to the Census of India, which of the following criteria defines a Census Town?',
          question_hi: 'भारत की जनगणना के अनुसार, "जनगणना नगर (Census Town)" की क्या परिभाषा है?',
          options: ['Any village near a highway', 'Minimum 5,000 population with at least 75% male main working force engaged in non-agricultural pursuits', 'Presence of a railway station', 'Any district headquarters'],
          options_hi: ['राजमार्ग के पास का कोई भी गाँव', 'न्यूनतम 5,000 आबादी तथा 75% पुरुष कार्यबल गैर-कृषि कार्यों में संलग्न', 'रेलवे स्टेशन की उपस्थिति', 'केवल जिला मुख्यालय'],
          correct_index: 1,
          explanation: 'Census town criteria: Minimum population 5,000, 75% non-agricultural male workforce, and density >= 400 per sq km.',
          explanation_hi: 'जनगणना नगर के लिए न्यूनतम 5,000 आबादी, कम से कम 75% पुरुष गैर-कृषि में और 400 व्यक्ति/वर्ग किमी घनत्व आवश्यक है।'
        },
        {
          question: 'What traditional water conservation practice is widely used in Chota Nagpur Plateau and Jharkhand tribal belt?',
          question_hi: 'छोटानागपुर पठार और झारखंड के जनजातीय क्षेत्रों में जल संरक्षण के लिए पारंपरिक रूप से क्या बनाया जाता है?',
          options: ['Deep canal tube-wells', 'Doba (small farm ponds) and loose boulder check dams', 'Plastic reservoir tanks', 'Paved cement gutters'],
          options_hi: ['गहरे ट्यूबवेल', 'डोभा (खेत-तालाब) एवं बोल्डर चेकडैम', 'प्लास्टिक टैंक', 'पक्की सीमेंट नालियाँ'],
          correct_index: 1,
          explanation: 'Doba and check dams trap surface runoff during monsoons, helping recharge groundwater for winter crops.',
          explanation_hi: 'डोभा और चेकडैम वर्षा जल को रोककर भूजल स्तर सुधारते हैं और रबी फसलों के लिए सिंचाई प्रदान करते हैं।'
        },
        {
          question: 'Which sector of the economy still engages the largest percentage of India’s rural workforce?',
          question_hi: 'अर्थव्यवस्था का कौन सा क्षेत्र आज भी भारत के ग्रामीण कार्यबल के सबसे बड़े हिस्से को रोजगार देता है?',
          options: ['Software Engineering', 'Agriculture and allied activities', 'Banking and Financial Services', 'Aviation'],
          options_hi: ['सॉफ्टवेयर इंजीनियरिंग', 'कृषि एवं संबद्ध गतिविधियाँ', 'बैंकिंग एवं वित्तीय सेवाएँ', 'विमानन क्षेत्र'],
          correct_index: 1,
          explanation: 'Agriculture and allied sectors continue to employ over 45-50% of the rural working population in India.',
          explanation_hi: 'कृषि और पशुपालन क्षेत्र भारत के ग्रामीण कार्यबल के 45-50% से अधिक लोगों को रोज़गार प्रदान करता है।'
        }
      ]
    },
    {
      slug: 'indian-constitution-polity',
      title: 'Indian Polity: Constitution & Governance',
      title_hi: 'भारतीय राजव्यवस्था: संविधान, अधिकार एवं पंचायती राज',
      category: 'Political Science',
      education_level: 'Higher Secondary & College',
      description: 'Master Fundamental Rights, Panchayati Raj decentralized democracy, and constitutional machinery.',
      description_hi: 'मौलिक अधिकार, पंचायती राज व्यवस्था और भारतीय संविधान के मूल सिद्धांतों का अभ्यास।',
      time_limit_minutes: 5,
      total_questions: 5,
      difficulty: 'Intermediate',
      icon: '⚖️',
      is_daily_challenge: 0,
      questions: [
        {
          question: 'Which Article of the Constitution guarantees "Equality before Law" and "Equal Protection of the Laws"?',
          question_hi: 'संविधान का कौन सा अनुच्छेद "विधि के समक्ष समता" और "विधियों के समान संरक्षण" की गारंटी देता है?',
          options: ['Article 12', 'Article 14', 'Article 19', 'Article 21'],
          options_hi: ['अनुच्छेद 12', 'अनुच्छेद 14', 'अनुच्छेद 19', 'अनुच्छेद 21'],
          correct_index: 1,
          explanation: 'Article 14 forms the foundation of equality in India, prohibiting arbitrary state discrimination.',
          explanation_hi: 'अनुच्छेद 14 भारत में समानता का अधिकार सुनिश्चित करता है और राज्य के मनमाने भेदभाव को रोकता है।'
        },
        {
          question: 'The 73rd Constitutional Amendment Act, 1992 granted constitutional status to which institution?',
          question_hi: '73वें संविधान संशोधन अधिनियम, 1992 द्वारा किस संस्था को संवैधानिक दर्जा प्रदान किया गया?',
          options: ['Municipal Corporations', 'Panchayati Raj Institutions (PRIs)', 'Central Bureau of Investigation', 'NITI Aayog'],
          options_hi: ['नगर निगम', 'पंचायती राज संस्थाएँ (PRIs)', 'सीबीआई', 'नीति आयोग'],
          correct_index: 1,
          explanation: 'The 73rd Amendment added Part IX and the 11th Schedule, establishing a 3-tier Panchayati Raj system.',
          explanation_hi: '73वें संशोधन ने संविधान में भाग IX और 11वीं अनुसूची जोड़कर 3-स्तरीय पंचायती राज व्यवस्था स्थापित की।'
        },
        {
          question: 'Which Fundamental Right was termed by Dr. B.R. Ambedkar as the "Heart and Soul" of the Indian Constitution?',
          question_hi: 'डॉ. बी.आर. आंबेडकर ने किस मौलिक अधिकार को भारतीय संविधान का "हृदय और आत्मा" कहा था?',
          options: ['Right to Freedom of Speech', 'Right to Constitutional Remedies (Article 32)', 'Right to Education (Article 21A)', 'Right against Exploitation'],
          options_hi: ['वाक् एवं अभिव्यक्ति की स्वतंत्रता', 'संवैधानिक उपचारों का अधिकार (अनुच्छेद 32)', 'शिक्षा का अधिकार', 'शोषण के विरुद्ध अधिकार'],
          correct_index: 1,
          explanation: 'Article 32 empowers citizens to directly approach the Supreme Court via writs to enforce Fundamental Rights.',
          explanation_hi: 'अनुच्छेद 32 नागरिकों को मौलिक अधिकारों के उल्लंघन पर सीधे सर्वोच्च न्यायालय जाने का अधिकार देता है।'
        },
        {
          question: 'What is the minimum voting age for Indian citizens as established by the 61st Amendment Act?',
          question_hi: '61वें संविधान संशोधन अधिनियम द्वारा भारतीय नागरिकों के लिए मतदान की न्यूनतम आयु कितनी निर्धारित की गई?',
          options: ['16 Years', '18 Years', '21 Years', '25 Years'],
          options_hi: ['16 वर्ष', '18 वर्ष', '21 वर्ष', '25 वर्ष'],
          correct_index: 1,
          explanation: 'The 61st Constitutional Amendment in 1988 reduced the voting age from 21 to 18 years under Article 326.',
          explanation_hi: '1988 के 61वें संशोधन द्वारा अनुच्छेद 326 में संशोधन कर मतदान की आयु 21 वर्ष से घटाकर 18 वर्ष की गई।'
        },
        {
          question: 'Who conducts elections to Panchayats and Urban Local Bodies in India?',
          question_hi: 'भारत में पंचायतों और नगर निकायों के चुनाव कौन आयोजित करता है?',
          options: ['Election Commission of India', 'State Election Commission', 'District Magistrate', 'Ministry of Rural Development'],
          options_hi: ['भारत निर्वाचन आयोग', 'राज्य निर्वाचन आयोग (State Election Commission)', 'ज़िलाधिकारी', 'ग्रामीण विकास मंत्रालय'],
          correct_index: 1,
          explanation: 'State Election Commissions established under Article 243K conduct rural and urban local body elections.',
          explanation_hi: 'अनुच्छेद 243K के तहत गठित राज्य निर्वाचन आयोग पंचायतों एवं नगरपालिकाओं के चुनाव कराता है।'
        }
      ]
    },
    {
      slug: 'economics-rural-banking',
      title: 'Economics: Rural Banking & Financial Inclusion',
      title_hi: 'अर्थशास्त्र: ग्रामीण बैंकिंग एवं वित्तीय समावेशन',
      category: 'Economics',
      education_level: 'Higher Secondary & College',
      description: 'Learn how self-help groups, microcredit, and formal banking empower rural households.',
      description_hi: 'स्वयं सहायता समूह, किसान क्रेडिट कार्ड और औपचारिक बैंकिंग कैसे ग्रामीण आर्थिकी को मजबूत करते हैं।',
      time_limit_minutes: 5,
      total_questions: 5,
      difficulty: 'Intermediate',
      icon: '💰',
      is_daily_challenge: 0,
      questions: [
        {
          question: 'Which apex financial institution in India regulates and provides credit for agriculture and rural development?',
          question_hi: 'भारत में कृषि एवं ग्रामीण विकास हेतु ऋण व नियमन प्रदान करने वाली शीर्ष वित्तीय संस्था कौन सी है?',
          options: ['SEBI', 'NABARD (National Bank for Agriculture and Rural Development)', 'TRAI', 'SIDBI'],
          options_hi: ['सेबी (SEBI)', 'नाबार्ड (NABARD)', 'ट्राई (TRAI)', 'सिडबी (SIDBI)'],
          correct_index: 1,
          explanation: 'NABARD was set up in 1982 on the recommendation of the Shivaraman Committee to foster rural prosperity.',
          explanation_hi: 'नाबार्ड की स्थापना 1982 में ग्रामीण अर्थव्यवस्था, कृषि और कुटीर उद्योगों को ऋण सहायता देने हेतु की गई थी।'
        },
        {
          question: 'What is the primary role of Self-Help Groups (SHGs) in village communities?',
          question_hi: 'ग्रामीण समुदायों में स्वयं सहायता समूहों (SHGs) की मुख्य भूमिका क्या है?',
          options: ['Running political campaigns', 'Pooling small savings and providing collateral-free emergency loans to members', 'Building highways', 'Importing goods from abroad'],
          options_hi: ['राजनीतिक प्रचार करना', 'छोटी बचत एकत्र करना तथा सदस्यों को बिना गारंटी आपातकालीन ऋण देना', 'सड़कें बनाना', 'विदेशी सामान मंगाना'],
          correct_index: 1,
          explanation: 'SHGs promote thrift and mutual credit, freeing rural women from high-interest informal moneylenders.',
          explanation_hi: 'SHG महिलाओं में बचत की आदत डालते हैं और साहूकारों के भारी ब्याज के चंगुल से मुक्ति दिलाते हैं।'
        },
        {
          question: 'What is the main objective of the Kisan Credit Card (KCC) scheme?',
          question_hi: 'किसान क्रेडिट कार्ड (KCC) योजना का मुख्य उद्देश्य क्या है?',
          options: ['Providing free luxury cars', 'Providing adequate and timely institutional credit to farmers for crop cultivation and inputs', 'Free electricity forever', 'Waiving all future taxes'],
          options_hi: ['मुफ्त विलासिता कार देना', 'किसानों को खेती के लिए समय पर व कम ब्याज दर पर संस्थागत ऋण उपलब्ध कराना', 'मुफ्त बिजली देना', 'सभी कर माफ़ करना'],
          correct_index: 1,
          explanation: 'KCC enables farmers to buy seeds, fertilizers, and farm equipment without bureaucratic delays.',
          explanation_hi: 'KCC किसानों को बीज, खाद और कीटनाशक खरीदने के लिए उचित दर पर बैंक ऋण की सुविधा देता है।'
        },
        {
          question: 'What does "Financial Inclusion" broadly mean?',
          question_hi: '"वित्तीय समावेशन (Financial Inclusion)" का व्यापक अर्थ क्या है?',
          options: ['Every person becoming a billionaire', 'Providing universal access to affordable and fair financial services (savings, credit, insurance)', 'Printing unlimited currency notes', 'Closing down all regional banks'],
          options_hi: ['हर व्यक्ति का अरबपति बनना', 'सभी नागरिकों को वहनीय एवं सुरक्षित बैंकिंग, बचत, ऋण व बीमा सेवाओं तक पहुँच देना', 'असीमित नोट छापना', 'ग्रामीण बैंक बंद करना'],
          correct_index: 1,
          explanation: 'Financial inclusion ensures vulnerable rural and tribal families have access to formal savings, remittances, and credit.',
          explanation_hi: 'वित्तीय समावेशन का तात्पर्य वंचित तबकों को औपचारिक वित्तीय प्रणाली से जोड़ना है।'
        },
        {
          question: 'Under MGNREGA, how many days of guaranteed wage employment are provided per financial year to rural households?',
          question_hi: 'मनरेगा (MGNREGA) के तहत ग्रामीण परिवारों को एक वित्तीय वर्ष में कितने दिनों के गारंटीकृत रोजगार का अधिकार है?',
          options: ['50 Days', '100 Days', '150 Days', '365 Days'],
          options_hi: ['50 दिन', '100 दिन', '150 दिन', '365 दिन'],
          correct_index: 1,
          explanation: 'MGNREGA guarantees 100 days of unskilled manual work to every rural household whose adult members volunteer.',
          explanation_hi: 'मनरेगा ग्रामीण अकुशल कार्यबल को प्रति वर्ष कम से कम 100 दिन के काम की कानूनी गारंटी प्रदान करता है।'
        }
      ]
    },
    {
      slug: 'general-science-practice',
      title: 'General Science: Energy & Environment',
      title_hi: 'सामान्य विज्ञान: ऊर्जा, पर्यावरण एवं दैनिक प्रौद्योगिकी',
      category: 'Science',
      education_level: 'Class 10 & Competitive Prep',
      description: 'Test your understanding of physics, chemistry in the kitchen, and environmental protection.',
      description_hi: 'दैनिक जीवन में प्रयुक्त भौतिकी, रसोई का रसायन और पर्यावरण संतुलन से जुड़े मुख्य प्रश्न।',
      time_limit_minutes: 5,
      total_questions: 5,
      difficulty: 'Easy',
      icon: '⚡',
      is_daily_challenge: 0,
      questions: [
        {
          question: 'Which gas is primarily responsible for the natural and enhanced greenhouse effect on planet Earth?',
          question_hi: 'पृथ्वी पर ग्रीनहाउस प्रभाव और तापमान वृद्धि के लिए मुख्य रूप से कौन सी गैस उत्तरदायी है?',
          options: ['Oxygen (O2)', 'Carbon Dioxide (CO2)', 'Nitrogen (N2)', 'Helium (He)'],
          options_hi: ['ऑक्सीजन', 'कार्बन डाइऑक्साइड (CO2)', 'नाइट्रोजन', 'हीलियम'],
          correct_index: 1,
          explanation: 'Carbon dioxide traps infrared thermal radiation re-emitted by the Earth surface, warming the atmosphere.',
          explanation_hi: 'कार्बन डाइऑक्साइड पृथ्वी से निकलने वाले ऊष्मीय विकिरण को रोककर वातावरण को गर्म रखती है।'
        },
        {
          question: 'What is the basic functional and structural unit of life in all living organisms?',
          question_hi: 'सभी जीवित प्राणियों में जीवन की आधारभूत कार्यात्मक और संरचनात्मक इकाई क्या है?',
          options: ['Atom', 'Cell', 'Tissue', 'Organ System'],
          options_hi: ['परमाणु', 'कोशिका (Cell)', 'ऊतक', 'अंग तंत्र'],
          correct_index: 1,
          explanation: 'The cell is the smallest unit of life capable of independent reproduction and metabolic functions.',
          explanation_hi: 'कोशिका सभी जीवों की मौलिक संरचनात्मक और क्रियात्मक इकाई है।'
        },
        {
          question: 'Why do stars appear to twinkle when observed from the ground at night?',
          question_hi: 'रात में ज़मीन से देखने पर तारे टिमटिमाते हुए क्यों दिखाई देते हैं?',
          options: ['Stars constantly turn off and on', 'Atmospheric refraction of starlight through turbulent air layers of varying density', 'Reflected moon shadows', 'Solar wind interference'],
          options_hi: ['तारे लगातार जलते-बुझते हैं', 'वायुमंडल की विभिन्न घनत्व वाली परतों द्वारा तारों के प्रकाश का अपवर्तन (Refraction)', 'चंद्रमा की परछाई', 'सौर पवनों का व्यवधान'],
          correct_index: 1,
          explanation: 'As starlight passes through moving air layers of different temperatures, its apparent path bends continuously.',
          explanation_hi: 'वायुमंडल में हवा के विभिन्न तापमान और घनत्व के कारण प्रकाश का लगातार अपवर्तन होता है जिससे तारे टिमटिमाते हैं।'
        },
        {
          question: 'What energy transformation takes place in a solar photovoltaic cell?',
          question_hi: 'सौर फोटोवोल्टिक सेल (Solar Panel) में ऊर्जा का कौन सा रूपांतरण होता है?',
          options: ['Sound into electricity', 'Light energy directly into electrical energy', 'Heat into chemical energy', 'Magnetic into mechanical energy'],
          options_hi: ['ध्वनि का बिजली में', 'प्रकाश ऊर्जा का सीधे विद्युत ऊर्जा में', 'ऊष्मा का रासायनिक में', 'चुंबकीय का यांत्रिक में'],
          correct_index: 1,
          explanation: 'Solar photovoltaic cells utilize semiconductor materials (silicon) to convert photons directly into electric current.',
          explanation_hi: 'सोलर सेल सूर्य के प्रकाश (फोटॉन) को सिलिकॉन सेमीकंडक्टर द्वारा सीधे विद्युत धारा में बदलते हैं।'
        },
        {
          question: 'Which safety device protects domestic electrical appliances by melting when current exceeds safety limits?',
          question_hi: 'अत्यधिक विद्युत धारा प्रवाहित होने पर पिघलकर घर के उपकरणों को जलने से बचाने वाला सुरक्षा उपकरण कौन सा है?',
          options: ['Voltmeter', 'Electric Fuse wire', 'Thermometer', 'Ammeter'],
          options_hi: ['वोल्टमीटर', 'इलेक्ट्रिक फ्यूज़ (Electric Fuse)', 'थर्मामीटर', 'अमीटर'],
          correct_index: 1,
          explanation: 'A fuse wire has a low melting point and melts via Joule heating when current surges, breaking the circuit.',
          explanation_hi: 'फ्यूज तार का गलनांक कम होता है; अत्यधिक करंट आने पर यह गर्म होकर पिघल जाता है और परिपथ टूट जाता है।'
        }
      ]
    }
  ];

  for (const qz of quizzesData) {
    const qInsert = db.run(
      `INSERT INTO quizzes (slug, title, title_hi, category, education_level, description, description_hi, time_limit_minutes, total_questions, difficulty, icon, is_daily_challenge)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        qz.slug,
        qz.title,
        qz.title_hi,
        qz.category,
        qz.education_level,
        qz.description,
        qz.description_hi,
        qz.time_limit_minutes,
        qz.total_questions,
        qz.difficulty,
        qz.icon,
        qz.is_daily_challenge
      ]
    );
    const quizId = qInsert.lastInsertRowid;

    let qOrder = 1;
    for (const q of qz.questions) {
      db.run(
        `INSERT INTO quiz_questions (quiz_id, question, question_hi, options, options_hi, correct_index, explanation, explanation_hi, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quizId,
          q.question,
          q.question_hi,
          JSON.stringify(q.options),
          JSON.stringify(q.options_hi),
          q.correct_index,
          q.explanation,
          q.explanation_hi,
          qOrder++
        ]
      );
    }
  }
  console.log(`✓ 5 Rich Quizzes with 25 Questions seeded`);

  // 9. Seed Sample Quiz Attempt for Demo Student (80% score)
  const firstQuiz = db.get('SELECT id FROM quizzes ORDER BY id ASC LIMIT 1');
  if (firstQuiz) {
    db.run(
      `INSERT INTO quiz_attempts (user_id, quiz_id, score, total_questions, time_taken_seconds, user_answers)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [demoUserId, firstQuiz.id, 4, 5, 142, JSON.stringify([0, 1, 2, 0, 0])] // 4 correct out of 5
    );
    console.log(`✓ Demo quiz attempt seeded for student Rahul`);
  }

  console.log('🎉 EduSaarthi database successfully seeded!');
}

seed().catch(err => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});
