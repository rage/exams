import { useContext } from "react"
import { LocaleContext } from "../contexes/LocaleContext"
import translations from "../translations"

const useTranslator = () => {
  const { locale } = useContext(LocaleContext)
  const mapping = translations[locale]
  const t = (key: string) => {
    return mapping[key] || key
  }
  return t
}

export default useTranslator
