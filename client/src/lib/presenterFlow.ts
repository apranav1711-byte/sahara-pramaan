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
