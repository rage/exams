import React from "react"
import App from "next/app"
import Head from "next/head"
import { StylesProvider, ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import theme from "../lib/theme"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import LuxonUtils from "@date-io/luxon"

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <React.Fragment>
        <Head>
          <title>Kokeet</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <Component {...pageProps} />
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </StylesProvider>
      </React.Fragment>
    )
  }
}
