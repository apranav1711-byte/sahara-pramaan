import { describe, expect, it } from "vitest";
import { languageLabels, localeStrings, translate, type Lang } from "./i18n";

describe("Indian-language UI", () => {
  it("has localized critical labels for every supported language", () => {
    const languages = Object.keys(languageLabels) as Lang[];
    expect(languages).toHaveLength(10);
    for (const lang of languages) {
      expect(translate(lang, "Begin securely")).toBe(localeStrings[lang]["Begin securely"]);
      expect(translate(lang, "Back")).toBe(localeStrings[lang].Back);
      expect(translate(lang, "Use my location")).toBe(localeStrings[lang]["Use my location"]);
      if (lang !== "en") expect(translate(lang, "Begin securely")).not.toBe("Begin securely");
    }
    expect(translate("kn", "Begin securely")).toBe("ಸುರಕ್ಷಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ");
    expect(translate("bn", "Begin securely")).toBe("নিরাপদে শুরু করুন");
  });
});
