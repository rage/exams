import React, { useContext } from "react"
import { AppBar, Toolbar, Typography, Button, Chip } from "@material-ui/core"
import { signOut } from "../services/moocfi"
import LoginStateContext from "../contexes/LoginStateContext"
import styled from "styled-components"
import Link from "next/link"
import { useRouter } from "next/router"
import { LocaleContext } from "../contexes/LocaleContext"
import useTranslator from "../hooks/useTranslator"

const EmptySpace = styled.div`
  flex: 1;
`

const StyledChip = styled(Chip)`
  margin-right: 1em;
`

const NavigationLink = styled.a`
  color: white;
  margin: 0 1rem;
  cursor: pointer;
  position: relative;
  bottom: -2px;
`

const MainNavigationLink = styled.a`
  color: white;
  margin: 0 1rem;
  cursor: pointer;
`

const TopBar = () => {
  const { loggedIn, admin, setAccessToken, setAdmin } = useContext(
    LoginStateContext,
  )
  const { locale } = useContext(LocaleContext)

  const router = useRouter()
  const t = useTranslator()

  const alternativeLocale = locale === "fi" ? "en" : "fi"
  const changeLocalePath = router.asPath.replace(locale, alternativeLocale)
  const changeLoccalePathName = router.pathname.replace(
    locale,
    alternativeLocale,
  )

  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/">
          <MainNavigationLink>
            <Typography variant="h6">{t("site-name")}</Typography>
          </MainNavigationLink>
        </Link>
        {admin && (
          <Link passHref href="/manage/exams">
            <NavigationLink>Manage exams</NavigationLink>
          </Link>
        )}
        <EmptySpace />
        <Link
          shallow={true}
          passHref
          href={changeLoccalePathName}
          as={changeLocalePath}
        >
          <NavigationLink>{t("switch-language")}</NavigationLink>
        </Link>
        {admin && <StyledChip label="Admin" />}
        {loggedIn && (
          <Button
            variant="contained"
            onClick={() => {
              signOut({ setAccessToken, setAdmin })
            }}
          >
            {t("log-out")}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
