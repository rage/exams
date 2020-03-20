import React from "react"
import { NextPage } from "next"
import Error from "next/error"
import { getDisplayName } from "next/dist/next-server/lib/utils"
import { Locale, LocaleProvider, isLocale } from "../contexes/LocaleContext"

interface LangProps {
  locale?: Locale
}

export default (WrappedPage: NextPage<any>) => {
  const WithLocale: NextPage<any, LangProps> = ({ locale, ...pageProps }) => {
    if (!locale) {
      return <Error statusCode={404} />
    }
    return (
      <LocaleProvider lang={locale}>
        <WrappedPage {...pageProps} />
      </LocaleProvider>
    )
  }

  WithLocale.getInitialProps = async ctx => {
    if (typeof ctx.query.lang !== "string" || !isLocale(ctx.query.lang)) {
      return { locale: null }
    }
    let pageProps = {}
    if (WrappedPage.getInitialProps) {
      pageProps = await WrappedPage.getInitialProps(ctx)
    }
    return { ...pageProps, locale: ctx.query.lang }
  }

  WithLocale.displayName = `withLang(${getDisplayName(WrappedPage)})`

  return WithLocale
}
