import { useEffect, useMemo, useState } from "react";
import {
  Accessibility, ArrowLeft, ArrowRight, Bell, Camera, Check, ChevronRight, CircleHelp, CloudOff,
  ClipboardCheck, Contrast, Copy, Ear, Fingerprint, HeartHandshake, Info, Landmark,
  Languages, LocateFixed, MapPin, Menu, Mic, Phone, RefreshCw, Route, Send, ShieldCheck,
  Moon, Sparkles, Sun, TimerReset, UserRoundCheck, UsersRound, Volume2, VolumeX, X,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import { MapView } from "@/components/Map";
import { buildJpegPdf, formatConfirmationDate } from "@/lib/confirmationExport";
import { FAMILY_STATUS_POLL_MS } from "../../../shared/prototypeConfig";

type Screen = "landing" | "login" | "home" | "fingerprint" | "fallback" | "liveness" | "familyLink" | "confirmation" | "camps" | "reminders" | "how";
import { getSpeechLocale, isLang, languageLabels, localeStrings, translate, type Lang } from "@/i18n";
type GeoStatus = "idle" | "requesting" | "ready" | "unavailable";


const text = {
  en: {
    prototype: "INDEPENDENT SERVICE CONCEPT • SYNTHETIC DATA",
    welcome: "A calmer way to complete your yearly life-certificate step.",
    begin: "Begin securely",
    demo: "View demo accounts",
    login: "Sign in to your demo account",
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
    guided: "Guided steps",
    guidedDescription: "Show one clear instruction for the current step",
    repeatInstruction: "Repeat instruction",
    localMode: "Session-only demo mode",
    localModeDescription: "Remote persistence is unavailable; this session remains local",
    backOnline: "Remote persistence is available again",
    offline: "You are offline",
    stopRead: "Stop reading",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    languageNote: "Choose the language you prefer. Core guidance is available in Hindi and English; your choice is saved for this device.",
    location: "Location",
    useMyLocation: "Use my location",
    locationReady: "Location permission granted for this session",
    locationUnavailable: "Location is unavailable. You can still search by PIN code.",
    offlineDescription: "The service shell is available, but remote demo updates will wait until you reconnect.",
  },
  hi: {
    prototype: "स्वतंत्र सेवा अवधारणा • केवल कृत्रिम डेटा",
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
    guided: "निर्देशित चरण",
    guidedDescription: "वर्तमान चरण के लिए एक स्पष्ट निर्देश दिखाएँ",
    repeatInstruction: "निर्देश दोहराएँ",
    localMode: "केवल-सत्र डेमो मोड",
    localModeDescription: "रिमोट संग्रहण उपलब्ध नहीं है; यह सत्र स्थानीय रहेगा",
    backOnline: "रिमोट संग्रहण फिर उपलब्ध है",
    offline: "आप ऑफ़लाइन हैं",
    stopRead: "पढ़ना रोकें",
    theme: "थीम",
    light: "हल्का",
    dark: "गहरा",
    languageNote: "अपनी पसंदीदा भाषा चुनें। मुख्य निर्देश हिन्दी और अंग्रेज़ी में उपलब्ध हैं; आपकी पसंद इस उपकरण पर सहेजी जाएगी।",
    location: "स्थान",
    useMyLocation: "मेरा स्थान उपयोग करें",
    locationReady: "इस सत्र के लिए स्थान अनुमति मिली",
    locationUnavailable: "स्थान उपलब्ध नहीं है। आप फिर भी पिन कोड से खोज सकते हैं।",
    offlineDescription: "सेवा खोल उपलब्ध है, लेकिन रिमोट डेमो अपडेट दोबारा जुड़ने तक प्रतीक्षा करेंगे।",
  },
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

function Shell({ children, screen, setScreen, lang, setLang, large, setLarge, contrast, setContrast, onReset, guided, setGuided, guidedText, onRepeatGuidance, onStopSpeaking, localPersistence, online }: {
  children: React.ReactNode; screen: Screen; setScreen: (screen: Screen) => void; lang: Lang; setLang: (lang: Lang) => void; large: boolean; setLarge: (value: boolean) => void; contrast: boolean; setContrast: (value: boolean) => void; onReset: () => void; guided: boolean; setGuided: (value: boolean) => void; guidedText: string; onRepeatGuidance: () => void; onStopSpeaking: () => void; localPersistence: boolean; online: boolean;
}) {
  const copy: Record<string, string> = { ...text.en, ...(lang === "hi" ? text.hi : {}), ...localeStrings[lang] };
  const { theme, toggleTheme } = useTheme();
  const [menu, setMenu] = useState(false);
  const speak = () => {
    if (!("speechSynthesis" in window)) return toast.error("Read-aloud is not supported in this browser.");
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(document.querySelector("main")?.textContent?.slice(0, 1200) || "");
    utterance.lang = getSpeechLocale(lang);
    window.speechSynthesis.speak(utterance);
  };
  return <div className={`${large ? "large-type" : ""} ${contrast ? "high-contrast" : ""} min-h-screen overflow-x-hidden bg-sahara-cream paper-noise`}>
    <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 sm:px-7 lg:px-10">
      <header className="z-30 flex items-center justify-between py-5 sm:py-7">
        <button onClick={() => setScreen("landing")} className="group flex items-center gap-3 text-left" aria-label={translate(lang, "Return to Sahara Pramaan home")}>
          <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-sahara-ink text-white shadow-lg shadow-sahara-ink/20"><span className="absolute -bottom-3 -right-2 h-8 w-8 rounded-full border-[5px] border-sahara-sun"/><Landmark className="relative h-5 w-5" /></span>
          <span><span className="font-display block text-[21px] font-semibold leading-none tracking-[-.04em]">Sahara Pramaan</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-[.15em] text-sahara-forest">{translate(lang, "Assisted certificate service")}</span></span>
        </button>
        <div className="hidden items-center gap-2 md:flex">
          <button onClick={speak} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-sahara-ink hover:bg-white"><Volume2 className="h-4 w-4" />{copy.read}</button>
          <button onClick={onStopSpeaking} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-sahara-ink hover:bg-white"><VolumeX className="h-4 w-4" />{copy.stopRead}</button>
          <button onClick={() => setScreen("how")} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-sahara-ink hover:bg-white"><Info className="h-4 w-4" />{copy.how}</button>
          <button onClick={() => setMenu(!menu)} className="grid h-11 w-11 place-items-center rounded-xl bg-white text-sahara-ink shadow-sm ring-1 ring-sahara-ink/10"><Menu className="h-5 w-5" /></button>
        </div>
        <button onClick={() => setMenu(!menu)} className="grid h-11 w-11 place-items-center rounded-xl bg-white text-sahara-ink shadow-sm ring-1 ring-sahara-ink/10 md:hidden"><Menu className="h-5 w-5" /></button>
      </header>
      {menu && <div className="absolute right-4 top-20 z-50 w-[min(340px,calc(100%-2rem))] rounded-[26px] border border-sahara-ink/10 bg-white p-4 shadow-2xl shadow-sahara-ink/15 page-enter sm:right-7 lg:right-10">
        <div className="mb-3 flex items-center justify-between"><p className="text-sm font-bold text-sahara-ink">{translate(lang, "Comfort controls")}</p><button onClick={() => setMenu(false)} className="rounded-lg p-2 hover:bg-sahara-mist"><X className="h-4 w-4" /></button></div>
        <div className="space-y-2">
          <Toggle checked={large} onChange={setLarge} label={translate(lang, "Larger text")} description={translate(lang, "Increase type across the prototype")} />
          <Toggle checked={contrast} onChange={setContrast} label={translate(lang, "High contrast")} description={translate(lang, "Increase color contrast")} />
          <Toggle checked={guided} onChange={setGuided} label={copy.guided} description={copy.guidedDescription} />
          <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-sahara-ink/10 px-4"><Languages className="h-5 w-5 shrink-0 text-sahara-forest"/><span className="min-w-0 flex-1"><span className="block font-bold">{translate(lang, "Preferred language")}</span><span className="text-sm text-slate-500">{languageLabels[lang]}</span></span><select value={lang} onChange={event => setLang(event.target.value as Lang)} className="max-w-[130px] rounded-xl border border-sahara-ink/10 bg-sahara-cream px-2 py-2 text-sm font-bold text-sahara-ink outline-none focus:border-sahara-forest" aria-label={translate(lang, "Preferred language")}>{Object.entries(languageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <p className="px-1 text-xs leading-5 text-slate-500">{copy.languageNote}</p>
          <button onClick={() => toggleTheme?.()} className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-sahara-ink/10 px-4 text-left hover:border-sahara-ink/25"><span className="flex items-center gap-3">{theme === "dark" ? <Moon className="h-5 w-5 text-sahara-forest"/> : <Sun className="h-5 w-5 text-sahara-forest"/>}<span><span className="block font-bold">{copy.theme}</span><span className="text-sm text-slate-500">{theme === "dark" ? copy.dark : copy.light}</span></span></span><ChevronRight className="h-4 w-4" /></button>
          <button onClick={speak} className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-sahara-ink/10 px-4 text-left hover:border-sahara-ink/25"><Volume2 className="h-5 w-5 text-sahara-forest"/><span><span className="block font-bold">{copy.read}</span><span className="text-sm text-slate-500">{translate(lang, "Uses your device’s built-in voice")}</span></span></button>
          <button onClick={onStopSpeaking} className="flex min-h-14 w-full items-center gap-3 rounded-2xl border border-sahara-ink/10 px-4 text-left hover:border-sahara-ink/25"><VolumeX className="h-5 w-5 text-sahara-forest"/><span><span className="block font-bold">{copy.stopRead}</span><span className="text-sm text-slate-500">{translate(lang, "Stop reading immediately")}</span></span></button>
        </div>
        <div className="mt-4 border-t border-sahara-ink/10 pt-3"><button onClick={() => { onReset(); setMenu(false); }} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-sm font-bold text-sahara-coral hover:bg-orange-50"><TimerReset className="h-4 w-4" />{translate(lang, "Reset synthetic demo")}</button><button onClick={() => { setScreen("how"); setMenu(false); }} className="flex min-h-11 w-full items-center gap-2 rounded-xl px-2 text-sm font-bold text-sahara-ink hover:bg-sahara-mist"><CircleHelp className="h-4 w-4" />{copy.how}</button></div>
      </div>}
      {!online && <div role="status" className="mb-3 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-950"><CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-sahara-coral" /><span><b className="block">{copy.offline}</b><span>{copy.offlineDescription}</span></span></div>}
      {online && localPersistence && <div role="status" className="mb-3 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-950"><CloudOff className="mt-0.5 h-5 w-5 shrink-0 text-sahara-coral" /><span><b className="block">{copy.localMode}</b><span>{copy.localModeDescription}</span></span></div>}
      {guided && <div role="region" aria-label={copy.guided} className="mb-3 flex flex-col gap-3 rounded-2xl border border-sahara-forest/15 bg-sahara-mint px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-sahara-forest">{copy.guided}</p><p className="mt-1 font-bold text-sahara-ink">{guidedText}</p></div><button onClick={onRepeatGuidance} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-sahara-forest shadow-sm"><Volume2 className="h-4 w-4" />{copy.repeatInstruction}</button></div>}
      <main className="flex flex-1 flex-col pb-7">{children}</main>
      <footer className="flex flex-col gap-2 border-t border-sahara-ink/10 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>{translate(lang, "Independent service concept. No government, bank, biometric, or messaging system is connected.")}</span><button onClick={() => setScreen("how")} className="text-left font-bold text-sahara-forest underline decoration-sahara-forest/30 underline-offset-4">{translate(lang, "Read the full mock-data disclosure")}</button></footer>
    </div>
  </div>;
}

function AppMark({ className = "" }: { className?: string }) { return <span className={`grid place-items-center rounded-2xl bg-sahara-mint text-sahara-forest ${className}`}><Landmark className="h-5 w-5" /></span>; }

export default function Home() {
  const initialAssist = new URLSearchParams(window.location.search).get("assist");
  const [screen, setScreenState] = useState<Screen>(initialAssist ? "home" : "landing");
  const [lang, setLang] = useState<Lang>(() => {
    const stored = localStorage.getItem("sahara-pramaan-language");
    return isLang(stored) ? stored : "en";
  });
  const [large, setLarge] = useState(() => localStorage.getItem("sahara-pramaan-large-type") === "true");
  const [contrast, setContrast] = useState(() => localStorage.getItem("sahara-pramaan-high-contrast") === "true");
  const [guided, setGuided] = useState(() => localStorage.getItem("sahara-pramaan-guided") !== "false");
  const [online, setOnline] = useState(() => navigator.onLine);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
  const [geoAccuracy, setGeoAccuracy] = useState<number | null>(null);
  const [geoPosition, setGeoPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [pensionerId, setPensionerId] = useState<string | null>(null);
  const [assistToken, setAssistToken] = useState(initialAssist);
  const [verificationMethod, setVerificationMethod] = useState<"fingerprint" | "liveness" | "family" | undefined>();
  const [identifier, setIdentifier] = useState("DEMO-FAIL");
  const [otp, setOtp] = useState("123456");
  const [pincode, setPincode] = useState("110001");
  const [cameraAllowed, setCameraAllowed] = useState<boolean | null>(null);
  const [familyAnswer, setFamilyAnswer] = useState("");
  const [linkCreated, setLinkCreated] = useState<{ token: string; code: string } | null>(null);
  const [recordingModeOpen, setRecordingModeOpen] = useState(false);

  const copy: Record<string, string> = { ...text.en, ...(lang === "hi" ? text.hi : {}), ...localeStrings[lang] };
  const { theme, toggleTheme } = useTheme();
  const profileQuery = trpc.prototype.pensioner.useQuery({ pensionerId: pensionerId || "pensioner-demo-fail" }, { enabled: Boolean(pensionerId), refetchInterval: screen === "home" && pensionerId ? FAMILY_STATUS_POLL_MS : false });
  const familyQuery = trpc.prototype.familyLink.useQuery({ token: assistToken || "inactive" }, { enabled: Boolean(assistToken), refetchInterval: query => query.state.data?.state.status === "submitted" ? false : assistToken ? FAMILY_STATUS_POLL_MS : false });
  const campsQuery = trpc.prototype.camps.useQuery({ pincode });
  const liveLocationsQuery = trpc.prototype.liveLocations.useQuery({ pincode, ...(geoPosition ? { lat: geoPosition.lat, lng: geoPosition.lng } : {}) }, { enabled: screen === "camps" });
  const liveLocations = liveLocationsQuery.data?.locations ?? campsQuery.data?.slice(0, 8).map(camp => ({ id: camp.id, name: camp.name, address: `${camp.address}, India`, kind: camp.kind, distanceKm: camp.distanceKm, location: undefined, mapsUrl: undefined })) ?? [];
  const liveLocationMessage = liveLocationsQuery.data?.message || "Showing illustrative support locations while live map data is unavailable.";
  const liveLocationMarkers = liveLocations.filter(location => Boolean(location.location)).map(location => ({ position: location.location as { lat: number; lng: number }, title: location.name }));
  const loginMutation = trpc.prototype.login.useMutation();
  const fingerprintMutation = trpc.prototype.fingerprint.useMutation();
  const livenessMutation = trpc.prototype.liveness.useMutation();
  const createLinkMutation = trpc.prototype.createFamilyLink.useMutation();
  const verifyFamilyMutation = trpc.prototype.verifyFamily.useMutation();
  const reminderMutation = trpc.prototype.reminder.useMutation();
  const resetMutation = trpc.prototype.reset.useMutation();
  const profile = profileQuery.data?.profile;
  const state = profileQuery.data?.state;
  const confirmationDueDate = profile ? formatConfirmationDate(profile.dueDate, lang === "hi" ? "hi" : "en") : "";
  const isAssist = Boolean(assistToken);
  const familyData = familyQuery.data;
  const guideText = useMemo(() => {
    const messages = lang === "hi" ? {
      landing: "शुरू करने के लिए सुरक्षित रूप से शुरू करें चुनें।",
      login: "अपनी कृत्रिम पेंशन आईडी और छह अंकों का मॉक OTP भरें, फिर आगे बढ़ें।",
      home: state?.status === "submitted" ? "आपका कृत्रिम चरण पूरा है। पुष्टि देखें या पसंद बदलें।" : "सत्यापन शुरू करें या कृत्रिम सहायता स्थान देखें।",
      fingerprint: "सिमुलेटेड जाँच पूरी होने तक अपनी उंगली हल्के से रखें।",
      fallback: "लाइवनेस, परिवार सहायता या मॉक सहायता स्थान चुनें।",
      liveness: "कैमरा पूर्वावलोकन की अनुमति दें या सिमुलेटेड लाइवनेस जारी रखें।",
      familyLink: "सहायता लिंक कॉपी करें और उसे दूसरी विंडो में खोलें।",
      confirmation: "आपकी कृत्रिम स्थिति पूरी है; इसे सहेज या साझा कर सकते हैं।",
      camps: "उदाहरणात्मक सहायता स्थानों को क्रमबद्ध करने के लिए मॉक पिनकोड भरें।",
      reminders: "मॉक अनुस्मारक चुनें और फिर उन्हें सहेजें।",
      how: "यह समझने के लिए पढ़ें कि यह सेवा अवधारणा क्या कर सकती है और क्या नहीं।",
    } : {
      landing: "Choose Begin securely to open your synthetic service account.",
      login: "Enter your synthetic Pension ID and six-digit mock OTP, then press Continue.",
      home: state?.status === "submitted" ? "Your synthetic step is complete. View confirmation or adjust preferences." : "Start verification or find an illustrative support location.",
      fingerprint: "Keep your finger gently placed while the simulated check completes.",
      fallback: "Choose liveness, family assistance, or a mock support location.",
      liveness: "Allow a camera preview or continue with the simulated liveness step.",
      familyLink: "Copy the assistance link and open it in a second window.",
      confirmation: "Your synthetic status is complete; you can save or share the demo result.",
      camps: "Enter a mock pincode to sort illustrative support locations.",
      reminders: "Choose your mock reminder preferences, then save them.",
      how: "Review what this service concept can and cannot do.",
    };
    const guidedScreen = assistToken || linkCreated ? "familyLink" : screen;
    return messages[guidedScreen] || messages.landing;
  }, [lang, screen, state?.status, assistToken, linkCreated]);

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  };

  useEffect(() => {
    stopSpeaking();
  }, [screen, lang]);

  useEffect(() => () => stopSpeaking(), []);

  const repeatGuidance = () => {
    if (!("speechSynthesis" in window)) return toast.error("Read-aloud is not supported in this browser.");
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(guideText);
    utterance.lang = getSpeechLocale(lang);
    window.speechSynthesis.speak(utterance);
  };

  const setScreen = (next: Screen) => {
    setScreenState(next);
    if (next !== "home" || !assistToken) window.history.replaceState({}, "", window.location.pathname);
  };

  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);
    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("sahara-pramaan-language", lang);
    localStorage.setItem("sahara-pramaan-large-type", String(large));
    localStorage.setItem("sahara-pramaan-high-contrast", String(contrast));
    localStorage.setItem("sahara-pramaan-guided", String(guided));
    document.documentElement.lang = getSpeechLocale(lang);
  }, [lang, large, contrast, guided]);


  const resetDemo = () => resetMutation.mutate(undefined, { onSuccess: () => { setPensionerId(null); setAssistToken(null); setLinkCreated(null); setVerificationMethod(undefined); setScreenState("landing"); window.history.replaceState({}, "", window.location.pathname); toast.success("Synthetic demo reset. You are ready for a fresh recording take."); } });

  const handleLogin = () => loginMutation.mutate({ identifier, otp }, { onSuccess: data => { setPensionerId(data.pensionerId); setScreen("home"); toast.success(`Welcome, ${data.displayName}.`); }, onError: error => toast.error(error.message) });

  const beginFingerprint = () => {
    if (!pensionerId) return;
    setScreen("fingerprint");
    window.setTimeout(() => fingerprintMutation.mutate({ pensionerId }, { onSuccess: result => { if (result.passed) { setVerificationMethod("fingerprint"); setScreen("confirmation"); } else setScreen("fallback"); }, onError: error => { toast.error(error.message); setScreen("home"); } }), 1600);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus("unavailable");
      return;
    }
    setGeoStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      position => { setGeoAccuracy(Math.round(position.coords.accuracy)); setGeoPosition({ lat: position.coords.latitude, lng: position.coords.longitude }); setGeoStatus("ready"); },
      () => { setGeoAccuracy(null); setGeoStatus("unavailable"); },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
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
    return `Sahara Pramaan — synthetic prototype\n\n${profile.name}\nPrototype reference: ${state.confirmationRef}\nStatus: Submitted in this demo\nNext check due: ${confirmationDueDate}\n\nSYNTHETIC PROTOTYPE — NOT A GOVERNMENT CERTIFICATE\nNo government, bank, biometric, or messaging system is connected.`;
  };

  const confirmationCanvas = () => {
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
    const isHindi = lang === "hi";
    const canvasCopy = isHindi ? {
      brand: "सहारा प्रमाण", warning: "कृत्रिम प्रोटोटाइप • आधिकारिक प्रमाणपत्र नहीं", headingOne: "आपकी डेमो स्थिति", headingTwo: "पूर्ण है।", reference: "प्रोटोटाइप संदर्भ", due: "अगली कृत्रिम जाँच", boundary: "इस छवि में केवल कृत्रिम प्रोटोटाइप जानकारी है।", noRecord: "कोई सरकारी, बैंक, बायोमेट्रिक, पेंशन या संदेश रिकॉर्ड नहीं बनाया गया है।",
    } : {
      brand: "SAHARA PRAMAAN", warning: "SYNTHETIC PROTOTYPE • NOT AN OFFICIAL CERTIFICATE", headingOne: "Your demo status", headingTwo: "is complete.", reference: "Prototype reference", due: "Next synthetic check", boundary: "This image contains synthetic prototype information only.", noRecord: "No government, bank, biometric, pension, or messaging record has been created.",
    };
    const canvasFont = isHindi ? "Noto Sans Devanagari, Arial, sans-serif" : "DM Sans, Arial, sans-serif";
    context.fillStyle = "#ffffff";
    context.font = `700 32px ${canvasFont}`;
    context.fillText(canvasCopy.brand, 100, 105);
    context.font = `600 26px ${canvasFont}`;
    context.fillText(canvasCopy.warning, 100, 160);
    context.font = "600 72px Georgia, serif";
    context.fillText(canvasCopy.headingOne, 100, 255);
    context.fillStyle = "#0d3434";
    context.font = "600 68px Georgia, serif";
    context.fillText(canvasCopy.headingTwo, 100, 420);
    context.font = `600 36px ${canvasFont}`;
    context.fillText(profile.name, 100, 530);
    context.font = `400 29px ${canvasFont}`;
    context.fillStyle = "#4b5f5b";
    context.fillText(`${canvasCopy.reference}: ${state.confirmationRef}`, 100, 585);
    context.fillText(`${canvasCopy.due}: ${confirmationDueDate}`, 100, 640);
    context.fillStyle = "#dceee6";
    context.fillRect(100, 730, 1400, 130);
    context.fillStyle = "#145755";
    context.font = `600 25px ${canvasFont}`;
    context.fillText(canvasCopy.boundary, 140, 790);
    context.font = `400 22px ${canvasFont}`;
    context.fillText(canvasCopy.noRecord, 140, 835);
    return canvas;
  };

  const downloadConfirmationPdf = () => {
    if (!profile || !state?.confirmationRef) return;
    const canvas = confirmationCanvas();
    if (!canvas) return;
    const encodedJpeg = canvas.toDataURL("image/jpeg", 0.94).split(",")[1];
    const decoded = window.atob(encodedJpeg);
    const jpeg = Uint8Array.from(decoded, character => character.charCodeAt(0));
    const pdf = new Blob([buildJpegPdf(jpeg, canvas.width, canvas.height)], { type: "application/pdf" });
    const href = URL.createObjectURL(pdf);
    const link = document.createElement("a");
    link.href = href;
    link.download = `sahara-pramaan-synthetic-${state.confirmationRef}.pdf`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    toast.success("Synthetic confirmation PDF download started.");
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

  return <Shell screen={screen} setScreen={setScreen} lang={lang} setLang={setLang} large={large} setLarge={setLarge} contrast={contrast} setContrast={setContrast} onReset={resetDemo} guided={guided} setGuided={setGuided} guidedText={guideText} onRepeatGuidance={repeatGuidance} onStopSpeaking={stopSpeaking} localPersistence={profileQuery.data?.state.persistence === "local"} online={online}>
    {screen === "home" && !profile && !isAssist && <section className="mx-auto flex w-full max-w-6xl flex-1 items-center py-5 sm:py-10"><div className="grid w-full gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="min-h-[360px] rounded-[32px] bg-sahara-ink p-7 shadow-lift sm:p-9"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white"><RefreshCw className="h-3.5 w-3.5 animate-spin text-sahara-sun"/>OPENING YOUR SYNTHETIC STATUS</span><div className="mt-16 max-w-xl animate-pulse"><div className="h-4 w-36 rounded-full bg-white/15"/><div className="mt-5 h-12 w-full max-w-md rounded-2xl bg-white/10"/><div className="mt-3 h-12 w-4/5 rounded-2xl bg-white/10"/><div className="mt-9 h-12 w-44 rounded-2xl bg-sahara-sun/40"/></div></div><div className="min-h-[220px] rounded-[30px] bg-white p-6 shadow-sm"><div className="h-10 w-10 animate-pulse rounded-2xl bg-sahara-mist"/><div className="mt-6 h-5 w-40 animate-pulse rounded-full bg-sahara-mist"/><div className="mt-3 h-16 w-full animate-pulse rounded-2xl bg-sahara-mist"/></div></div></section>}
    {activeScreen === "family" ? familyScreen : <>
      {screen === "landing" && <section className="relative flex flex-1 items-center py-6 sm:py-10"><div className="grid w-full items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16"><div className="page-enter max-w-2xl"><div className="inline-flex items-center gap-2 rounded-full border border-sahara-forest/15 bg-white/70 px-3 py-2 text-[11px] font-bold uppercase tracking-[.11em] text-sahara-forest"><span className="h-2 w-2 rounded-full bg-sahara-sun pulse-soft"/>{copy.prototype}</div><h1 className="font-display mt-7 text-5xl leading-[.96] tracking-[-.065em] text-sahara-ink sm:text-6xl lg:text-7xl">{copy.landingTitle}</h1><p className="mt-7 max-w-xl text-[18px] leading-8 text-slate-600 sm:text-xl">{copy.landingBody}</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button variant="sun" onClick={() => setScreen("login")} icon={ArrowRight}>{copy.begin}</Button><Button variant="light" onClick={() => setRecordingModeOpen(open => !open)}>{copy.demo}</Button></div>{recordingModeOpen && <div className="mt-5 max-w-xl rounded-[26px] border border-sahara-forest/15 bg-white p-4 shadow-lift page-enter" aria-label="Synthetic recording mode"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-sahara-forest">Recording mode · synthetic only</p><h2 className="font-display mt-1 text-2xl tracking-[-.035em]">Choose a recording-ready route.</h2></div><button onClick={() => setRecordingModeOpen(false)} className="rounded-xl p-2 text-slate-500 hover:bg-sahara-mist" aria-label="Close recording mode"><X className="h-4 w-4"/></button></div><div className="mt-4 grid gap-3 sm:grid-cols-3">{[{ id: "DEMO-FAIL", label: "Fallback", detail: "Fingerprint fails" }, { id: "DEMO-PASS", label: "Success", detail: "Fingerprint passes" }, { id: "DEMO-MIXED", label: "Mixed", detail: "Explore routes" }].map(account => <button key={account.id} onClick={() => { setIdentifier(account.id); setOtp("123456"); setRecordingModeOpen(false); setScreen("login"); }} className="rounded-2xl border border-sahara-ink/10 bg-sahara-cream p-3 text-left transition hover:border-sahara-forest hover:bg-sahara-mint"><span className="block text-[10px] font-bold tracking-[.12em] text-sahara-forest">{account.label}</span><span className="mt-1 block font-mono text-sm font-bold text-sahara-ink">{account.id}</span><span className="mt-1 block text-xs text-slate-500">OTP 123456 · {account.detail}</span></button>)}</div><div className="mt-4 flex flex-col gap-3 border-t border-sahara-ink/10 pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-slate-500">Reset clears only synthetic demo state and returns to this recording start.</p><Button variant="ghost" className="justify-start px-2 text-sahara-coral" onClick={() => { setRecordingModeOpen(false); resetDemo(); }} icon={TimerReset}>Reset synthetic demo</Button></div></div>}<div className="mt-9 grid max-w-xl grid-cols-3 gap-3"><div className="rounded-2xl bg-white/70 p-3 inset-glow"><Fingerprint className="h-5 w-5 text-sahara-coral"/><p className="mt-3 text-sm font-bold">Alternative paths</p></div><div className="rounded-2xl bg-white/70 p-3 inset-glow"><UsersRound className="h-5 w-5 text-sahara-forest"/><p className="mt-3 text-sm font-bold">Family assistance</p></div><div className="rounded-2xl bg-white/70 p-3 inset-glow"><Accessibility className="h-5 w-5 text-sahara-coral"/><p className="mt-3 text-sm font-bold">Comfort controls</p></div></div></div><div className="relative mx-auto w-full max-w-lg float-gentle"><div className="absolute -left-5 top-14 hidden rounded-2xl bg-white p-3 shadow-lift sm:block"><span className="flex items-center gap-2 text-xs font-bold text-sahara-forest"><Check className="h-4 w-4 rounded-full bg-emerald-100 p-0.5"/>Plain-language status</span></div><div className="relative overflow-hidden rounded-[34px] bg-sahara-ink p-4 shadow-2xl shadow-sahara-ink/25"><div className="rounded-[25px] bg-sahara-cream p-5 sm:p-7"><div className="flex items-center justify-between"><AppMark className="h-10 w-10"/><span className="rounded-full bg-sahara-sun/20 px-3 py-1.5 text-[10px] font-bold tracking-[.09em] text-sahara-ink">DUE THIS MONTH</span></div><p className="mt-8 text-sm font-bold text-slate-500">GOOD MORNING, KAMALA JI</p><h2 className="font-display mt-2 text-4xl leading-tight tracking-[-.045em]">Your yearly step is ready when you are.</h2><div className="mt-8 rounded-[22px] bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sahara-mint text-sahara-forest"><ClipboardCheck className="h-5 w-5"/></span><span><span className="block text-xs font-bold text-slate-500">NEXT STEP</span><span className="block font-bold">Verify your life certificate</span></span></div><div className="mt-4 h-2 rounded-full bg-sahara-mist"><div className="h-2 w-1/3 rounded-full bg-sahara-forest"/></div></div><Button variant="primary" className="mt-5 w-full">Continue gently <ArrowRight className="h-[18px] w-[18px]"/></Button></div></div><div className="absolute -bottom-5 -right-4 rounded-2xl bg-sahara-sun p-4 text-sahara-ink shadow-lift"><span className="block text-[10px] font-bold uppercase tracking-[.12em]">Built for</span><span className="font-display block text-xl font-semibold">everyday ease</span></div></div></div></section>}
      {screen === "login" && <section className="mx-auto flex w-full max-w-6xl flex-1 items-center py-5 sm:py-10"><div className="grid w-full overflow-hidden rounded-[34px] border border-sahara-ink/10 bg-white shadow-lift lg:grid-cols-[.8fr_1.2fr]"><aside className="relative overflow-hidden bg-sahara-forest p-7 text-white sm:p-10"><div className="absolute inset-0 opacity-20 paper-noise"/><div className="relative"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sahara-sun text-sahara-ink"><ShieldCheck className="h-6 w-6"/></span><h1 className="font-display mt-8 text-4xl leading-[1.02] tracking-[-.045em]">{copy.login}</h1><p className="mt-5 max-w-sm leading-7 text-white/75">This is a synthetic demo account for an independent service concept. It does not connect to any real pension, bank, identity, or messaging system.</p><div className="mt-10 space-y-3"><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold tracking-[.1em] text-white/60">FALLBACK DEMO</p><p className="mt-1 font-bold">DEMO-FAIL · OTP 123456</p></div><div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold tracking-[.1em] text-white/60">FINGERPRINT-PASS DEMO</p><p className="mt-1 font-bold">DEMO-PASS · OTP 123456</p></div></div></div></aside><div className="p-7 sm:p-10"><button onClick={() => setScreen("landing")} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>{translate(lang, "Back")}</button><h2 className="font-display mt-7 text-4xl tracking-[-.045em]">{copy.login}</h2><p className="mt-3 max-w-lg leading-7 text-slate-600">{copy.loginDescription}</p><label className="mt-8 block text-sm font-bold text-sahara-ink">{copy.identifier}<input value={identifier} onChange={e => setIdentifier(e.target.value)} className="mt-2 min-h-14 w-full rounded-2xl border border-sahara-ink/15 bg-sahara-cream px-4 outline-none transition focus:border-sahara-forest" /></label><label className="mt-5 block text-sm font-bold text-sahara-ink">{copy.otp}<input inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className="mt-2 min-h-14 w-full rounded-2xl border border-sahara-ink/15 bg-sahara-cream px-4 tracking-[.25em] outline-none transition focus:border-sahara-forest" /></label><Button className="mt-8 w-full" icon={ArrowRight} onClick={handleLogin} disabled={loginMutation.isPending}>{loginMutation.isPending ? "Opening your demo…" : copy.continue}</Button><p className="mt-5 text-center text-xs leading-5 text-slate-500">{copy.noMessages} By continuing, you acknowledge the independent-service disclosure.</p></div></div></section>}
      {screen === "home" && profile && state && <section className="mx-auto w-full max-w-6xl flex-1 py-2 sm:py-5 page-enter"><div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="overflow-hidden rounded-[32px] bg-sahara-ink p-6 text-white shadow-lift sm:p-9"><div className="flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><span className="h-2 w-2 rounded-full bg-sahara-sun"/>YOUR CERTIFICATE SUPPORT STATUS</span><StatusPill status={state.status}/></div><div className="mt-12 sm:mt-16"><p className="text-sm font-bold tracking-[.12em] text-white/55">{copy.welcomeBack.toUpperCase()}, {profile.name.toUpperCase()}</p><h1 className="font-display mt-3 max-w-2xl text-4xl leading-[1.05] tracking-[-.05em] sm:text-5xl">{state.status === "submitted" ? copy.homeComplete : `${copy.due} ${profile.dueDate}.`}</h1><p className="mt-5 max-w-xl text-[17px] leading-7 text-white/70">{state.status === "submitted" ? copy.homeCompleteBody : copy.protect}</p></div><div className="mt-8 flex flex-col gap-3 sm:flex-row">{state.status === "submitted" ? <Button variant="sun" onClick={() => setScreen("confirmation")} icon={Check}>{copy.viewConfirmation || translate(lang, "View certificate confirmation")}</Button> : <Button variant="sun" onClick={beginFingerprint} icon={Fingerprint}>{copy.verify}</Button>}<Button variant="light" onClick={() => setScreen("camps")} icon={MapPin}>{copy.findCamp || translate(lang, "Find a mock camp")}</Button></div><div className="mt-9 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 text-sm sm:grid-cols-3"><div><span className="block text-white/50">Last submission</span><span className="mt-1 block font-bold">{profile.lastSubmitted}</span></div><div><span className="block text-white/50">Preferred language</span><span className="mt-1 block font-bold">{profile.preferredLanguage === "hi" ? "हिन्दी" : "English"}</span></div><div className="col-span-2 sm:col-span-1"><span className="block text-white/50">Reference</span><span className="mt-1 block font-bold">Synthetic only</span></div></div></div><div className="flex flex-col gap-5"><div className="rounded-[30px] border border-sahara-ink/10 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-start gap-4"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sahara-mint text-sahara-forest"><Accessibility className="h-6 w-6"/></span><span><h2 className="font-display text-2xl tracking-[-.035em]">{translate(lang, "Choose what feels comfortable.")}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{translate(lang, "Switch language, text size, contrast, or read the screen aloud at any time.")}</p></span></div><div className="mt-5 grid grid-cols-3 gap-2"><button onClick={() => toggleTheme?.()} className="rounded-2xl bg-sahara-mist p-3 text-left text-xs font-bold text-sahara-ink transition hover:-translate-y-0.5"><span className="mb-2 grid h-8 w-8 place-items-center rounded-xl bg-white text-sahara-forest">{theme === "dark" ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}</span>{theme === "dark" ? copy.dark : copy.light}</button><button onClick={() => setLang(lang === "hi" ? "en" : "hi")} className="rounded-2xl bg-sahara-mist p-3 text-left text-xs font-bold text-sahara-ink transition hover:-translate-y-0.5"><span className="mb-2 grid h-8 w-8 place-items-center rounded-xl bg-white text-sahara-forest"><Languages className="h-4 w-4"/></span>{languageLabels[lang]}</button><button onClick={stopSpeaking} className="rounded-2xl bg-sahara-mist p-3 text-left text-xs font-bold text-sahara-ink transition hover:-translate-y-0.5"><span className="mb-2 grid h-8 w-8 place-items-center rounded-xl bg-white text-sahara-forest"><VolumeX className="h-4 w-4"/></span>{copy.stopRead}</button></div></div><div className="rounded-[30px] border border-sahara-ink/10 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-orange-100 text-sahara-coral"><Bell className="h-5 w-5"/></span><span><h3 className="font-bold">Gentle reminders</h3><p className="text-sm text-slate-500">{copy.noMessages}</p></span></div><Button className="mt-5 w-full" variant="light" onClick={() => setScreen("reminders")}>Review preferences</Button></div></div></div></section>}
      {screen === "fingerprint" && <section className="mx-auto flex w-full max-w-xl flex-1 items-center py-8"><div className="w-full rounded-[34px] border border-sahara-ink/10 bg-white p-7 text-center shadow-lift sm:p-10 page-enter"><button onClick={() => setScreen("home")} className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>Back to status</button><span className="grid h-16 w-16 place-items-center rounded-[22px] bg-sahara-mint text-sahara-forest mx-auto"><Fingerprint className="h-8 w-8"/></span><span className="mt-7 inline-flex rounded-full bg-sahara-sun/20 px-3 py-1.5 text-xs font-bold text-sahara-ink">SIMULATED FINGERPRINT CHECK</span><h1 className="font-display mt-5 text-4xl tracking-[-.045em]">{copy.fingerprintTitle}</h1><p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">This prototype is checking a synthetic fingerprint. No biometric image is captured, stored, or matched.</p><div className="relative mx-auto mt-9 grid h-48 w-48 place-items-center rounded-full border border-sahara-forest/15 bg-sahara-cream"><div className="absolute inset-3 rounded-full border-2 border-dashed border-sahara-forest/35 animate-[spin_7s_linear_infinite]"/><div className="absolute inset-8 rounded-full border border-sahara-sun/50"/><Fingerprint className="h-16 w-16 text-sahara-forest pulse-soft"/></div><div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-sahara-forest"><RefreshCw className="h-4 w-4 animate-spin"/>Checking your demo account…</div></div></section>}
      {screen === "fallback" && <section className="mx-auto flex w-full max-w-5xl flex-1 items-center py-5 sm:py-10"><div className="w-full"><button onClick={() => setScreen("home")} className="mb-6 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>Back to status</button><div className="mx-auto max-w-2xl text-center page-enter"><span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-sahara-coral"><Fingerprint className="h-3.5 w-3.5"/>SIMULATED FINGERPRINT DID NOT MATCH</span><h1 className="font-display mt-5 text-4xl tracking-[-.05em] sm:text-5xl">{copy.fallbackTitle}</h1><p className="mx-auto mt-4 max-w-xl text-[17px] leading-7 text-slate-600">This prototype intentionally forces a fingerprint failure for this demo account, so you can see the available alternatives.</p></div><div className="mt-9 grid gap-4 md:grid-cols-3"><button onClick={() => { setCameraAllowed(null); setScreen("liveness"); }} className="group rounded-[28px] border border-sahara-ink/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lift"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sahara-mint text-sahara-forest"><Camera className="h-6 w-6"/></span><h2 className="font-display mt-6 text-2xl tracking-[-.035em]">Try face & liveness</h2><p className="mt-2 text-sm leading-6 text-slate-600">A short simulated camera step. No face matching happens.</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-sahara-forest">Try this <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></button><button onClick={createFamilyLink} className="group rounded-[28px] border border-sahara-ink/10 bg-sahara-ink p-6 text-left text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sahara-sun text-sahara-ink"><HeartHandshake className="h-6 w-6"/></span><h2 className="font-display mt-6 text-2xl tracking-[-.035em]">Ask family to help</h2><p className="mt-2 text-sm leading-6 text-white/65">Share a low-friction link for assisted completion—not impersonation.</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-sahara-sun">Create link <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></button><button onClick={() => setScreen("camps")} className="group rounded-[28px] border border-sahara-ink/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lift"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-100 text-sahara-coral"><MapPin className="h-6 w-6"/></span><h2 className="font-display mt-6 text-2xl tracking-[-.035em]">Find a mock camp</h2><p className="mt-2 text-sm leading-6 text-slate-600">See illustrative support locations sorted by a mock pincode.</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-sahara-forest">Browse locations <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></button></div><p className="mx-auto mt-6 max-w-3xl rounded-2xl bg-sahara-mist px-4 py-3 text-center text-xs leading-5 text-slate-600"><b>Prototype disclosure:</b> These are simulated options. No real biometrics, camp schedules, SMS, voice calls, banks, or government systems are connected.</p></div></section>}
      {screen === "liveness" && <section className="mx-auto flex w-full max-w-4xl flex-1 items-center py-5 sm:py-10"><div className="w-full"><button onClick={() => setScreen("fallback")} className="mb-4 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>Back to alternatives</button><div className="grid w-full overflow-hidden rounded-[34px] border border-sahara-ink/10 bg-white shadow-lift lg:grid-cols-[1fr_.9fr]"><div className="relative min-h-72 overflow-hidden bg-sahara-ink p-6 text-white sm:min-h-96 sm:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(220,238,230,.23),transparent_35%),linear-gradient(140deg,#0d3434,#145755)]"/><div className="relative grid h-full place-items-center"><div className="grid h-44 w-44 place-items-center rounded-full border border-white/35 bg-white/10 backdrop-blur"><div className="grid h-32 w-32 place-items-center rounded-full border-2 border-sahara-sun/70"><Camera className="h-12 w-12 text-sahara-sun"/></div></div>{cameraAllowed === true && <span className="absolute bottom-2 inline-flex items-center gap-2 rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-bold text-emerald-100"><span className="h-2 w-2 rounded-full bg-emerald-300"/>Camera permission available</span>}</div></div><div className="p-7 sm:p-9 page-enter"><span className="inline-flex rounded-full bg-sahara-mint px-3 py-1.5 text-xs font-bold text-sahara-forest">SIMULATED FACE & LIVENESS</span><h1 className="font-display mt-5 text-4xl tracking-[-.045em]">{copy.livenessTitle}</h1><p className="mt-3 leading-7 text-slate-600">We can show your camera preview, but no face image is recorded or matched. This is a timed visual simulation only.</p>{cameraAllowed === null && <div className="mt-7 space-y-3"><Button className="w-full" onClick={requestCamera} icon={Camera}>Allow camera preview</Button><Button className="w-full" variant="light" onClick={() => setCameraAllowed(false)}>Continue without a camera</Button></div>}{cameraAllowed !== null && <div className="mt-7 rounded-2xl bg-sahara-cream p-4"><div className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-sahara-forest"><Check className="h-4 w-4"/></span><p className="text-sm leading-6 text-slate-600">{cameraAllowed ? "Permission is available. Follow the gentle prompt below." : "Camera access is unavailable or declined. You can still complete the clearly labeled simulated liveness path."}</p></div><div className="mt-4 flex items-center gap-3 text-sm font-bold text-sahara-ink"><span className="grid h-7 w-7 place-items-center rounded-full bg-sahara-sun">1</span>Look forward <span className="text-slate-300">→</span><span className="grid h-7 w-7 place-items-center rounded-full bg-sahara-sun">2</span>Blink <span className="text-slate-300">→</span><span className="grid h-7 w-7 place-items-center rounded-full bg-sahara-sun">3</span>Done</div></div>}<Button className="mt-7 w-full" disabled={cameraAllowed === null || livenessMutation.isPending} onClick={completeLiveness} icon={Check}>{livenessMutation.isPending ? "Completing…" : "Complete simulated liveness"}</Button></div></div></div></section>}
      {screen === "familyLink" && <section className="mx-auto flex w-full max-w-3xl flex-1 items-center py-6"><div className="w-full overflow-hidden rounded-[34px] border border-sahara-ink/10 bg-white shadow-lift page-enter"><div className="bg-sahara-ink p-7 text-white sm:p-9"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><HeartHandshake className="h-3.5 w-3.5 text-sahara-sun"/>FAMILY ASSIST</span><h1 className="font-display mt-5 text-4xl tracking-[-.045em]">Share support, not your identity.</h1><p className="mt-3 max-w-xl leading-7 text-white/70">This link lets a family member complete a synthetic assistance step. It is explicitly a prototype, not a secure or production-ready verification method.</p></div><div className="p-7 sm:p-9"><div className="grid gap-5 sm:grid-cols-[1fr_auto]"><div><label className="text-xs font-bold tracking-[.1em] text-slate-500">FAMILY-ASSIST LINK</label><div className="mt-2 flex min-h-14 items-center gap-2 rounded-2xl border border-sahara-ink/15 bg-sahara-cream px-4"><Route className="h-5 w-5 shrink-0 text-sahara-forest"/><input readOnly value={linkCreated ? `${window.location.origin}${window.location.pathname}?assist=${linkCreated.token}` : "Creating link…"} className="min-w-0 flex-1 bg-transparent text-sm outline-none"/></div></div><Button variant="sun" onClick={copyLink} icon={Copy}>Copy link</Button></div><div className="mt-5 grid gap-4 rounded-2xl bg-sahara-mint p-5 sm:grid-cols-[auto_1fr]"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-sahara-forest"><UsersRound className="h-6 w-6"/></span><div><p className="font-bold text-sahara-ink">Recording-ready code: <span className="font-mono">{linkCreated?.code || "…"}</span></p><p className="mt-1 text-sm leading-6 text-sahara-forest">Open the copied link in a second window in the same browser profile. Keep this pensioner window open; it checks for the family update every two seconds.</p></div></div><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button onClick={() => setScreen("home")} icon={ArrowLeft}>Return to pensioner status</Button><Button variant="light" onClick={() => setScreen("camps")} icon={MapPin}>View mock camps</Button></div></div></div></section>}
      {screen === "confirmation" && profile && state && <section className="mx-auto flex w-full max-w-4xl flex-1 items-center py-5 sm:py-10"><div className="w-full overflow-hidden rounded-[36px] border border-sahara-ink/10 bg-white shadow-lift page-enter"><button onClick={() => setScreen("home")} className="m-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>Back to status</button><div className="relative overflow-hidden bg-sahara-forest px-7 py-8 text-white sm:px-10 sm:py-10"><div className="absolute right-8 top-0 h-48 w-48 rounded-full border-[35px] border-sahara-sun/40"/><div className="relative"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-sahara-sun text-sahara-ink"><Check className="h-7 w-7"/></span><h1 className="font-display mt-6 max-w-2xl text-4xl tracking-[-.05em] sm:text-5xl">Your certificate support demo is complete.</h1><p className="mt-3 max-w-xl text-[17px] leading-7 text-white/75">Your pension status for this demo is marked active. The next synthetic check is due {confirmationDueDate}.</p></div></div><div className="p-7 sm:p-10"><div className="grid gap-5 md:grid-cols-[1fr_auto]"><div className="rounded-[24px] border border-dashed border-sahara-ink/25 bg-sahara-cream p-5"><p className="text-[10px] font-bold tracking-[.16em] text-sahara-coral">SYNTHETIC PROTOTYPE — NOT A GOVERNMENT CERTIFICATE</p><div className="mt-6 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-sahara-mint font-bold text-sahara-forest">{profile.avatar}</span><span><span className="block font-bold">{profile.name}</span><span className="text-sm text-slate-500">Prototype reference {state.confirmationRef || "SP-2026-DEMO"}</span></span></div><div className="mt-6 grid grid-cols-2 gap-4 border-t border-sahara-ink/10 pt-5 text-sm"><div><span className="block text-slate-500">Verification path</span><span className="mt-1 block font-bold capitalize">{verificationMethod || state.method || "Prototype"}</span></div><div><span className="block text-slate-500">Status</span><span className="mt-1 block font-bold text-emerald-700">Marked complete in demo</span></div></div></div><div className="flex flex-col gap-3"><Button variant="light" onClick={downloadConfirmationPdf} icon={ClipboardCheck}>Download PDF</Button><Button variant="light" onClick={() => setScreen("reminders")} icon={Bell}>Set mock reminders</Button></div></div><div className="mt-6 flex flex-col gap-3 rounded-2xl bg-sahara-mist p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm leading-6 text-slate-600"><b className="text-sahara-ink">What this means:</b> This screen and every export are synthetic proof-of-concept artifacts only. No official life certificate, payment status, SMS, bank record, or government update has been created.</p><Button variant="ghost" className="shrink-0" onClick={shareConfirmation} icon={Send}>Share status</Button></div></div></div></section>}
      {screen === "camps" && <section className="mx-auto w-full max-w-6xl flex-1 py-3 sm:py-7 page-enter"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><button onClick={() => setScreen(pensionerId ? "home" : "landing")} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-forest hover:underline"><ArrowLeft className="h-4 w-4"/>Back</button><h1 className="font-display mt-3 text-4xl tracking-[-.05em] sm:text-5xl">{copy.campsTitle}</h1><p className="mt-3 max-w-2xl leading-7 text-slate-600">{copy.campsDescription}</p></div><div className="w-full space-y-3 sm:w-64"><label className="text-xs font-bold tracking-[.12em] text-slate-500">INDIA PIN CODE</label><input value={pincode} onChange={e => setPincode(e.target.value.replace(/\\D/g, "").slice(0, 6))} maxLength={6} inputMode="numeric" aria-label="India PIN code" className="mt-2 min-h-12 w-full rounded-2xl border border-sahara-ink/15 bg-white px-4 font-bold outline-none focus:border-sahara-forest"/><button onClick={useMyLocation} disabled={geoStatus === "requesting"} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-sahara-ink/10 bg-sahara-mist px-4 text-sm font-bold text-sahara-forest hover:border-sahara-forest/30 disabled:opacity-60"><LocateFixed className="h-4 w-4"/>{geoStatus === "requesting" ? "Finding your location…" : copy.useMyLocation}</button>{geoStatus === "ready" && <p role="status" className="text-xs font-bold text-sahara-forest">{copy.locationReady}{geoAccuracy ? ` · Accuracy ±${geoAccuracy} m · Not stored` : ""}</p>}{geoStatus === "unavailable" && <p role="status" className="text-xs text-sahara-coral">{copy.locationUnavailable}</p>}</div></div><div className="mt-7 grid gap-4 lg:grid-cols-[.8fr_1.2fr]"><div className="overflow-hidden rounded-[30px] bg-sahara-ink text-white"><div className="flex items-center justify-between gap-3 px-6 pt-6"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><MapPin className="h-3.5 w-3.5 text-sahara-sun"/>{liveLocationsQuery.data?.source === "google" ? translate(lang, "Live Google Maps") : translate(lang, "Illustrative support view")}</span><span className="text-xs text-white/60">{liveLocations.length} places</span></div>{liveLocationsQuery.data?.source === "google" ? <MapView className="mt-4 h-[280px]" initialCenter={liveLocationsQuery.data.center} initialZoom={13} markers={liveLocationMarkers}/> : <div className="relative mt-4 h-64"><span className="absolute left-[13%] top-[23%] grid h-12 w-12 place-items-center rounded-full border-4 border-sahara-sun bg-sahara-ink text-xs font-bold">YOU</span>{["left-[55%] top-[9%]", "left-[65%] top-[55%]", "left-[28%] top-[67%]", "left-[78%] top-[25%]"].map(position => <span key={position} className={`absolute ${position} grid h-9 w-9 place-items-center rounded-full bg-sahara-mint text-sahara-forest shadow-lg`}><MapPin className="h-4 w-4"/></span>)}<svg className="absolute inset-0 h-full w-full opacity-30"><path d="M60 68 C160 20, 190 124, 300 45 S390 145, 440 85" stroke="white" strokeWidth="2" strokeDasharray="7 8" fill="none"/></svg></div>}<p className="px-6 pb-6 text-sm leading-6 text-white/60">{liveLocationMessage}</p></div><div className="space-y-3">{liveLocations.slice(0, 5).map((location, index) => <a key={location.id} href={location.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-sahara-ink/10 bg-white p-4 transition hover:border-sahara-forest/25 hover:shadow-sm"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sahara-mist font-display text-lg font-semibold text-sahara-forest">{index + 1}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{location.name}</h2><span className="rounded-full bg-sahara-mint px-2 py-0.5 text-[10px] font-bold text-sahara-forest">{location.kind}</span></div><p className="mt-1 truncate text-sm text-slate-500">{location.address}</p></div><div className="text-right"><p className="font-display text-xl font-semibold text-sahara-ink">{location.distanceKm == null ? "—" : `${location.distanceKm} km`}</p><p className="text-xs text-slate-500">{translate(lang, "Open map")}</p></div></a>)}</div></div></section>}
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
    ["What you are seeing", "Sahara Pramaan is an independent service concept. It does not represent or connect to any government, UIDAI, bank, India Post, pension, or identity service."],
    ["What is simulated", "All names, identifiers, OTPs, fingerprints, face/liveness results, family answers, camp locations, distances, confirmation references, reminders, and status changes are synthetic."],
    ["Family assistance", "The family-assist step is a low-friction demo interaction—not a secure identity-assurance mechanism. It must not be used to impersonate anyone or verify a real person."],
    ["At scale, for real", "A real version would need audited identity assurance, meaningful consent, fraud controls, privacy and accessibility review, regulated operations, live partner agreements, and an offline voice or USSD alternative."],
  ];
  return <section className="mx-auto w-full max-w-5xl flex-1 py-5 sm:py-9 page-enter"><div className="rounded-[34px] bg-sahara-ink p-7 text-white shadow-lift sm:p-10"><button onClick={onBack} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sahara-sun hover:underline"><ArrowLeft className="h-4 w-4"/>Back</button><div className="mt-9 max-w-2xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><Info className="h-3.5 w-3.5 text-sahara-sun"/>HONESTY DISCLOSURE</span><h1 className="font-display mt-5 text-4xl tracking-[-.05em] sm:text-5xl">Designed to make the limits unmistakably clear.</h1><p className="mt-4 text-[17px] leading-7 text-white/70">Trust starts with explaining what a prototype can—and cannot—do.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2">{sections.map(([title, body], index) => <article key={title} className="rounded-[24px] bg-white/8 p-5 ring-1 ring-white/10"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sahara-sun text-sm font-bold text-sahara-ink">0{index + 1}</span><h2 className="font-display mt-5 text-2xl tracking-[-.03em]">{title}</h2><p className="mt-3 text-sm leading-6 text-white/70">{body}</p></article>)}</div></div></section>;
}
