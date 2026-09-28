const express = require('express');
const router = express.Router();

const SYSTEM_PROMPT = `You are EduSaarthi, an educational AI tutor for students who may have limited access to educational resources. Explain concepts clearly and simply. Adapt explanations to the student's education level. If the user selects Hindi or asks in Hindi, answer in simple, natural Hindi. Use examples from everyday life (such as farming, daily household chores, bicycles, weather, nature) when useful. For academic questions, prioritize conceptual understanding. For mathematical problems, show step-by-step reasoning. Never pretend to know information you do not know. Keep your tone encouraging, patient, and warm.`;

// Curated educational responses for fallback mode when offline or no API key
const FALLBACK_TOPICS = {
  photosynthesis: {
    en: `### What is Photosynthesis?
Photosynthesis is how green plants make their own food using sunlight.

#### Simple Recipe:
1. **Raw Ingredients:** Carbon dioxide ($CO_2$) from air + Water ($H_2O$) from soil.
2. **Kitchen:** The green leaves containing **chlorophyll**.
3. **Stove/Heat Source:** **Sunlight**.
4. **Finished Dish:** Glucose (food for energy) + Oxygen ($O_2$) released for all living beings to breathe!

**Everyday Analogy:** Just like a farmer uses seeds, water, and sun to grow wheat, the leaf uses chlorophyll like solar panels to bake food.`,
    hi: `### प्रकाश संश्लेषण (Photosynthesis) क्या है?
प्रकाश संश्लेषण वह प्राकृतिक प्रक्रिया है जिसके द्वारा हरे पौधे सूर्य के प्रकाश की मदद से अपना भोजन स्वयं बनाते हैं।

#### आसान चरण:
1. **सामग्री:** हवा से कार्बन डाइऑक्साइड ($CO_2$) + जड़ों से पानी ($H_2O$)।
2. **रसोई घर:** हरी पत्तियां, जिनमें **क्लोरोफिल** (हरा वर्णक) होता है।
3. **ऊर्जा का स्रोत:** **सूर्य का प्रकाश**।
4. **तैयार भोजन:** ग्लूकोज (पौधों की वृद्धि के लिए) और **ऑक्सीजन** ($O_2$), जिससे हम सब सांस लेते हैं!

**दैनिक उदाहरण:** जैसे घर में चूल्हे की गर्मी और पानी-अनाज से भोजन पकता है, वैसे ही पत्तियां धूप की मदद से पौधे के लिए भोजन पकाती हैं।`
  },
  sky_blue: {
    en: `### Why is the Sky Blue?
Sunlight looks white, but it is actually made of all colors of the rainbow (VIBGYOR).

1. **Rayleigh Scattering:** As sunlight enters Earth's atmosphere, it collides with tiny gas molecules (Nitrogen and Oxygen).
2. **Short Wavelengths Scatter More:** Blue light travels in shorter, smaller waves than red light.
3. Therefore, blue light gets scattered in every direction all across the sky, reaching our eyes from everywhere above!`,
    hi: `### आकाश नीला क्यों दिखाई देता है?
सूर्य का प्रकाश हमें सफेद दिखता है, लेकिन वास्तव में यह सतरंगी (सात रंगों) से मिलकर बना है।

1. **प्रकाश का प्रकीर्णन (Scattering):** जब सूर्य की किरणें वायुमंडल में आती हैं, तो हवा के छोटे-छोटे कणों और गैसों से टकराती हैं।
2. **नीले रंग की तरंगें:** नीले रंग की तरंगदैर्ध्य (wavelength) सबसे छोटी होती है, इसलिए वह हवा में सबसे ज्यादा चारों तरफ बिखर (scatter) जाती है।
3. यही बिखरा हुआ नीला प्रकाश जब हमारी आंखों तक पहुंचता है, तो पूरा आसमान हमें नीला नजर आता है!`
  },
  newton_third: {
    en: `### Newton's Third Law of Motion
**"For every action, there is an equal and opposite reaction."**

#### Practical Examples:
1. **Walking on Muddy Soil:** When your foot pushes the ground backward (Action), the ground pushes your foot forward (Reaction).
2. **Swimming in a River:** You push the water backward with your arms, and the water pushes you forward.
3. **Firing a Slingshot or Gun:** The projectile speeds forward, while the handle recoils backward.`,
    hi: `### न्यूटन का तीसरा गति नियम (क्रिया-प्रतिक्रिया का नियम)
**"प्रत्येक क्रिया के बराबर और विपरीत दिशा में प्रतिक्रिया होती है।"**

#### दैनिक जीवन के उदाहरण:
1. **कदम आगे बढ़ाना:** जब हम चलते हैं, तो हमारा पैर जमीन को पीछे धकेलता है (क्रिया), और जमीन हमारे पैर को आगे धकेलती है (प्रतिक्रिया)।
2. **नदी में तैरना:** तैराक हाथों से पानी को पीछे धकेलता है, और पानी तैराक के शरीर को आगे भेजता है।
3. **नाव से कूदना:** जब आप किनारे पर नाव से आगे कूदते हैं, तो नाव पीछे की तरफ खिसक जाती है।`
  },
  math_problem: {
    en: `### Step-by-Step Math Problem Solving
To solve any algebraic or arithmetic problem:
1. **Identify the Given:** Write down what information is provided.
2. **Identify the Unknown:** Name the unknown quantity ($x$).
3. **Form the Equation:** Translate the word problem into a mathematical formula.
4. **Isolate the Variable:** Use inverse operations (+ / -, * / ÷) to find $x$.
5. **Verify:** Plug your answer back into the original question to check if it holds true!`,
    hi: `### गणित के प्रश्नों को चरणबद्ध हल करने का तरीका
1. **ज्ञात जानकारी लिखें:** प्रश्न में जो संख्याएं और शर्तें दी गई हैं, उन्हें अलग लिख लें।
2. **अज्ञात राशि मानें:** जो ज्ञात करना है उसे $x$ या कोई चर मानें।
3. **समीकरण बनाएं:** प्रश्न के अनुसार गणितीय संबंध स्थापित करें।
4. **हल करें:** दोनों पक्षों में जोड़, घटाव, गुणा या भाग करके $x$ का मान निकालें।
5. **पुष्टि करें:** उत्तर को मूल समीकरण में रखकर जांच लें कि वह सही बैठता है या नहीं!`
  }
};

// GET /tutor - Render AI Tutor Page
router.get('/', (req, res) => {
  res.render('tutor', {
    activeTab: 'tutor',
    initialMode: req.query.mode || 'text'
  });
});

// POST /api/ai/chat - Process Chat Query
router.post('/chat', async (req, res) => {
  const { message, language = 'hi', educationLevel = 'Class 10', history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const userQuery = message.trim();
  const lowerQuery = userQuery.toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. Attempt Gemini Live API Call if Key is present
  if (apiKey && apiKey.length > 5 && apiKey !== 'YOUR_GEMINI_API_KEY') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: `${SYSTEM_PROMPT}\nStudent Education Level: ${educationLevel}.\nTarget Response Language: ${language === 'hi' ? 'Hindi' : 'English'}.` }]
            },
            contents: [
              ...history.slice(-4).map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
              })),
              {
                role: 'user',
                parts: [{ text: userQuery }]
              }
            ],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 650
            }
          }),
          signal: AbortSignal.timeout(8000) // 8 second timeout to protect low bandwidth
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidate = data.candidates && data.candidates[0];
        if (candidate && candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          return res.json({
            reply: candidate.content.parts[0].text,
            source: 'gemini-live',
            language
          });
        }
      } else {
        console.warn('Gemini API returned error status:', response.status);
      }
    } catch (apiErr) {
      console.warn('Gemini API call failed or timed out:', apiErr.message);
    }
  }

  // 2. Resilient Educational Fallback Mode
  // Matches query concepts in both Hindi and English
  let matchedFallback = null;

  if (lowerQuery.includes('photo') || lowerQuery.includes('संश्लेषण') || lowerQuery.includes('प्रकाश')) {
    matchedFallback = language === 'hi' ? FALLBACK_TOPICS.photosynthesis.hi : FALLBACK_TOPICS.photosynthesis.en;
  } else if (lowerQuery.includes('sky') || lowerQuery.includes('blue') || lowerQuery.includes('नीला') || lowerQuery.includes('आसमान') || lowerQuery.includes('आकाश')) {
    matchedFallback = language === 'hi' ? FALLBACK_TOPICS.sky_blue.hi : FALLBACK_TOPICS.sky_blue.en;
  } else if (lowerQuery.includes('newton') || lowerQuery.includes('न्यूटन') || lowerQuery.includes('third law') || lowerQuery.includes('गति')) {
    matchedFallback = language === 'hi' ? FALLBACK_TOPICS.newton_third.hi : FALLBACK_TOPICS.newton_third.en;
  } else if (lowerQuery.includes('math') || lowerQuery.includes('गणित') || lowerQuery.includes('हल') || lowerQuery.includes('solve')) {
    matchedFallback = language === 'hi' ? FALLBACK_TOPICS.math_problem.hi : FALLBACK_TOPICS.math_problem.en;
  }

  if (matchedFallback) {
    return res.json({
      reply: matchedFallback,
      source: 'offline-knowledge-base',
      language
    });
  }

  // Generic intelligent learning assistance fallback
  const genericResponse = (language === 'hi')
    ? `### आपकी जिज्ञासा का स्वागत है!\n\nआपने पूछा: **"${userQuery}"**\n\n- **मुख्य विचार:** यह अवधारणा आपके पाठ्यक्रम के महत्वपूर्ण सिद्धांतों से जुड़ी है। इसे समझने के लिए पहले इसके मूल घटकों को छोटे चरणों में बाँटना सबसे अच्छा होता है।\n- **दैनिक उदाहरण:** जिस प्रकार घर या खेत में हम पहले एक काम पूरा करते हैं फिर दूसरा, उसी प्रकार विज्ञान और गणित में भी हर नियम पिछले नियम पर आधारित होता है।\n\n*(नोट: विस्तृत सजीव उत्तर के लिए अपना GEMINI_API_KEY .env में जोड़ें। एडू-सारथी बिना इंटरनेट भी आपके आवश्यक विषयों का मार्गदर्शन करता है।)*`
    : `### Great question!\n\nYou asked: **"${userQuery}"**\n\n- **Core Concept:** This connects to foundational principles in your curriculum. Breaking it down step-by-step makes it easiest to understand.\n- **Everyday Analogy:** Just like constructing a wall requires placing one brick securely at a time, complex academic problems are solved by addressing each step sequentially.\n\n*(Note: Running in offline fallback educational mode. Configure GEMINI_API_KEY in .env for custom live generative responses.)*`;

  return res.json({
    reply: genericResponse,
    source: 'educational-fallback',
    language
  });
});

module.exports = router;
