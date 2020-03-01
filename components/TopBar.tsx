import React, { useContext } from "react"
import { AppBar, Toolbar, Typography, Button, Chip } from "@material-ui/core"
import { signOut } from "../services/moocfi"
import LoginStateContext from "../contexes/LoginStateContext"
import styled from "styled-components"
import Link from "next/link"

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
  const { loggedIn, admin, setAccessToken } = useContext(LoginStateContext)
  return (
    <AppBar position="static">
      <Toolbar>
        <Link href="/">
          <MainNavigationLink>
            <Typography variant="h6">MOOC.fi kokeet</Typography>
          </MainNavigationLink>
        </Link>
        {admin && (
          <Link href="/exams">
            <NavigationLink>Manage exams</NavigationLink>
          </Link>
        )}
        <EmptySpace />
        {admin && <StyledChip label="Admin" />}
        {loggedIn && (
          <Button
            variant="contained"
            onClick={() => {
              signOut({ setAccessToken })
            }}
          >
            Kirjaudu ulos
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
