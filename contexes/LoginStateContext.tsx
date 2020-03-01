import { createContext, useState } from "react"
import App from "next/app"
import cookies from "next-cookies"

export interface LoginStateContextValue {
  loggedIn: boolean
  setAccessToken: (value: string | undefined) => void
}

const defaultValue: LoginStateContextValue = {
  loggedIn: false,
  setAccessToken: () => {
    console.warn("Set accesstoken called without withLoggedIn")
  },
}

export const withLoggedIn = PageComponent => {
  const WithLoggedIn = ({ accessToken, ...pageProps }) => {
    const [currentToken, setCurrentToken] = useState(accessToken)
    return (
      <LoginStateContext.Provider
        value={{ loggedIn: !!currentToken, setAccessToken: setCurrentToken }}
      >
        <PageComponent {...pageProps} />
      </LoginStateContext.Provider>
    )
  }
  WithLoggedIn.getInitialProps = async ctx => {
    const inAppContext = Boolean(ctx.ctx)
    let pageProps = {}
    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx)
    } else if (inAppContext) {
      pageProps = await App.getInitialProps(ctx)
    }

    let accessToken = cookies(ctx).access_token
    if (accessToken === "") {
      accessToken = undefined
    }
    return { ...pageProps, accessToken }
  }
  return WithLoggedIn
}

const LoginStateContext = createContext(defaultValue)
LoginStateContext.displayName = "LoginStateContext"

export default LoginStateContext
