export const LANGUAGES = [
  { code: "en", tag: "en", name: "English", ogLocale: "en_US" },
  { code: "es", tag: "es", name: "Español", ogLocale: "es_ES" },
  { code: "ja", tag: "ja", name: "日本語", ogLocale: "ja_JP" },
  { code: "pt", tag: "pt-BR", name: "Português do Brasil", ogLocale: "pt_BR" },
  { code: "zh", tag: "zh-CN", name: "简体中文", ogLocale: "zh_CN" },
  { code: "ru", tag: "ru", name: "Русский", ogLocale: "ru_RU" },
  { code: "fr", tag: "fr", name: "Français", ogLocale: "fr_FR" },
  { code: "ko", tag: "ko", name: "한국어", ogLocale: "ko_KR" },
  { code: "de", tag: "de", name: "Deutsch", ogLocale: "de_DE" },
] as const;
export type LanguageCode = (typeof LANGUAGES)[number]["code"];
export const LANGUAGE_STORAGE_KEY = "fabric_master_lang";
export const SITE_ORIGIN = "https://fabric.dattasable.com";

export function normalizeLanguage(
  value: string | null | undefined,
): LanguageCode {
  const code = (value || "en").toLowerCase().split(/[-_]/)[0];
  return LANGUAGES.some((language) => language.code === code)
    ? (code as LanguageCode)
    : "en";
}
export function languageInfo(value?: string) {
  return LANGUAGES.find(
    (language) => language.code === normalizeLanguage(value),
  )!;
}
export function parseLocalizedPath(path: string) {
  const match = path.match(/^\/(en|es|ja|pt|zh|ru|fr|ko|de)(?=\/|\?|#|$)/);
  const language = normalizeLanguage(match?.[1]);
  const basename = match ? `/${match[1]}` : "";
  const route = match ? path.slice(basename.length) : path;
  return {
    language,
    basename,
    pathname: route.startsWith("/") ? route : `/${route}`,
  };
}
export function localizedPath(path: string, language: string) {
  const route = parseLocalizedPath(path).pathname;
  const code = normalizeLanguage(language);
  return code === "en"
    ? route
    : `/${code}${route.replace(/^\/(?=[?#]|$)/, "")}`;
}
export function localizedUrl(path: string, language: string) {
  return new URL(localizedPath(path, language), SITE_ORIGIN).href;
}
// Only fully translated page content is advertised as an indexable alternate.
// Reference articles and technical catalog content currently remain in English.
export function hasLocalizedSearchContent(pathname: string) {
  return pathname === "/";
}
