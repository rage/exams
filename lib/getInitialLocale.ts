import { Locale, isLocale, defaultLocale } from "../contexes/LocaleContext"

export function getInitialLocale(): Locale {
  const localSetting = localStorage.getItem("locale")
  if (localSetting && isLocale(localSetting)) {
    return localSetting
  }

  const [browserSetting] = navigator.language.split("-")
  if (isLocale(browserSetting)) {
    return browserSetting
  }

  return defaultLocale
}
