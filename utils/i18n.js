/**
 * EduSaarthi Internationalization Dictionary (English & Hindi)
 */

const translations = {
  en: {
    siteName: 'EduSaarthi',
    tagline: 'Learning Without Barriers',
    navHome: 'Home',
    navLearn: 'Learn',
    navTutor: 'AI Tutor',
    navScholarships: 'Scholarships',
    navCareer: 'Career Guidance',
    navMentors: 'Mentors',
    navLogin: 'Login',
    navRegister: 'Register',
    navLogout: 'Logout',
    navDashboard: 'Dashboard',
    lowDataOn: 'Low Data: ON',
    lowDataOff: 'Low Data Mode',
    onlineStatus: 'Online',
    offlineStatus: 'Offline',
    offlineBanner: "You're offline. Downloaded lessons are still available.",
    startLearning: 'Start Learning',
    exploreFeatures: 'Explore Features',
    downloadOffline: 'Download for Offline',
    availableOffline: '✓ Available Offline',
    requestMentoring: 'Request Mentoring',
    findOpportunities: 'Find Opportunities Made for You',
    discoverCareer: 'Discover Your Career Path'
  },
  hi: {
    siteName: 'एडू-सारथी',
    tagline: 'बाधाओं से मुक्त, समावेशी शिक्षा',
    navHome: 'होम',
    navLearn: 'पढ़ाई',
    navTutor: 'एआई ट्यूटर',
    navScholarships: 'छात्रवृत्तियां',
    navCareer: 'करियर मार्गदर्शन',
    navMentors: 'मार्गदर्शक (मेंटर)',
    navLogin: 'लॉग इन',
    navRegister: 'पंजीकरण',
    navLogout: 'लॉग आउट',
    navDashboard: 'डैशबोर्ड',
    lowDataOn: 'लो-डेटा: चालू',
    lowDataOff: 'लो-डेटा मोड',
    onlineStatus: 'ऑनलाइन',
    offlineStatus: 'ऑफ़लाइन',
    offlineBanner: 'आप ऑफ़लाइन हैं। आपके द्वारा डाउनलोड किए गए पाठ उपलब्ध हैं।',
    startLearning: 'पढ़ाई शुरू करें',
    exploreFeatures: 'सुविधाएं देखें',
    downloadOffline: 'ऑफ़लाइन के लिए डाउनलोड करें',
    availableOffline: '✓ ऑफ़लाइन उपलब्ध',
    requestMentoring: 'मेंटरिंग अनुरोध भेजें',
    findOpportunities: 'अपने लिए छात्रवृत्तियां खोजें',
    discoverCareer: 'अपना भविष्य और करियर मार्ग चुनें'
  }
};

function getTranslator(lang = 'hi') {
  const current = translations[lang] || translations.hi;
  return function (key) {
    return current[key] || translations.en[key] || key;
  };
}

module.exports = {
  translations,
  getTranslator
};
