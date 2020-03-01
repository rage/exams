import React, { useContext } from "react"
import { Container, Button } from "@material-ui/core"
import styled from "styled-components"
import LoginStateContext from "../contexes/LoginStateContext"
import SignInForm from "./SignInForm"
import { signOut } from "../services/moocfi"
import TopBar from "./TopBar"

const StyledContainer = styled(Container)`
  padding-top: 1rem;
`
const Layout = ({ children }) => {
  const { loggedIn } = useContext(LoginStateContext)
  if (!loggedIn) {
    return (
      <>
        <TopBar />
        <StyledContainer maxWidth="md">
          <SignInForm />
        </StyledContainer>
      </>
    )
  }
  return (
    <>
      <TopBar />
      <StyledContainer maxWidth="md">{children}</StyledContainer>
    </>
  )
}

export default Layout
