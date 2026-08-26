import { useEffect, useMemo, useState } from "react";
import {
  Accessibility, ArrowLeft, ArrowRight, Bell, Camera, Check, ChevronRight, CircleHelp,
  ClipboardCheck, Contrast, Copy, Ear, Fingerprint, HeartHandshake, Info, Landmark,
  Languages, LocateFixed, MapPin, Menu, Mic, Phone, RefreshCw, Route, Send, ShieldCheck,
  Sparkles, TimerReset, UserRoundCheck, UsersRound, Volume2, X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { FAMILY_STATUS_POLL_MS } from "../../../shared/prototypeConfig";

type Screen = "landing" | "login" | "home" | "fingerprint" | "fallback" | "liveness" | "familyLink" | "confirmation" | "camps" | "reminders" | "how";
type Lang = "en" | "hi";

const text = {
  en: {
    prototype: "INDEPENDENT PROTOTYPE • SYNTHETIC DATA ONLY",
    welcome: "A calmer way to complete your yearly life-certificate step.",
    begin: "Begin securely",
    demo: "View demo accounts",
    login: "Sign in to your prototype account",
    identifier: "Pension ID or mobile number",
    otp: "Six-digit mock OTP",
    continue: "Continue",
    due: "Your certificate is due",
    protect: "Complete this small step to keep your pension status active in this demo.",
    verify: "Start verification",
    help: "Need help instead?",
    simulated: "Simulated only",
    how: "How this works",
    welcomeBack: "Welcome back",
    read: "Read this aloud",
    noMessages: "No real messages are ever sent.",
  },
  hi: {
    prototype: "स्वतंत्र प्रोटोटाइप • केवल कृत्रिम डेटा",
    welcome: "आपके वार्षिक जीवन प्रमाण चरण को पूरा करने का एक आसान तरीका।",
    begin: "सुरक्षित रूप से शुरू करें",
    demo: "डेमो खाते देखें",
    login: "अपने प्रोटोटाइप खाते में साइन इन करें",
    identifier: "पेंशन आईडी या मोबाइल नंबर",
    otp: "छह अंकों का मॉक OTP",
    continue: "आगे बढ़ें",
    due: "आपका प्रमाणपत्र देय है",
    protect: "इस डेमो में अपनी पेंशन स्थिति सक्रिय रखने के लिए यह छोटा चरण पूरा करें।",
    verify: "सत्यापन शुरू करें",
    help: "क्या आपको सहायता चाहिए?",
    simulated: "केवल सिमुलेशन",
    how: "यह कैसे काम करता है",
    welcomeBack: "वापसी पर स्वागत है",
    read: "इसे सुनें",
    noMessages: "कोई वास्तविक संदेश नहीं भेजा जाता।",
  },
};

const hindiDisplay: Record<string, string> = {
  "Assisted certificate prototype": "सहायता प्रमाणपत्र प्रोटोटाइप",
  "Comfort controls": "सुविधा नियंत्रण",
  "Larger text": "बड़ा पाठ",
  "Increase type across the prototype": "पूरे प्रोटोटाइप में अक्षर बड़े करें",
  "High contrast": "उच्च कंट्रास्ट",
  "Increase color contrast": "रंगों का अंतर बढ़ाएँ",
  "Language": "भाषा",
  "Uses your device’s built-in voice": "आपके उपकरण की अंतर्निहित आवाज़ का उपयोग करता है",
  "Reset synthetic demo": "कृत्रिम डेमो रीसेट करें",
  "A more human way to stay on track.": "आसानी से आगे बढ़ने का अधिक मानवीय तरीका।",
  "A more": "एक अधिक",
  "human": "मानवीय",
  "way to stay on track.": "तरीका जिससे आप आगे बढ़ते रहें।",
  "Built with large, calm steps for pensioners—and a simple family-assist route when an extra hand is needed.": "पेंशनभोगियों के लिए बड़े, सरल चरणों और ज़रूरत पड़ने पर परिवार-सहायता मार्ग के साथ बनाया गया।",
  "Alternative paths": "वैकल्पिक तरीके",
  "Family assistance": "परिवार की सहायता",
  "Plain-language status": "सरल भाषा में स्थिति",
  "DUE THIS MONTH": "इस महीने देय",
  "GOOD MORNING, KAMALA JI": "सुप्रभात, कमला जी",
  "Your yearly step is ready when you are.": "आपका वार्षिक चरण आपके तैयार होने पर शुरू हो सकता है।",
  "NEXT STEP": "अगला चरण",
  "Verify your life certificate": "अपना जीवन प्रमाणपत्र सत्यापित करें",
  "Continue gently": "आसानी से आगे बढ़ें",
  "Built for": "बनाया गया है",
  "everyday ease": "हर दिन की सहजता के लिए",
  "A simple start, with no real data.": "एक सरल शुरुआत, बिना किसी वास्तविक डेटा के।",
  "This is a synthetic login for a public prototype. It does not connect to any real pension, bank, identity, or messaging system.": "यह सार्वजनिक प्रोटोटाइप के लिए कृत्रिम लॉगिन है। यह किसी वास्तविक पेंशन, बैंक, पहचान या संदेश प्रणाली से नहीं जुड़ता।",
  "FALLBACK DEMO": "वैकल्पिक डेमो",
  "FINGERPRINT-PASS DEMO": "फिंगरप्रिंट-सफल डेमो",
  "Back": "वापस",
  "Sign in to your prototype account": "अपने प्रोटोटाइप खाते में साइन इन करें",
  "Enter a synthetic ID and mock OTP. For the best recording flow, keep the pre-filled forced-failure account.": "कृत्रिम आईडी और मॉक OTP दर्ज करें। बेहतर रिकॉर्डिंग के लिए पहले से भरे असफलता खाते का उपयोग करें।",
  "No real messages are ever sent.": "कोई वास्तविक संदेश कभी नहीं भेजा जाता।",
  "YOUR PROTOTYPE STATUS": "आपकी प्रोटोटाइप स्थिति",
  "Due soon": "जल्द देय",
  "Submitted in this demo": "इस डेमो में जमा किया गया",
  "Family assistance pending": "परिवार सहायता की प्रतीक्षा है",
  "Your yearly step is complete in this demo.": "इस डेमो में आपका वार्षिक चरण पूरा हो गया है।",
  "Your synthetic record is marked complete. Keep this screen open while demonstrating the family-assist update.": "आपका कृत्रिम रिकॉर्ड पूर्ण चिह्नित है। परिवार सहायता अपडेट दिखाते समय यह स्क्रीन खुली रखें।",
  "Start verification": "सत्यापन शुरू करें",
  "Find a mock camp": "मॉक शिविर खोजें",
  "Last submission": "पिछला जमा",
  "Preferred language": "पसंदीदा भाषा",
  "Reference": "संदर्भ",
  "Synthetic only": "केवल कृत्रिम",
  "Choose what feels comfortable.": "वही चुनें जो आरामदायक लगे।",
  "Switch language, text size, contrast, or read the screen aloud at any time.": "कभी भी भाषा, पाठ आकार, कंट्रास्ट बदलें या स्क्रीन को सुनें।",
  "Gentle reminders": "सौम्य अनुस्मारक",
  "Review preferences": "पसंदों की समीक्षा करें",
  "SIMULATED FINGERPRINT CHECK": "सिमुलेटेड फिंगरप्रिंट जाँच",
  "Place your finger gently.": "अपनी उंगली हल्के से रखें।",
  "This prototype is checking a synthetic fingerprint. No biometric image is captured, stored, or matched.": "यह प्रोटोटाइप कृत्रिम फिंगरप्रिंट की जाँच कर रहा है। कोई बायोमेट्रिक छवि कैप्चर, संग्रहित या मिलान नहीं की जाती।",
  "Checking your demo account…": "आपका डेमो खाता जाँचा जा रहा है…",
  "SIMULATED FINGERPRINT DID NOT MATCH": "सिमुलेटेड फिंगरप्रिंट मेल नहीं खाया",
  "That is okay. You have options.": "कोई बात नहीं। आपके पास विकल्प हैं।",
  "This prototype intentionally forces a fingerprint failure for this demo account, so you can see the available alternatives.": "यह प्रोटोटाइप इस डेमो खाते के लिए जानबूझकर फिंगरप्रिंट असफलता दिखाता है, ताकि आप उपलब्ध विकल्प देख सकें।",
  "Try face & liveness": "चेहरा और लाइवनेस आज़माएँ",
  "A short simulated camera step. No face matching happens.": "एक छोटा सिमुलेटेड कैमरा चरण। चेहरे का कोई मिलान नहीं होता।",
  "Try this": "यह आज़माएँ",
  "Ask family to help": "परिवार से सहायता माँगें",
  "Share a low-friction link for assisted completion—not impersonation.": "सहायता से पूरा करने के लिए आसान लिंक साझा करें—किसी का रूप धारण करने के लिए नहीं।",
  "Create link": "लिंक बनाएँ",
  "Browse locations": "स्थान देखें",
  "Prototype disclosure:": "प्रोटोटाइप सूचना:",
  "These are simulated options. No real biometrics, camp schedules, SMS, voice calls, banks, or government systems are connected.": "ये सिमुलेटेड विकल्प हैं। कोई वास्तविक बायोमेट्रिक, शिविर समय-सारिणी, SMS, वॉइस कॉल, बैंक या सरकारी प्रणाली नहीं जुड़ी है।",
  "SIMULATED FACE & LIVENESS": "सिमुलेटेड चेहरा और लाइवनेस",
  "A small live moment.": "एक छोटा लाइव क्षण।",
  "We can show your camera preview, but no face image is recorded or matched. This is a timed visual simulation only.": "हम कैमरा पूर्वावलोकन दिखा सकते हैं, लेकिन चेहरे की कोई छवि रिकॉर्ड या मिलान नहीं की जाती। यह केवल समयबद्ध दृश्य सिमुलेशन है।",
  "Allow camera preview": "कैमरा पूर्वावलोकन की अनुमति दें",
  "Continue without a camera": "कैमरे के बिना आगे बढ़ें",
  "Complete simulated liveness": "सिमुलेटेड लाइवनेस पूरा करें",
  "FAMILY ASSIST": "परिवार सहायता",
  "Share support, not your identity.": "सहायता साझा करें, अपनी पहचान नहीं।",
  "This link lets a family member complete a synthetic assistance step. It is explicitly a prototype, not a secure or production-ready verification method.": "यह लिंक परिवार के सदस्य को कृत्रिम सहायता चरण पूरा करने देता है। यह स्पष्ट रूप से प्रोटोटाइप है, सुरक्षित या उत्पादन-तैयार सत्यापन विधि नहीं।",
  "FAMILY-ASSIST LINK": "परिवार-सहायता लिंक",
  "Copy link": "लिंक कॉपी करें",
  "Return to pensioner status": "पेंशनभोगी स्थिति पर लौटें",
  "View mock camps": "मॉक शिविर देखें",
  "ASSISTED PROTOTYPE": "सहायता प्रोटोटाइप",
  "A small moment of help can make a big difference.": "सहायता का छोटा क्षण बड़ा अंतर ला सकता है।",
  "You are assisting a family member. This prototype is not a secure identity-verification method and must never be used to impersonate anyone.": "आप परिवार के सदस्य की सहायता कर रहे हैं। यह प्रोटोटाइप सुरक्षित पहचान-सत्यापन विधि नहीं है और इसका उपयोग कभी भी किसी का रूप धारण करने के लिए नहीं होना चाहिए।",
  "Yearly certificate support": "वार्षिक प्रमाणपत्र सहायता",
  "ASSISTING, NOT IMPERSONATING": "सहायता कर रहे हैं, रूप धारण नहीं",
  "A quick shared-memory check.": "एक त्वरित साझा-स्मृति जाँच।",
  "Complete assisted verification": "सहायता सत्यापन पूरा करें",
  "Support completed.": "सहायता पूरी हुई।",
  "Kamala ji’s prototype status has updated. The pensioner window will reflect this automatically within a few seconds.": "कमला जी की प्रोटोटाइप स्थिति अपडेट हो गई है। पेंशनभोगी विंडो कुछ सेकंड में यह बदलाव दिखाएगी।",
  "Your prototype submission is complete.": "आपका प्रोटोटाइप जमा पूरा हो गया है।",
  "SYNTHETIC PROTOTYPE — NOT A GOVERNMENT CERTIFICATE": "कृत्रिम प्रोटोटाइप — सरकारी प्रमाणपत्र नहीं",
  "Verification path": "सत्यापन मार्ग",
  "Status": "स्थिति",
  "Marked complete in demo": "डेमो में पूर्ण चिह्नित",
  "Save image": "छवि सहेजें",
  "Set mock reminders": "मॉक अनुस्मारक सेट करें",
  "Share status": "स्थिति साझा करें",
  "Illustrative help near you.": "आपके पास उदाहरणात्मक सहायता।",
  "MOCK PINCODE": "मॉक पिनकोड",
  "MOCK DISTANCE VIEW": "मॉक दूरी दृश्य",
  "A gentle nudge, on your terms.": "आपकी शर्तों पर एक सौम्य याद दिलाना।",
  "Mock SMS reminder": "मॉक SMS अनुस्मारक",
  "Mock voice-call reminder": "मॉक वॉइस-कॉल अनुस्मारक",
  "Also remind a family member": "परिवार के सदस्य को भी याद दिलाएँ",
  "Save mock preferences": "मॉक पसंद सहेजें",
  "HONESTY DISCLOSURE": "ईमानदारी सूचना",
  "Designed to make the limits unmistakably clear.": "सीमाओं को बिल्कुल स्पष्ट करने के लिए डिज़ाइन किया गया।",
  "What you are seeing": "आप क्या देख रहे हैं",
  "What is simulated": "क्या सिमुलेटेड है",
  "At scale, for real": "वास्तविक स्तर पर",
  "Independent prototype. No government, bank, biometric, or messaging system is connected.": "स्वतंत्र प्रोटोटाइप। कोई सरकारी, बैंक, बायोमेट्रिक या संदेश प्रणाली नहीं जुड़ी है।",
  "Read the full mock-data disclosure": "पूर्ण मॉक-डेटा सूचना पढ़ें",
};

function Button({ children, onClick, variant = "primary", icon: Icon, disabled = false, className = "" }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "light" | "ghost" | "sun"; icon?: React.ElementType; disabled?: boolean; className?: string;
}) {
  const styles = {
    primary: "bg-sahara-ink text-white shadow-lg shadow-sahara-ink/15 hover:bg-sahara-forest",
    light: "bg-white text-sahara-ink border border-sahara-ink/10 hover:border-sahara-ink/25 hover:bg-sahara-mist",
    ghost: "bg-transparent text-sahara-ink hover:bg-sahara-ink/5",
    sun: "bg-sahara-sun text-sahara-ink shadow-lg shadow-sahara-sun/20 hover:brightness-105",
  };
  return <button disabled={disabled} onClick={onClick} className={`contrast-dark inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-bold transition duration-200 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}>
    {children}{Icon && <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />}
  </button>;
}

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (next: boolean) => void; label: string; description?: string }) {
  return <button onClick={() => onChange(!checked)} role="switch" aria-checked={checked} className="flex w-full items-center gap-4 rounded-2xl border border-sahara-ink/10 bg-white px-4 py-4 text-left transition hover:border-sahara-ink/25 active:scale-[.99]">
    <span className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-sahara-forest" : "bg-slate-200"}`}><span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "left-6" : "left-1"}`} /></span>
    <span><span className="block font-bold text-sahara-ink">{label}</span>{description && <span className="mt-0.5 block text-sm text-slate-500">{description}</span>}</span>
  </button>;
}

function StatusPill({ status }: { status: "due" | "in_progress" | "pending_family" | "submitted" }) {
  const info = {
    due: ["Due soon", "bg-sahara-sun/20 text-sahara-ink"],
    in_progress: ["In progress", "bg-sky-100 text-sky-800"],
    pending_family: ["Family assistance pending", "bg-violet-100 text-violet-800"],
    submitted: ["Submitted in this demo", "bg-emerald-100 text-emerald-800"],
  }[status];
  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${info[1]}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{info[0]}</span>;
}

function Shell({ children, screen, setScreen, lang, setLang, large, setLarge, contrast, setContrast, onReset }: {
  children: React.ReactNode; screen: Screen; setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void; large: boolean; setLarge: (value: boolean) => void; contrast: boolean; setContrast: (value: boolean) => void; onReset: () => void;
}) {
  const copy = text[lang];
  const [menu, setMenu] = useState(false);
  const speak = () => {
    if (!("speechSynthesis" in window)) return toast.error("Read-aloud is not supported in this browser.");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(document.querySelector("main")?.textContent?.slice(0, 1200) || "");
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    window.speechSynthesis.speak(utterance);
  };
  return <div className={`${large ? "large-type" : ""} ${contrast ? "high-contrast" : ""} min-h-screen overflow-x-hidden bg-sahara-cream paper-noise`}>
    <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 sm:px-7 lg:px-10">
      <header className="z-30 flex items-center justify-between py-5 sm:py-7">
        <button onClick={() => setScreen("landing")} className="group flex items-center gap-3 text-left" aria-label="Return to Sahara Pramaan home">
          <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-sahara-ink text-white shadow-lg shadow-sahara-ink/20"><span className="absolute -bottom-3 -right-2 h-8 w-8 rounded-full border-[5px] border-sahara-sun"/><Landmark className="relative h-5 w-5" /></span>
          <span><span className="font-display block text-[21px] font-semibold leading-none tracking-[-.04em]">Sahara Pramaan</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[.15em] text-sahara-forest">Assisted certificate prototype</span></span>
        </button>
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={speak} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-sahara-ink hover:bg-white"><Volume2 className="h-4 w-4" />{copy.read}</button>
          <button onClick={() => setScreen("how")} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-sahara-ink hover:bg-white"><Info className="h-4 w-4" />{copy.how}</button>
          <button onClick={() => setMenu(!menu)} className="grid h-11 w-11 place-items-center rounded-xl bg-white text-sahara-ink shadow-sm ring-1 ring-sahara-ink/10"><Menu className="h-5 w-5" /></button>
        </div>
        <button onClick={() => setMenu(!menu)} className="grid h-11 w-11 place-items-center rounded-xl bg-white text-sahara-ink shadow-sm ring-1 ring-sahara-ink/10 md:hidden"><Menu className="h-5 w-5" /></button>
      </header>
      {menu && <div className="absolute right-4 top-20 z-50 w-[min(340px,calc(100%-2rem))] rounded-[26px] border border-sahara-ink/10 bg-white p-4 shadow-2xl shadow-sahara-ink/15 page-enter sm:right-7 lg:right-10">
        <div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold text-sahara-ink">Comfort controls</p><button onClick={() => setMenu(false)} className="rounded-lg p-2 hover:bg-sahara-mist"><X className="h-4 w-4" /></button></div>
        <div className="space-y-2">
          <Toggle checked={large} onChange={setLarge} label="Larger text" description="Increase type across the prototype" />
          <Toggle checked={contrast} onChange={setContrast} label="High contrast" description="Increase color contrast" />
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-sahara-ink/10 px-4 text-left hover:border-sahara-ink/25"><span className="flex items-center gap-3"><Languages className="h-5 w-5 text-sahara-forest"/><span><span className="block font-bold">Language</span><span className="text-sm text-slate-500">{lang === "en" ? "English" : "हिन्दी"}</span></span></span><ChevronRight className="h-4 w-4" /></button>
          <button onClick={speak} className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-sahara-ink/10 px-4 text-left hover:border-sahara-ink/25"><Volume2 className="h-5 w-5 text-sahara-forest"/><span><span className="block font-bold">{copy.read}</span><span className="text-sm text-slate-500">Uses your device’s built-in voice</span></span></button>
        </div>
        <div className="mt-4 border-t border-sahara-ink/10 pt-3"><button onClick={() => { onReset(); setMenu(false); }} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-sm font-bold text-sahara-coral hover:bg-orange-50"><TimerReset className="h-4 w-4" />Reset synthetic demo</button><button onClick={() => { setScreen("how"); setMenu(false); }} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-sm font-bold text-sahara-ink hover:bg-sahara-mist"><CircleHelp className="h-4 w-4" />{copy.how}</button></div>
      </div>}
      <main className="flex flex-1 flex-col pb-7">{children}</main>
      <footer className="flex flex-col gap-2 border-t border-sahara-ink/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Independent prototype. No government, bank, biometric, or messaging system is connected.</span><button onClick={() => setScreen("how")} className="text-left font-bold text-sahara-forest underline decoration-sahara-forest/30 underline-offset-4">Read the full mock-data disclosure</button></footer>
    </div>
  </div>;
}

function AppMark({ className = "" }: { className?: string }) { return <span className={`grid place-items-center rounded-2xl bg-sahara-mint text-sahara-forest ${className}`}><Landmark className="h-5 w-5" /></span>; }

export default function Home() {
  const initialAssist = new URLSearchParams(window.location.search).get("assist");
  const [screen, setScreenState] = useState<Screen>(initialAssist ? "home" : "landing");
  const [lang, setLang] = useState<Lang>(() => localStorage.getItem("sahara-pramaan-language") === "hi" ? "hi" : "en");
  const [large, setLarge] = useState(() => localStorage.getItem("sahara-pramaan-large-type") === "true");
  const [contrast, setContrast] = useState(() => localStorage.getItem("sahara-pramaan-high-contrast") === "true");
  const [pensionerId, setPensionerId] = useState<string | null>(null);
  const [assistToken, setAssistToken] = useState(initialAssist);
  const [verificationMethod, setVerificationMethod] = useState<"fingerprint" | "liveness" | "family" | undefined>();
  const [identifier, setIdentifier] = useState("DEMO-FAIL");
  const [otp, setOtp] = useState("123456");
  const [pincode, setPincode] = useState("110001");
  const [cameraAllowed, setCameraAllowed] = useState<boolean | null>(null);
  const [familyAnswer, setFamilyAnswer] = useState("");
  const [linkCreated, setLinkCreated] = useState<{ token: string; code: string } | null>(null);

  const copy = text[lang];
  const profileQuery = trpc.prototype.pensioner.useQuery({ pensionerId: pensionerId || "pensioner-demo-fail" }, { enabled: Boolean(pensionerId), refetchInterval: screen === "home" && pensionerId ? FAMILY_STATUS_POLL_MS : false });
  const familyQuery = trpc.prototype.familyLink.useQuery({ token: assistToken || "inactive" }, { enabled: Boolean(assistToken), refetchInterval: assistToken ? FAMILY_STATUS_POLL_MS : false });
  const campsQuery = trpc.prototype.camps.useQuery({ pincode });
  const loginMutation = trpc.prototype.login.useMutation();
  const fingerprintMutation = trpc.prototype.fingerprint.useMutation();
  const livenessMutation = trpc.prototype.liveness.useMutation();
  const createLinkMutation = trpc.prototype.createFamilyLink.useMutation();
  const verifyFamilyMutation = trpc.prototype.verifyFamily.useMutation();
  const reminderMutation = trpc.prototype.reminder.useMutation();
  const resetMutation = trpc.prototype.reset.useMutation();

  const setScreen = (next: Screen) => {
    setScreenState(next);
    if (next !== "home" || !assistToken) window.history.replaceState({}, "", window.location.pathname);
  };

  useEffect(() => {
    if (familyQuery.data) setLang(familyQuery.data.profile.preferredLanguage);
  }, [familyQuery.data]);

  useEffect(() => {
    localStorage.setItem("sahara-pramaan-language", lang);
    localStorage.setItem("sahara-pramaan-large-type", String(large));
    localStorage.setItem("sahara-pramaan-high-contrast", String(contrast));
  }, [lang, large, contrast]);

  useEffect(() => {
    const root = document.querySelector("#root");
    if (!root) return;
    const reverseDictionary = Object.fromEntries(Object.entries(hindiDisplay).map(([english, hindi]) => [hindi, english]));
    const translate = (value: string) => {
      const leading = value.match(/^\s*/)?.[0] || "";
      const trailing = value.match(/\s*$/)?.[0] || "";
      const key = value.trim();
      const english = reverseDictionary[key] || key;
      return `${leading}${lang === "hi" ? hindiDisplay[english] || english : english}${trailing}`;
    };
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) nodes.push(node as Text);
    nodes.forEach(textNode => { textNode.textContent = translate(textNode.textContent || ""); });
    root.querySelectorAll<HTMLInputElement>("input[placeholder]").forEach(input => {
      const placeholder = input.getAttribute("placeholder") || "";
      const english = reverseDictionary[placeholder] || placeholder;
      input.setAttribute("placeholder", lang === "hi" ? hindiDisplay[english] || english : english);
    });
  }, [lang, screen, pensionerId, assistToken]);

  const profile = profileQuery.data?.profile;
  const state = profileQuery.data?.state;
  const isAssist = Boolean(assistToken);
  const familyData = familyQuery.data;

  const resetDemo = () => resetMutation.mutate(undefined, { onSuccess: () => { setPensionerId(null); setAssistToken(null); setLinkCreated(null); setVerificationMethod(undefined); setScreenState("landing"); window.history.replaceState({}, "", window.location.pathname); toast.success("Synthetic demo reset. You are ready for a fresh recording take."); } });

  const handleLogin = () => loginMutation.mutate({ identifier, otp }, { onSuccess: data => { setPensionerId(data.pensionerId); setScreen("home"); toast.success(`Welcome, ${data.displayName}.`); }, onError: error => toast.error(error.message) });

  const beginFingerprint = () => {
    if (!pensionerId) return;
    setScreen("fingerprint");
    window.setTimeout(() => fingerprintMutation.mutate({ pensionerId }, { onSuccess: result => { if (result.passed) { setVerificationMethod("fingerprint"); setScreen("confirmation"); } else setScreen("fallback"); }, onError: error => { toast.error(error.message); setScreen("home"); } }), 1600);
  };

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({ video: true });
      stream?.getTracks().forEach(track => track.stop());
      setCameraAllowed(true);
    } catch { setCameraAllowed(false); }
  };

  const completeLiveness = () => {
    if (!pensionerId) return;
    livenessMutation.mutate({ pensionerId }, { onSuccess: () => { setVerificationMethod("liveness"); setScreen("confirmation"); }, onError: error => toast.error(error.message) });
  };

  const createFamilyLink = () => {
    if (!pensionerId) return;
    createLinkMutation.mutate({ pensionerId }, { onSuccess: data => { setLinkCreated({ token: data.token, code: data.code }); setScreen("familyLink"); }, onError: error => toast.error(error.message) });
  };

  const copyLink = async () => {
    if (!linkCreated) return;
    const url = `${window.location.origin}${window.location.pathname}?assist=${linkCreated.token}`;
    try { await navigator.clipboard.writeText(url); toast.success("Family-assist link copied."); } catch { toast.message("Copy this link from the field below."); }
  };

  const completeFamily = () => {
    if (!assistToken) return;
    verifyFamilyMutation.mutate({ token: assistToken, answer: familyAnswer }, { onSuccess: () => { toast.success("Assisted verification complete in this synthetic demo."); familyQuery.refetch(); }, onError: error => toast.error(error.message) });
  };

  const confirmationSummary = () => {
    if (!profile || !state?.confirmationRef) return;
    return `Sahara Pramaan — synthetic prototype\n\n${profile.name}\nPrototype reference: ${state.confirmationRef}\nStatus: Submitted in this demo\nNext check due: ${profile.dueDate}\n\nSYNTHETIC PROTOTYPE — NOT A GOVERNMENT CERTIFICATE\nNo government, bank, biometric, or messaging system is connected.`;
  };

  const downloadConfirmation = () => {
    if (!profile || !state?.confirmationRef) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1600;
    canvas.height = 1000;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#fbf6ee";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#145755";
    context.fillRect(0, 0, canvas.width, 310);
    context.fillStyle = "#f3b64c";
    context.beginPath();
    context.arc(1420, 105, 170, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffffff";
    context.font = "700 32px DM Sans, sans-serif";
    context.fillText("SAHARA PRAMAAN", 100, 105);
    context.font = "600 28px DM Sans, sans-serif";
    context.fillText("SYNTHETIC PROTOTYPE • NOT AN OFFICIAL CERTIFICATE", 100, 160);
    context.font = "600 72px Georgia, serif";
    context.fillText("Your demo status", 100, 255);
    context.fillStyle = "#0d3434";
    context.font = "600 68px Georgia, serif";
    context.fillText("is complete.", 100, 420);
    context.font = "600 36px DM Sans, sans-serif";
    context.fillText(profile.name, 100, 530);
    context.font = "400 29px DM Sans, sans-serif";
    context.fillStyle = "#4b5f5b";
    context.fillText(`Prototype reference: ${state.confirmationRef}`, 100, 585);
    context.fillText(`Next synthetic check: ${profile.dueDate}`, 100, 640);
    context.fillStyle = "#dceee6";
    context.fillRect(100, 730, 1400, 130);
    context.fillStyle = "#145755";
    context.font = "600 27px DM Sans, sans-serif";
    context.fillText("This image contains synthetic prototype information only.", 140, 790);
    context.font = "400 25px DM Sans, sans-serif";
    context.fillText("No government, bank, biometric, pension, or messaging record has been created.", 140, 835);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `sahara-pramaan-synthetic-${state.confirmationRef}.png`;
    link.click();
  };

  const shareConfirmation = async () => {
    const summary = confirmationSummary();
    if (!summary) return;
    try {
      if (navigator.share) await navigator.share({ title: "Sahara Pramaan prototype status", text: summary });
      else { await navigator.clipboard.writeText(summary); toast.success("Prototype status copied for sharing."); }
    } catch { /* Share cancellation is expected and does not need a notification. */ }
  };

  const activeScreen = useMemo(() => {
    if (isAssist) return "family";
    return screen;
  }, [isAssist, screen]);

  const familyScreen = <section className="mx-auto flex w-full max-w-5xl flex-1 items-center py-4 sm:py-8">
    <div className="grid w-full overflow-hidden rounded-[34px] border border-sahara-ink/10 bg-white shadow-lift lg:grid-cols-[.9fr_1.1fr]">
      <aside className="relative overflow-hidden bg-sahara-ink p-7 text-white sm:p-10">
        <div className="absolute inset-0 opacity-25 paper-noise"/><div className="absolute -right-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border-[38px] border-sahara-sun/80"/>
        <div className="relative"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><ShieldCheck className="h-3.5 w-3.5 text-sahara-sun"/>ASSISTED PROTOTYPE</span>
          <h1 className="font-display mt-8 max-w-md text-4xl leading-[1.04] tracking-[-.04em] sm:text-5xl">A small moment of help can make a big difference.</h1>
          <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/70">You are assisting a family member. This prototype is not a secure identity-verification method and must never be used to impersonate anyone.</p>
          <div className="mt-10 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sahara-sun font-bold text-sahara-ink">{familyData?.profile.avatar || "SP"}</span><span><span className="block font-bold">{familyData?.profile.name || "Loading…"}</span><span className="text-sm text-white/60">Yearly certificate support</span></span></div>
        </div>
      </aside>
      <div className="p-7 sm:p-10">
        {familyQuery.isLoading ? <div className="grid min-h-72 place-items-center"><RefreshCw className="h-7 w-7 animate-spin text-sahara-forest" /></div> : familyQuery.error ? <div><h2 className="font-display text-3xl">This link is unavailable.</h2><p className="mt-3 text-slate-600">{familyQuery.error.message}</p><Button className="mt-7" onClick={() => { setAssistToken(null); setScreen("landing"); }}>Return to home</Button></div> : familyData?.state.status === "submitted" ? <div className="page-enter"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Check className="h-7 w-7"/></span><h2 className="font-display mt-6 text-4xl tracking-[-.04em]">Support completed.</h2><p className="mt-3 max-w-lg text-lg leading-7 text-slate-600">Kamala ji’s prototype status has updated. The pensioner window will reflect this automatically within a few seconds.</p><div className="mt-7 rounded-2xl bg-sahara-mint p-4 text-sm text-sahara-forest"><b>Prototype notice:</b> This result is synthetic. No real certificate, account, or notification has been created.</div></div> : <div className="page-enter"><span className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-800"><HeartHandshake className="h-3.5 w-3.5"/>ASSISTING, NOT IMPERSONATING</span><h2 className="font-display mt-5 text-4xl tracking-[-.04em]">A quick shared-memory check.</h2><p className="mt-3 max-w-lg text-[17px] leading-7 text-slate-600">{familyData?.profile.family.question}</p><input value={familyAnswer} onChange={e => setFamilyAnswer(e.target.value)} placeholder="Enter the synthetic demo answer" className="mt-7 min-h-14 w-full rounded-2xl border border-sahara-ink/15 bg-sahara-cream px-4 text-sahara-ink outline-none transition focus:border-sahara-forest"/><p className="mt-3 text-sm text-slate-500">Demo answer: <b>{familyData?.profile.family.answer}</b>. Shown only because this is a recording-ready synthetic prototype.</p><Button className="mt-7 w-full" onClick={completeFamily} disabled={verifyFamilyMutation.isPending} icon={UserRoundCheck}>{verifyFamilyMutation.isPending ? "Completing…" : "Complete assisted verification"}</Button><p className="mt-4 text-center text-xs leading-5 text-slate-500">By continuing, you acknowledge this is a prototype assistance flow—not secure identity verification.</p></div>}
      </div>
    </div>
  </section>;

  return <Shell screen={screen} setScreen={setScreen} lang={lang} setLang={setLang} large={large} setLarge={setLarge} contrast={contrast} setContrast={setContrast} onReset={resetDemo}>
    {screen === "home" && !profile && !isAssist && <section className="mx-auto flex w-full max-w-6xl flex-1 items-center py-5 sm:py-10"><div className="grid w-full gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="min-h-[360px] rounded-[32px] bg-sahara-ink p-7 shadow-lift sm:p-9"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white"><RefreshCw className="h-3.5 w-3.5 animate-spin text-sahara-sun"/>OPENING YOUR SYNTHETIC STATUS</span><div className="mt-16 max-w-xl animate-pulse"><div className="h-4 w-36 rounded-full bg-white/15"/><div className="mt-5 h-12 w-full max-w-md rounded-2xl bg-white/10"/><div className="mt-3 h-12 w-4/5 rounded-2xl bg-white/10"/><div className="mt-9 h-12 w-44 rounded-2xl bg-sahara-sun/40"/></div></div><div className="min-h-[220px] rounded-[30px] bg-white p-6 shadow-sm"><div className="h-10 w-10 animate-pulse rounded-2xl bg-sahara-mist"/><div className="mt-6 h-5 w-40 animate-pulse rounded-full bg-sahara-mist"/><div className="mt-3 h-16 w-full animate-pulse rounded-2xl bg-sahara-mist"/></div></div></section>}
    {activeScreen === "family" ? familyScreen : <>
      {screen === "landing" && <section className="relative flex flex-1 items-center py-6 sm:py-10"><div className="grid w-full items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16"><div className="page-enter max-w-2xl"><div className="inline-flex items-center gap-2 rounded-full border border-sahara-forest/15 bg-white/70 px-3 py-2 text-[11px] font-bold uppercase tracking-[.11em] text-sahara-forest"><span className="h-2 w-2 rounded-full bg-sahara-sun pulse-soft"/>{copy.prototype}</div><h1 className="font-display mt-7 text-5xl leading-[.96] tracking-[-.065em] text-sahara-ink sm:text-6xl lg:text-7xl">A more <em className="font-display text-sahara-forest">human</em> way to stay on track.</h1><p className="mt-7 max-w-xl text-[18px] leading-8 text-slate-600 sm:text-xl">{copy.welcome} Built with large, calm steps for pensioners—and a simple family-assist route when an extra hand is needed.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button variant="sun" onClick={() => setScreen("login")} icon={ArrowRight}>{copy.begin}</Button><Button variant="light" onClick={() => toast.message("Use DEMO-FAIL / 123456 to show the fallback journey, or DEMO-PASS / 123456 to show fingerprint success.")}>{copy.demo}</Button></div><div className="mt-9 grid max-w-xl grid-cols-3 gap-3"><div className="rounded-2xl bg-white/70 p-3 inset-glow"><Fingerprint className="h-5 w-5 text-sahara-coral"/><p className="mt-3 text-sm font-bold">Alternative paths</p></div><div className="rounded-2xl bg-white/70 p-3 inset-glow"><UsersRound className="h-5 w-5 text-sahara-forest"/><p className="mt-3 text-sm font-bold">Family assistance</p></div><div className="rounded-2xl bg-white/70 p-3 inset-glow"><Accessibility className="h-5 w-5 text-sahara-coral"/><p className="mt-3 text-sm font-bold">Comfort controls</p></div></div></div><div className="relative mx-auto w-full max-w-lg float-gentle"><div className="absolute -left-5 top-14 hidden rounded-2xl bg-white p-3 shadow-lift sm:block"><span className="flex items-center gap-2 text-xs font-bold text-sahara-forest"><Check className="h-4 w-4 rounded-full bg-emerald-100 p-0.5"/>Plain-language status</span></div><div className="relative overflow-hidden rounded-[34px] bg-sahara-ink p-4 shadow-2xl shadow-sahara-ink/25"><div className="rounded-[25px] bg-sahara-cream p-5 sm:p-7"><div className="flex items-center justify-between"><AppMark className="h-10 w-10"/><span className="rounded-full bg-sahara-sun/20 px-3 py-1.5 text-[10px] font-bold tracking-[.09em] text-sahara-ink">DUE THIS MONTH</span></div><p className="mt-8 text-sm font-bold text-slate-500">GOOD MORNING, KAMALA JI</p><h2 className="font-display mt-2 text-4xl leading-tight tracking-[-.045em]">Your yearly step is ready when you are.</h2><div className="mt-8 rounded-[22px] bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sahara-mint text-sahara-forest"><ClipboardCheck className="h-5 w-5"/></span><span><span className="block text-xs font-bold text-slate-500">NEXT STEP</span><span className="block font-bold">Verify your life certificate</span></span></div><div className="mt-4 h-2 rounded-full bg-sahara-mist"><div className="h-2 w-1/3 rounded-full bg-sahara-forest"/></div></div><Button variant="primary" className="mt-5 w-full">Continue gently <ArrowRight className="h-[18px] w-[18px]"/></Button></div></div><div className="absolute -bottom-5 -right-4 rounded-2xl bg-sahara-sun p-4 text-sahara-ink shadow-lift"><span className="block text-[10px] font-bold uppercase tracking-[.12em]">Built for</span><span className="font-display block text-xl font-semibold">everyday ease</span></div></div></div></section>}
      {screen === "login" && <section className="mx-auto flex w-full max-w-6xl flex-1 items-center py-5 sm:py-10"><div className="grid w-full overflow-hidden rounded-[34px] border border-sahara-ink/10 bg-white shadow-lift lg:grid-cols-[.8fr_1.2fr]"><aside className="relative overflow-hidden bg-sahara-forest p-7 text-white sm:p-10"><div className="absolute inset-0 opacity-20 paper-noise"/><div className="relative"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sahara-sun text-sahara-ink"><ShieldCheck className="h-6 w-6"/></span><h1 className="font-display mt-8 text-4xl leading-[1.02] tracking-[-.045em]">A simple start, with no real data.</h1><p className="mt-5 max-w-sm leading-7 text-white/75">This is a synthetic login for a public prototype. It does not connect to any real pension, bank, identity, or messaging system.</p><div className="mt-10 space-y-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold tracking-[.1em] text-white/60">FALLBACK DEMO</p><p className="mt-1 font-bold">DEMO-FAIL · OTP 123456</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold tracking-[.1em] text-white/60">FINGERPRINT-PASS DEMO</p><p className="mt-1 font-bold">DEMO-PASS · OTP 123456</p></div></div></div></aside><div className="p-7 sm:p-10"><button onClick={() => setScreen("landing")} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>Back</button><h2 className="font-display mt-7 text-4xl tracking-[-.045em]">{copy.login}</h2><p className="mt-3 max-w-lg leading-7 text-slate-600">Enter a synthetic ID and mock OTP. For the best recording flow, keep the pre-filled forced-failure account.</p><label className="mt-8 block text-sm font-bold text-sahara-ink">{copy.identifier}<input value={identifier} onChange={e => setIdentifier(e.target.value)} className="mt-2 min-h-14 w-full rounded-2xl border border-sahara-ink/15 bg-sahara-cream px-4 outline-none transition focus:border-sahara-forest" /></label><label className="mt-5 block text-sm font-bold text-sahara-ink">{copy.otp}<input inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="mt-2 min-h-14 w-full rounded-2xl border border-sahara-ink/15 bg-sahara-cream px-4 tracking-[.25em] outline-none transition focus:border-sahara-forest" /></label><Button className="mt-8 w-full" icon={ArrowRight} onClick={handleLogin} disabled={loginMutation.isPending}>{loginMutation.isPending ? "Opening your demo…" : copy.continue}</Button><p className="mt-5 text-center text-xs leading-5 text-slate-500">{copy.noMessages} By continuing, you acknowledge the independent-prototype disclosure.</p></div></div></section>}
      {screen === "home" && profile && state && <section className="mx-auto w-full max-w-6xl flex-1 py-2 sm:py-5 page-enter"><div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="overflow-hidden rounded-[32px] bg-sahara-ink p-6 text-white shadow-lift sm:p-9"><div className="flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><span className="h-2 w-2 rounded-full bg-sahara-sun"/>YOUR PROTOTYPE STATUS</span><StatusPill status={state.status}/></div><div className="mt-12 sm:mt-16"><p className="text-sm font-bold tracking-[.12em] text-white/55">{copy.welcomeBack.toUpperCase()}, {profile.name.toUpperCase()}</p><h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.05] tracking-[-.05em] sm:text-5xl">{state.status === "submitted" ? "Your yearly step is complete in this demo." : `${copy.due} ${profile.dueDate}.`}</h1><p className="mt-5 max-w-xl text-[17px] leading-7 text-white/70">{state.status === "submitted" ? "Your synthetic record is marked complete. Keep this screen open while demonstrating the family-assist update." : copy.protect}</p></div><div className="mt-8 flex flex-col gap-3 sm:flex-row">{state.status === "submitted" ? <Button variant="sun" onClick={() => setScreen("confirmation")} icon={Check}>View prototype confirmation</Button> : <Button variant="sun" onClick={beginFingerprint} icon={Fingerprint}>Start verification</Button>}<Button variant="light" onClick={() => setScreen("camps")} icon={MapPin}>Find a mock camp</Button></div><div className="mt-9 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 text-sm sm:grid-cols-3"><div><span className="block text-white/50">Last submission</span><span className="mt-1 block font-bold">{profile.lastSubmitted}</span></div><div><span className="block text-white/50">Preferred language</span><span className="mt-1 block font-bold">{profile.preferredLanguage === "hi" ? "हिन्दी" : "English"}</span></div><div className="col-span-2 sm:col-span-1"><span className="block text-white/50">Reference</span><span className="mt-1 block font-bold">Synthetic only</span></div></div></div><div className="flex flex-col gap-5"><div className="rounded-[30px] border border-sahara-ink/10 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sahara-mint text-sahara-forest"><Accessibility className="h-6 w-6"/></span><span><h2 className="font-display text-2xl tracking-[-.035em]">Choose what feels comfortable.</h2><p className="mt-2 text-sm leading-6 text-slate-600">Switch language, text size, contrast, or read the screen aloud at any time.</p></span></div><button onClick={() => toast.message("Open the menu in the top-right corner to use comfort controls.")} className="mt-5 flex min-h-12 w-full items-center justify-between rounded-2xl bg-sahara-mist px-4 text-left text-sm font-bold"><span className="flex items-center gap-2"><Contrast className="h-4 w-4 text-sahara-forest"/>Comfort controls</span><ChevronRight className="h-4 w-4"/></button></div><div className="rounded-[30px] border border-sahara-ink/10 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-100 text-sahara-coral"><Bell className="h-5 w-5"/></span><span><h3 className="font-bold">Gentle reminders</h3><p className="text-sm text-slate-500">{copy.noMessages}</p></span></div><Button className="mt-5 w-full" variant="light" onClick={() => setScreen("reminders")}>Review preferences</Button></div></div></div></section>}
      {screen === "fingerprint" && <section className="mx-auto flex w-full max-w-xl flex-1 items-center py-8"><div className="w-full rounded-[34px] border border-sahara-ink/10 bg-white p-7 text-center shadow-lift sm:p-10 page-enter"><span className="grid h-16 w-16 place-items-center rounded-[22px] bg-sahara-mint text-sahara-forest mx-auto"><Fingerprint className="h-8 w-8"/></span><span className="mt-7 inline-flex rounded-full bg-sahara-sun/20 px-3 py-1.5 text-xs font-bold text-sahara-ink">SIMULATED FINGERPRINT CHECK</span><h1 className="font-display mt-5 text-4xl tracking-[-.045em]">Place your finger gently.</h1><p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">This prototype is checking a synthetic fingerprint. No biometric image is captured, stored, or matched.</p><div className="relative mx-auto mt-9 grid h-48 w-48 place-items-center rounded-full border border-sahara-forest/15 bg-sahara-cream"><div className="absolute inset-3 rounded-full border-2 border-dashed border-sahara-forest/35 animate-[spin_7s_linear_infinite]"/><div className="absolute inset-8 rounded-full border border-sahara-sun/50"/><Fingerprint className="h-16 w-16 text-sahara-forest pulse-soft"/></div><div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-sahara-forest"><RefreshCw className="h-4 w-4 animate-spin"/>Checking your demo account…</div></div></section>}
      {screen === "fallback" && <section className="mx-auto flex w-full max-w-5xl flex-1 items-center py-5 sm:py-10"><div className="w-full"><div className="mx-auto max-w-2xl text-center page-enter"><span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-sahara-coral"><Fingerprint className="h-3.5 w-3.5"/>SIMULATED FINGERPRINT DID NOT MATCH</span><h1 className="font-display mt-5 text-4xl tracking-[-.05em] sm:text-5xl">That is okay. You have options.</h1><p className="mx-auto mt-4 max-w-xl text-[17px] leading-7 text-slate-600">This prototype intentionally forces a fingerprint failure for this demo account, so you can see the available alternatives.</p></div><div className="mt-9 grid gap-4 md:grid-cols-3"><button onClick={() => { setCameraAllowed(null); setScreen("liveness"); }} className="group rounded-[28px] border border-sahara-ink/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lift"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sahara-mint text-sahara-forest"><Camera className="h-6 w-6"/></span><h2 className="font-display mt-6 text-2xl tracking-[-.035em]">Try face & liveness</h2><p className="mt-2 text-sm leading-6 text-slate-600">A short simulated camera step. No face matching happens.</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-sahara-forest">Try this <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></button><button onClick={createFamilyLink} className="group rounded-[28px] border border-sahara-ink/10 bg-sahara-ink p-6 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sahara-sun text-sahara-ink"><HeartHandshake className="h-6 w-6"/></span><h2 className="font-display mt-6 text-2xl tracking-[-.035em]">Ask family to help</h2><p className="mt-2 text-sm leading-6 text-white/65">Share a low-friction link for assisted completion—not impersonation.</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-sahara-sun">Create link <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></button><button onClick={() => setScreen("camps")} className="group rounded-[28px] border border-sahara-ink/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lift"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-sahara-coral"><MapPin className="h-6 w-6"/></span><h2 className="font-display mt-6 text-2xl tracking-[-.035em]">Find a mock camp</h2><p className="mt-2 text-sm leading-6 text-slate-600">See illustrative support locations sorted by a mock pincode.</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-sahara-forest">Browse locations <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></button></div><p className="mx-auto mt-6 max-w-3xl rounded-2xl bg-sahara-mist px-4 py-3 text-center text-xs leading-5 text-slate-600"><b>Prototype disclosure:</b> These are simulated options. No real biometrics, camp schedules, SMS, voice calls, banks, or government systems are connected.</p></div></section>}
      {screen === "liveness" && <section className="mx-auto flex w-full max-w-4xl flex-1 items-center py-5 sm:py-10"><div className="grid w-full overflow-hidden rounded-[34px] border border-sahara-ink/10 bg-white shadow-lift lg:grid-cols-[1fr_.9fr]"><div className="relative min-h-72 overflow-hidden bg-sahara-ink p-6 text-white sm:min-h-96 sm:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(220,238,230,.23),transparent_35%),linear-gradient(140deg,#0d3434,#145755)]"/><div className="relative grid h-full place-items-center"><div className="grid h-44 w-44 place-items-center rounded-full border border-white/35 bg-white/10 backdrop-blur"><div className="grid h-32 w-32 place-items-center rounded-full border-2 border-sahara-sun/70"><Camera className="h-12 w-12 text-sahara-sun"/></div></div>{cameraAllowed === true && <span className="absolute bottom-2 inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-bold text-emerald-100"><span className="h-2 w-2 rounded-full bg-emerald-300"/>Camera permission available</span>}</div></div><div className="p-7 sm:p-9 page-enter"><span className="inline-flex rounded-full bg-sahara-mint px-3 py-1.5 text-xs font-bold text-sahara-forest">SIMULATED FACE & LIVENESS</span><h1 className="font-display mt-5 text-4xl tracking-[-.045em]">A small live moment.</h1><p className="mt-3 leading-7 text-slate-600">We can show your camera preview, but no face image is recorded or matched. This is a timed visual simulation only.</p>{cameraAllowed === null && <div className="mt-7 space-y-3"><Button className="w-full" onClick={requestCamera} icon={Camera}>Allow camera preview</Button><Button className="w-full" variant="light" onClick={() => setCameraAllowed(false)}>Continue without a camera</Button></div>}{cameraAllowed !== null && <div className="mt-7 rounded-2xl bg-sahara-cream p-4"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-sahara-forest"><Check className="h-4 w-4"/></span><p className="text-sm leading-6 text-slate-600">{cameraAllowed ? "Permission is available. Follow the gentle prompt below." : "Camera access is unavailable or declined. You can still complete the clearly labeled simulated liveness path."}</p></div><div className="mt-4 flex items-center gap-3 text-sm font-bold text-sahara-ink"><span className="grid h-7 w-7 place-items-center rounded-full bg-sahara-sun">1</span>Look forward <span className="text-slate-300">→</span><span className="grid h-7 w-7 place-items-center rounded-full bg-sahara-sun">2</span>Blink <span className="text-slate-300">→</span><span className="grid h-7 w-7 place-items-center rounded-full bg-sahara-sun">3</span>Done</div></div>}<Button className="mt-7 w-full" disabled={cameraAllowed === null || livenessMutation.isPending} onClick={completeLiveness} icon={Check}>{livenessMutation.isPending ? "Completing…" : "Complete simulated liveness"}</Button></div></div></section>}
      {screen === "familyLink" && <section className="mx-auto flex w-full max-w-3xl flex-1 items-center py-6"><div className="w-full overflow-hidden rounded-[34px] border border-sahara-ink/10 bg-white shadow-lift page-enter"><div className="bg-sahara-ink p-7 text-white sm:p-9"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><HeartHandshake className="h-3.5 w-3.5 text-sahara-sun"/>FAMILY ASSIST</span><h1 className="font-display mt-5 text-4xl tracking-[-.045em]">Share support, not your identity.</h1><p className="mt-3 max-w-xl leading-7 text-white/70">This link lets a family member complete a synthetic assistance step. It is explicitly a prototype, not a secure or production-ready verification method.</p></div><div className="p-7 sm:p-9"><div className="grid gap-5 sm:grid-cols-[1fr_auto]"><div><label className="text-xs font-bold tracking-[.1em] text-slate-500">FAMILY-ASSIST LINK</label><div className="mt-2 flex min-h-14 items-center gap-2 rounded-2xl border border-sahara-ink/15 bg-sahara-cream px-4"><Route className="h-5 w-5 shrink-0 text-sahara-forest"/><input readOnly value={linkCreated ? `${window.location.origin}${window.location.pathname}?assist=${linkCreated.token}` : "Creating link…"} className="min-w-0 flex-1 bg-transparent text-sm outline-none"/></div></div><Button variant="sun" onClick={copyLink} icon={Copy}>Copy link</Button></div><div className="mt-5 grid gap-4 rounded-2xl bg-sahara-mint p-5 sm:grid-cols-[auto_1fr]"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sahara-forest"><UsersRound className="h-6 w-6"/></span><div><p className="font-bold text-sahara-ink">Recording-ready code: <span className="font-mono">{linkCreated?.code || "…"}</span></p><p className="mt-1 text-sm leading-6 text-sahara-forest">Open the copied link in a second window in the same browser profile. Keep this pensioner window open; it checks for the family update every two seconds.</p></div></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button onClick={() => setScreen("home")} icon={ArrowLeft}>Return to pensioner status</Button><Button variant="light" onClick={() => setScreen("camps")} icon={MapPin}>View mock camps</Button></div></div></div></section>}
      {screen === "confirmation" && profile && state && <section className="mx-auto flex w-full max-w-4xl flex-1 items-center py-5 sm:py-10"><div className="w-full overflow-hidden rounded-[36px] border border-sahara-ink/10 bg-white shadow-lift page-enter"><div className="relative overflow-hidden bg-sahara-forest px-7 py-8 text-white sm:px-10 sm:py-10"><div className="absolute right-8 top-0 h-48 w-48 rounded-full border-[35px] border-sahara-sun/40"/><div className="relative"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-sahara-sun text-sahara-ink"><Check className="h-7 w-7"/></span><h1 className="font-display mt-6 max-w-2xl text-4xl tracking-[-.05em] sm:text-5xl">Your prototype submission is complete.</h1><p className="mt-3 max-w-xl text-[17px] leading-7 text-white/75">Your pension status for this demo is marked active. The next synthetic check is due {profile.dueDate}.</p></div></div><div className="p-7 sm:p-10"><div className="grid gap-5 md:grid-cols-[1fr_auto]"><div className="rounded-[24px] border border-dashed border-sahara-ink/25 bg-sahara-cream p-5"><p className="text-[10px] font-bold tracking-[.16em] text-sahara-coral">SYNTHETIC PROTOTYPE — NOT A GOVERNMENT CERTIFICATE</p><div className="mt-6 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sahara-mint font-bold text-sahara-forest">{profile.avatar}</span><span><span className="block font-bold">{profile.name}</span><span className="text-sm text-slate-500">Prototype reference {state.confirmationRef || "SP-2026-DEMO"}</span></span></div><div className="mt-6 grid grid-cols-2 gap-4 border-t border-sahara-ink/10 pt-5 text-sm"><div><span className="block text-slate-500">Verification path</span><span className="mt-1 block font-bold capitalize">{verificationMethod || state.method || "Prototype"}</span></div><div><span className="block text-slate-500">Status</span><span className="mt-1 block font-bold text-emerald-700">Marked complete in demo</span></div></div></div><div className="flex flex-col gap-3"><Button variant="sun" onClick={downloadConfirmation} icon={Send}>Save image</Button><Button variant="light" onClick={() => setScreen("reminders")} icon={Bell}>Set mock reminders</Button></div></div><div className="mt-6 flex flex-col gap-3 rounded-2xl bg-sahara-mist p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-600"><b className="text-sahara-ink">What this means:</b> This screen and image are synthetic proof-of-concept artifacts only. No official life certificate, payment status, SMS, bank record, or government update has been created.</p><Button variant="ghost" className="shrink-0" onClick={shareConfirmation} icon={Send}>Share status</Button></div></div></div></section>}
      {screen === "camps" && <section className="mx-auto w-full max-w-6xl flex-1 py-3 sm:py-7 page-enter"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><button onClick={() => setScreen(pensionerId ? "home" : "landing")} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>Back</button><h1 className="font-display mt-3 text-4xl tracking-[-.05em] sm:text-5xl">Illustrative help near you.</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">A family member, volunteer, or assisted device can use this mock locator. Locations and distances are synthetic and not live service information.</p></div><div className="w-full sm:w-52"><label className="text-xs font-bold tracking-[.12em] text-slate-500">MOCK PINCODE</label><input value={pincode} onChange={e => setPincode(e.target.value)} maxLength={6} inputMode="numeric" className="mt-2 min-h-12 w-full rounded-2xl border border-sahara-ink/15 bg-white px-4 font-bold outline-none focus:border-sahara-forest"/></div></div><div className="mt-7 grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="relative min-h-80 overflow-hidden rounded-[30px] bg-sahara-ink p-6 text-white"><div className="absolute inset-0 opacity-15 paper-noise"/><div className="relative"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><MapPin className="h-3.5 w-3.5 text-sahara-sun"/>MOCK DISTANCE VIEW</span><div className="relative mt-12 h-48"><span className="absolute left-[13%] top-[23%] grid h-12 w-12 place-items-center rounded-full border-4 border-sahara-sun bg-sahara-ink text-xs font-bold">YOU</span>{["left-[55%] top-[9%]", "left-[65%] top-[55%]", "left-[28%] top-[67%]", "left-[78%] top-[25%]"].map((position, index) => <span key={position} className={`absolute ${position} grid h-9 w-9 place-items-center rounded-full bg-sahara-mint text-sahara-forest shadow-lg`}><MapPin className="h-4 w-4"/></span>)}<svg className="absolute inset-0 h-full w-full opacity-30"><path d="M60 68 C160 20, 190 124, 300 45 S390 145, 440 85" stroke="white" strokeWidth="2" strokeDasharray="7 8" fill="none"/></svg></div><p className="mt-5 text-sm leading-6 text-white/60">This decorative map is illustrative only. It does not use live geolocation or official venue records.</p></div></div><div className="space-y-3">{campsQuery.data?.slice(0, 5).map((camp, index) => <div key={camp.id} className="flex items-center gap-4 rounded-2xl border border-sahara-ink/10 bg-white p-4 transition hover:border-sahara-forest/25 hover:shadow-sm"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sahara-mist font-display text-lg font-semibold text-sahara-forest">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{camp.name}</h2><span className="rounded-full bg-sahara-mint px-2 py-0.5 text-[10px] font-bold text-sahara-forest">{camp.kind}</span></div><p className="mt-1 truncate text-sm text-slate-500">{camp.address} · {camp.date}</p></div><div className="text-right"><p className="font-display text-xl font-semibold text-sahara-ink">{camp.distanceKm} km</p><p className="text-xs text-slate-500">{camp.time}</p></div></div>)}</div></div></section>}
      {screen === "reminders" && profile && state && <ReminderPanel profile={profile} reminder={state.reminder} onBack={() => setScreen("home")} onSave={(reminder) => reminderMutation.mutate({ pensionerId: profile.id, ...reminder }, { onSuccess: () => { profileQuery.refetch(); toast.success("Mock preferences saved. No message will be sent."); } })} saving={reminderMutation.isPending}/>} 
      {screen === "how" && <HowItWorks onBack={() => setScreen(pensionerId ? "home" : "landing")}/>}
    </>}
  </Shell>;
}

function ReminderPanel({ profile, reminder, onBack, onSave, saving }: { profile: { name: string }; reminder: { sms: boolean; voice: boolean; family: boolean }; onBack: () => void; onSave: (next: { sms: boolean; voice: boolean; family: boolean }) => void; saving: boolean }) {
  const [settings, setSettings] = useState(reminder);
  return <section className="mx-auto flex w-full max-w-3xl flex-1 items-center py-5"><div className="w-full rounded-[34px] border border-sahara-ink/10 bg-white p-7 shadow-lift sm:p-10 page-enter"><button onClick={onBack} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>Back to status</button><span className="mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-sahara-coral"><Bell className="h-7 w-7"/></span><h1 className="font-display mt-5 text-4xl tracking-[-.045em]">A gentle nudge, on your terms.</h1><p className="mt-3 max-w-xl leading-7 text-slate-600">Choose how this synthetic prototype would remind {profile.name}. These controls only save mock preferences—no SMS, phone call, or family alert will be sent.</p><div className="mt-8 space-y-3"><Toggle checked={settings.sms} onChange={sms => setSettings({ ...settings, sms })} label="Mock SMS reminder" description="A simulated text reminder preference"/><Toggle checked={settings.voice} onChange={voice => setSettings({ ...settings, voice })} label="Mock voice-call reminder" description="A simulated voice-call preference"/><Toggle checked={settings.family} onChange={family => setSettings({ ...settings, family })} label="Also remind a family member" description="A simulated family-support preference"/></div><Button className="mt-7 w-full" onClick={() => onSave(settings)} disabled={saving} icon={Check}>{saving ? "Saving mock preference…" : "Save mock preferences"}</Button></div></section>;
}

function HowItWorks({ onBack }: { onBack: () => void }) {
  const sections = [
    ["What you are seeing", "Sahara Pramaan is an independent hackathon prototype. It does not represent or connect to any government, UIDAI, bank, India Post, pension, or identity service."],
    ["What is simulated", "All names, identifiers, OTPs, fingerprints, face/liveness results, family answers, camp locations, distances, confirmation references, reminders, and status changes are synthetic."],
    ["Family assistance", "The family-assist step is a low-friction demo interaction—not a secure identity-assurance mechanism. It must not be used to impersonate anyone or verify a real person."],
    ["At scale, for real", "A real version would need audited identity assurance, meaningful consent, fraud controls, privacy and accessibility review, regulated operations, live partner agreements, and an offline voice or USSD alternative."],
  ];
  return <section className="mx-auto w-full max-w-5xl flex-1 py-5 sm:py-9 page-enter"><div className="rounded-[34px] bg-sahara-ink p-7 text-white shadow-lift sm:p-10"><button onClick={onBack} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-sun hover:underline"><ArrowLeft className="h-4 w-4"/>Back</button><div className="mt-9 max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><Info className="h-3.5 w-3.5 text-sahara-sun"/>HONESTY DISCLOSURE</span><h1 className="font-display mt-5 text-4xl tracking-[-.05em] sm:text-5xl">Designed to make the limits unmistakably clear.</h1><p className="mt-4 text-[17px] leading-7 text-white/70">Trust starts with explaining what a prototype can—and cannot—do.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2">{sections.map(([title, body], index) => <article key={title} className="rounded-[24px] bg-white/8 p-5 ring-1 ring-white/10"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sahara-sun text-sm font-bold text-sahara-ink">0{index + 1}</span><h2 className="font-display mt-5 text-2xl tracking-[-.03em]">{title}</h2><p className="mt-3 text-sm leading-6 text-white/70">{body}</p></article>)}</div></div></section>;
}
