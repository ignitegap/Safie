'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand & Navigation
  brandName: { en: 'Safie', hi: 'सेफ़ी' },
  tagline: { en: 'Move with clarity. Walk with certainty.', hi: 'रात में सुरक्षित घर पहुँचने का साथी।' },
  navOverview: { en: 'Overview', hi: 'मुख्य पृष्ठ' },
  navSafetyMap: { en: 'Route Finder', hi: 'रास्ता खोजें' },
  navStreetSurvey: { en: 'Street Survey', hi: 'सड़क सर्वे' },
  navSafetyTools: { en: 'Safety Tools', hi: 'सुरक्षा टूल्स' },
  navSafeHavens: { en: '24/7 Havens', hi: 'सुरक्षित ठिकाने' },
  navPhoneDemo: { en: 'Phone Simulator', hi: 'फोन डेमो' },
  navDownload: { en: 'Download App', hi: 'ऐप डाउनलोड' },
  switchLang: { en: 'हिंदी में देखें', hi: 'Switch to English' },

  // Hero Section
  heroBadge: { en: 'Pedestrian Safety Platform · Delhi NCR Pilot', hi: 'पैदल यात्री सुरक्षा · दिल्ली-एनसीआर पायलट' },
  heroHeadline: { en: 'Walk with certainty, even after dark.', hi: 'अंधेरे में भी बेख़ौफ़ चलिए, सुरक्षित घर पहुँचिए।' },
  heroSubhead: {
    en: 'Designed for women, students, and commuters walking late in Delhi and Gurugram. Routes prioritize well-lit streets, verified open shops, a 10-second safety switch, and emergency fake calls.',
    hi: 'दिल्ली और गुरुग्राम में रात को पैदल चलने वाली महिलाओं और यात्रियों के लिए। यह मैप छोटी अंधेरी गलियों की जगह रोशनी वाली चौड़ी सड़कों, खुली दुकानों और आपातकालीन सुरक्षा टूल्स को तरजीह देता है।'
  },
  heroCtaSimulator: { en: 'Launch Phone Simulator', hi: 'फोन में चलाकर देखें' },
  heroCtaDownload: { en: 'Download Android APK (7.9 MB)', hi: 'एंड्रॉइड ऐप डाउनलोड (7.9 MB)' },
  heroPillHold: { en: 'Hold thumb to stay safe', hi: 'सुरक्षा बटन: दबाए रखें' },
  heroPillDuress: { en: 'Fake Cancel PIN 9876', hi: 'हमलावर के सामने नकली पिन' },
  heroPillHavens: { en: '28 verified safe havens', hi: '28 सुरक्षित 24/7 ठिकाने' },
  heroPillFakeCall: { en: 'Escape fake call with voice', hi: 'बचने के लिए फर्जी कॉल' },

  // Metrics
  metricLights: { en: 'Verified Streetlights', hi: 'सड़क की बत्तियां' },
  metricLightsSub: { en: 'Covered thoroughfares', hi: 'रोशनी वाली सड़कें' },
  metricHavens: { en: '24/7 Safe Sanctuaries', hi: 'सुरक्षित दुकानें व थाने' },
  metricHavensSub: { en: 'Pharmacies, police & metro', hi: 'फार्मेसी, पुलिस व मेट्रो' },
  metricDetour: { en: 'Average Safety Detour', hi: 'अतिरिक्त सुरक्षित समय' },
  metricDetourSub: { en: 'Minutes added for safe path', hi: 'सिर्फ +2 मिनट सुरक्षित सड़क के लिए' },
  metricSurveys: { en: 'Community Street Audits', hi: 'जनता द्वारा सड़क रेटिंग' },
  metricSurveysSub: { en: 'Citizen verified reports', hi: 'यात्रियों की जाँची रिपोर्ट' },

  // Route Finder & Map
  routeSectionBadge: { en: 'Smart Pedestrian Routing', hi: 'सुरक्षित पैदल रास्ता' },
  routeSectionTitle: { en: 'Routes chosen for lighting, not just shortcuts', hi: 'शॉर्टकट नहीं, रोशनी और सुरक्षा वाला रास्ता चुनें' },
  routeSectionSub: {
    en: 'Google Maps often sends you through dark, lonely alleys to save 2 minutes. Safie keeps you on active, illuminated thoroughfares near open shops.',
    hi: 'गूगल मैप्स अक्सर 2 मिनट बचाने के लिए सुनसान अंधेरी गली में भेज देता है। सेफ़ी आपको रोशनी वाली चौड़ी सड़क और खुली दुकानों के पास रखता है।'
  },
  originPlaceholder: { en: 'Enter starting point (e.g. DLF Cyber Hub)', hi: 'कहाँ से चलना है (जैसे: साइबर हब)' },
  destPlaceholder: { en: 'Enter destination (e.g. Sector 29 Market)', hi: 'कहाँ जाना है (जैसे: सेक्टर 29)' },
  findRouteBtn: { en: 'Find Safest Walking Route', hi: 'सुरक्षित रास्ता खोजें' },
  calculatingRoute: { en: 'Evaluating streetlights & safe havens...', hi: 'रोशनी और खुली दुकानों की जाँच हो रही है...' },

  // Route Types
  routeBestSupported: { en: 'Best-Supported Safe Route', hi: 'सर्वश्रेष्ठ सुरक्षित मार्ग' },
  routeBalanced: { en: 'Balanced Route', hi: 'संतुलित मार्ग' },
  routeDirect: { en: 'Direct Shortcut (Dark Alley Warning)', hi: 'सीधा रास्ता (अंधेरी गली की चेतावनी)' },
  routeExplanationTitle: { en: 'Why Safie recommends this route:', hi: 'सेफ़ी यह रास्ता क्यों सुझाता है:' },
  routeSafeBadge: { en: 'Well-Lit Corridor', hi: 'रोशनी वाली सड़क' },
  routeDarkWarning: { en: 'Unlit Dark Spot Warning', hi: 'सावधान: अंधेरी गली' },

  // Personal Safety Tools
  toolsBadge: { en: 'Personal Emergency Shield', hi: 'व्यक्तिगत सुरक्षा टूल्स' },
  toolsTitle: { en: 'Life-saving protection right in your hand', hi: 'मुसीबत के समय आपकी ढाल' },
  toolsSub: {
    en: 'Simple, instinctive actions that keep you safe when walking alone after dusk.',
    hi: 'अकेले चलते समय डर लगे तो ये आसान टूल्स आपकी जान और सम्मान की रक्षा करते हैं।'
  },

  // Tool 1: Safety Hold
  toolHoldTitle: { en: 'Hold to Stay Safe Button', hi: 'सुरक्षा बटन (अंगूठा दबाए रखें)' },
  toolHoldDesc: {
    en: 'Keep your thumb on the button while walking through dark or deserted spots. If anything happens and you release it, a 10-second countdown begins before alerting family and police.',
    hi: 'अंधेरी या सुनसान जगह से गुजरते समय अंगूठा दबाकर रखें। अगर कोई छीना-झपटी हो और हाथ छूटे, तो 10 सेकंड में घर और पुलिस को अलर्ट पहुँच जाएगा।'
  },

  // Tool 2: Duress PIN
  toolDuressTitle: { en: 'Secret Duress PIN (9876)', hi: 'हमलावर के सामने वाला नकली पिन (9876)' },
  toolDuressDesc: {
    en: 'If forced by an attacker to cancel the alarm, entering 9876 secretly sends high-priority emergency alerts while deceptively showing "Alarm Cancelled" on the screen.',
    hi: 'अगर कोई हमलावर जबरन अलार्म बंद करने को कहे, तो 9876 डालें। स्क्रीन पर "अलार्म बंद" दिखेगा, पर चुपके से पुलिस और परिवार को आपकी लोकेशन चली जाएगी।'
  },

  // Tool 3: Fake Call
  toolFakeCallTitle: { en: 'Fake Call with Natural Voice', hi: 'बहाने के लिए फर्जी कॉल (आवाज़ के साथ)' },
  toolFakeCallDesc: {
    en: 'Trigger an incoming call from Bhaiya, Mom, or a Cab driver with realistic spoken Hindi/English audio so you have a natural reason to talk loudly and deter stalkers.',
    hi: 'शोहदों या पीछा करने वालों को भगाने के लिए तुरंत कॉल करवाएं। फोन पर भैया या मम्मी की आवाज़ सुनाई देगी ताकि आप जोर से बात करके सुरक्षित निकल सकें।'
  },

  // Tool 4: Watch Over Me Timer
  toolTimerTitle: { en: 'Timed Journey Check-In', hi: 'यात्रा सुरक्षा टाइमर ("Watch Over Me")' },
  toolTimerDesc: {
    en: 'Set a 15-minute timer for your walk. If you do not enter your safe PIN before time runs out, emergency contacts are automatically sent your live location.',
    hi: 'अपनी वॉक के लिए टाइमर लगाएं (जैसे 15 मिनट)। अगर समय खत्म होने से पहले आपने पिन नहीं डाला, तो अपने आप परिजनों को लोकेशन चली जाएगी।'
  },

  // Tool 5: Strobe & Siren
  toolSirenTitle: { en: 'Strobe Flash & High-Decibel Siren', hi: 'तेज़ सायरन और चमकती फ्लैशलाइट' },
  toolSirenDesc: {
    en: 'A 1-tap panic tool that sounds an ear-piercing siren and flashes your camera light rapidly to shock attackers and call immediate public attention.',
    hi: 'अचानक हमला होने पर एक बटन दबाते ही फोन तेज़ सायरन बजाएगा और कैमरे की लाइट तेज़ी से चमकेगी ताकि आस-पास के लोग मदद को दौड़ें।'
  },

  // Community Street Survey
  surveyBadge: { en: 'Community Street Survey', hi: 'जनता सड़क सुरक्षा सर्वे' },
  surveyTitle: { en: 'Know the condition of any street before you step out', hi: 'घर से निकलने से पहले जानें सड़क का हाल' },
  surveySub: {
    en: 'Check real public ratings on street lighting, crowd presence, and police visibility. Rate your own street in 15 seconds to help fellow commuters.',
    hi: 'देखिए किस सड़क पर कितनी रोशनी है और कहाँ भीड़ रहती है। सिर्फ 15 सेकंड में अपनी सड़क को रेट करके दूसरों की मदद करें।'
  },
  searchStreetPlaceholder: { en: 'Search street name or metro station...', hi: 'सड़क या मेट्रो स्टेशन का नाम लिखें...' },
  surveyRateThisStreet: { en: 'Rate This Street (15s)', hi: 'इस सड़क को रेट करें (15 सेकंड)' },
  surveyReportProblem: { en: 'Report Dark Spot / Broken Light', hi: 'अंधेरे या खराब लाइट की शिकायत करें' },

  // 4 Survey Pillars
  pillarLighting: { en: 'Lighting', hi: 'रोशनी' },
  pillarCrowd: { en: 'Crowd & Shops', hi: 'भीड़ व दुकानें' },
  pillarSecurity: { en: 'Guards & Police', hi: 'सुरक्षा व पुलिस' },
  pillarFootpath: { en: 'Footpath Condition', hi: 'पैदल रास्ता' },

  // Survey Ratings
  optBright: { en: 'Brightly Lit', hi: 'अच्छी रोशनी' },
  optDim: { en: 'Dim / Flickering', hi: 'कम रोशनी' },
  optDark: { en: 'Pitch Dark', hi: 'बिल्कुल अंधेरा' },
  optBusy: { en: 'Busy & Active', hi: 'भीड़-भाड़ / दुकानें खुली' },
  optModerate: { en: 'Some People', hi: 'कुछ लोग' },
  optDeserted: { en: 'Deserted / Empty', hi: 'सुनसान / कोई नहीं' },
  optSafe: { en: 'Felt Safe', hi: 'सुरक्षित महसूस हुआ' },
  optAlert: { en: 'Felt Uneasy', hi: 'थोड़ा डर लगा' },
  optUnsafe: { en: 'Felt Very Unsafe', hi: 'बहुत असुरक्षित' },

  // Modal Actions
  submitRating: { en: 'Submit Community Rating', hi: 'रेटिंग जमा करें' },
  ratingSuccess: { en: 'Thank you! Your rating helps fellow commuters walk safely.', hi: 'धन्यवाद! आपकी रेटिंग से अन्य यात्रियों को सुरक्षित रास्ता मिलेगा।' },
  closeBtn: { en: 'Close', hi: 'बंद करें' },
  cancelBtn: { en: 'Cancel', hi: 'रद्द करें' },

  // Live GPS & Guardian Circle
  gpsTrackingActive: { en: 'Live GPS Walking Companion Active', hi: 'लाइव जीपीएस वॉकिंग सुरक्षा चालू है' },
  gpsOffRouteAlert: { en: 'Alert: You have deviated from the safe lit corridor into an unmapped area.', hi: 'चेतावनी: आप रोशनी वाली सुरक्षित सड़क से हटकर सुनसान तरफ जा रहे हैं।' },
  gpsShareLink: { en: 'Share Live Location with Family', hi: 'परिवार के साथ लाइव लोकेशन शेयर करें' },
  navGuardianCircle: { en: 'Guardian Circle', hi: 'संरक्षक सर्कल' },
  tabGuardian: { en: 'Circle', hi: 'परिवार' },
  btnUneasy: { en: "I'm Feeling Uneasy", hi: 'असहज लग रहा है' },
  btnSafeArrival: { en: 'Confirm Safe Arrival', hi: 'सुरक्षित पहुँचे' },
  temporalTime: { en: 'Select Travel Time (Night Activity Curve)', hi: 'यात्रा का समय चुनें (नाइट एक्टिविटी कर्व)' },
  unexpectedStop: { en: 'Prolonged Stationary Stop Detected', hi: 'अचानक लंबे समय तक रुकने की चेतावनी' },
  infrastructureCoverage: { en: 'Verified Infrastructure Telemetry', hi: 'सत्यापित बुनियादी ढांचा डेटा' },
  cctvCount: { en: 'CCTV Surveillance Points', hi: 'सीसीटीवी कैमरे' },
  policeKiosks: { en: 'Active Police & PCR Kiosks', hi: 'पुलिस व पीसीआर चौकियां' },
  smartPoles: { en: 'Smart Streetlight Poles', hi: 'स्मार्ट स्ट्रीटलाइट पोल्स' },
  havensCount: { en: 'Verified 24/7 Sanctuaries', hi: '24/7 प्रमाणित ठिकाने' },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('safie_lang') as Language;
      if (savedLang === 'en' || savedLang === 'hi') {
        setLangState(savedLang);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('safie_lang', newLang);
    } catch (e) {
      // ignore
    }
  };

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][lang] || DICTIONARY[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
