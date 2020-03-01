import React, { useContext } from "react"
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core"
import { signOut } from "../services/moocfi"
import LoginStateContext from "../contexes/LoginStateContext"
import styled from "styled-components"

const EmptySpace = styled.div`
  flex: 1;
`

const TopBar = () => {
  const { loggedIn, setAccessToken } = useContext(LoginStateContext)
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">MOOC.fi kokeet</Typography>
        <EmptySpace />
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
