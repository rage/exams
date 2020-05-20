import { createContext, useState } from "react"
import App from "next/app"
import cookies from "next-cookies"

export interface LoginStateContextValue {
  loggedIn: boolean
  setAccessToken: (value: string | undefined) => void
  setAdmin: (value: boolean) => void
  admin: boolean
  accessToken: string
}

const defaultValue: LoginStateContextValue = {
  loggedIn: false,
  admin: false,
  setAccessToken: () => {
    console.warn("Set accesstoken called without withLoggedIn")
  },
  setAdmin: () => {
    console.warn("Set accesstoken called without withLoggedIn")
  },
  accessToken: "",
}

export const withLoggedIn = (PageComponent) => {
  const WithLoggedIn = ({ accessToken, admin, ...pageProps }) => {
    const [currentToken, setCurrentToken] = useState(accessToken)
    const [currentAdmin, setCurrentAdmin] = useState(admin)
    return (
      <LoginStateContext.Provider
        value={{
          loggedIn: !!currentToken,
          admin: !!currentAdmin,
          setAccessToken: setCurrentToken,
          setAdmin: setCurrentAdmin,
          accessToken: accessToken,
        }}
      >
        <PageComponent {...pageProps} />
      </LoginStateContext.Provider>
    )
  }
  WithLoggedIn.getInitialProps = async (ctx) => {
    const inAppContext = Boolean(ctx.ctx)
    let pageProps = {}
    if (PageComponent.getInitialProps) {
      pageProps = await PageComponent.getInitialProps(ctx)
    } else if (inAppContext) {
      pageProps = await App.getInitialProps(ctx)
    }

    let accessToken = cookies(ctx).access_token
    let admin = cookies(ctx).admin === "true"
    if (accessToken === "") {
      accessToken = undefined
    }
    return { ...pageProps, accessToken, admin }
  }
  return WithLoggedIn
}

const LoginStateContext = createContext(defaultValue)
LoginStateContext.displayName = "LoginStateContext"

export default LoginStateContext
