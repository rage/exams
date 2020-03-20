import React from "react"
import { useRouter } from "next/router"

export const defaultLocale = "en" as const

export const locales = ["en", "fi"] as const

export const languageNames = {
  en: "English",
  fr: "français",
  pl: "polski",
}

interface ContextProps {
  readonly locale: Locale
  readonly setLocale: (locale: Locale) => void
}

export type Locale = typeof locales[number]

export type Strings = {
  [key in Locale]: {
    [key: string]: string
  }
}

export function isLocale(tested: string): tested is Locale {
  return locales.some(locale => locale === tested)
}

export const LocaleContext = React.createContext<ContextProps>({
  locale: "en",
  setLocale: () => null,
})

export const LocaleProvider: React.FC<{ lang: Locale }> = ({
  lang,
  children,
}) => {
  const [locale, setLocale] = React.useState(lang)
  const { query } = useRouter()

  React.useEffect(() => {
    if (locale !== localStorage.getItem("locale")) {
      localStorage.setItem("locale", locale)
    }
  }, [locale])

  React.useEffect(() => {
    if (
      typeof query.lang === "string" &&
      isLocale(query.lang) &&
      locale !== query.lang
    ) {
      setLocale(query.lang)
    }
  }, [query.lang, locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}
