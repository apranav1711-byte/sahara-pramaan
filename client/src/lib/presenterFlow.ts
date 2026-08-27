export type PresenterLanguage = "en" | "hi";

export function buildPresenterSteps(language: PresenterLanguage): string[] {
  if (language === "hi") {
    return [
      "त्वरित-आरंभ विकल्प खोलें और उपयुक्त मार्ग चुनें।",
      "पहले से भरे कृत्रिम खाते के विवरण के साथ आगे बढ़ें।",
      "सत्यापन पूरा करें या आवश्यकता होने पर परिवार-सहायता चुनें।",
      "कृत्रिम चिह्नित पुष्टि को देखें, सहेजें या प्रिंट करें।",
    ];
  }

  return [
    "Open Quick-start options and choose the appropriate route.",
    "Continue with the pre-filled synthetic account details.",
    "Complete verification or choose family assistance when needed.",
    "Review, save, or print the clearly marked synthetic confirmation.",
  ];
}

export function formatPresenterSteps(language: PresenterLanguage): string {
  return buildPresenterSteps(language).map((step, index) => `${index + 1}. ${step}`).join("\n");
}

export function presenterCopySuccess(language: PresenterLanguage): string {
  return language === "hi" ? "प्रस्तुति चरण कॉपी हो गए।" : "Presentation steps copied.";
}

export function formatPresenterCredentials(language: PresenterLanguage): string {
  if (language === "hi") {
    return [
      "सहारा प्रमाण — कृत्रिम वॉकथ्रू विवरण",
      "",
      "वैकल्पिक सत्यापन मार्ग",
      "आईडी: DEMO-FAIL",
      "मॉक OTP: 123456",
      "",
      "फिंगरप्रिंट सफलता मार्ग",
      "आईडी: DEMO-PASS",
      "मॉक OTP: 123456",
      "",
      "वैकल्पिक मार्गों के लिए",
      "आईडी: DEMO-MIXED",
      "मॉक OTP: 123456",
      "",
      "केवल कृत्रिम प्रोटोटाइप। कोई वास्तविक पहचान, पेंशन या संदेश सेवा जुड़ी नहीं है।",
    ].join("\n");
  }

  return [
    "Sahara Pramaan — synthetic walkthrough credentials",
    "",
    "Alternate verification route",
    "ID: DEMO-FAIL",
    "Mock OTP: 123456",
    "",
    "Fingerprint success route",
    "ID: DEMO-PASS",
    "Mock OTP: 123456",
    "",
    "Explore alternate routes",
    "ID: DEMO-MIXED",
    "Mock OTP: 123456",
    "",
    "Synthetic prototype only. No real identity, pension, or messaging service is connected.",
  ].join("\n");
}

export function presenterCredentialsCopySuccess(language: PresenterLanguage): string {
  return language === "hi" ? "कृत्रिम वॉकथ्रू विवरण कॉपी हो गए।" : "Synthetic walkthrough credentials copied.";
}
