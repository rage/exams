import React from "react"
import Document, { Head, Main, NextScript } from "next/document"
import { ServerStyleSheets as MuiServerStyleSheets } from "@material-ui/core/styles"
import { ServerStyleSheet as StyledServerStyleSheet } from "styled-components"
import theme from "../lib/theme"

export default class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const muiSheets = new MuiServerStyleSheets()
  const styledSheet = new StyledServerStyleSheet()

  const originalRenderPage = ctx.renderPage

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => {
          const MuiStylesDataWrapper = muiSheets.collect(<App {...props} />)

          const styledComponentsDataWrapper = styledSheet.collectStyles(
            MuiStylesDataWrapper,
          )
          return styledComponentsDataWrapper
        },
      })

    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,

      // if we were to use GlobalStyles, we'd insert them here - or _app before <Head> ?
      styles: (
        <React.Fragment>
          {initialProps.styles}
          {sheets.getStyleElement()}
          {sheet.getStyleElement()}
          {flush() || null}
        </React.Fragment>
      ),
    }
  } finally {
    sheet.seal()
  }
}
