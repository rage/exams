import React from "react"
import { Container } from "@material-ui/core"
import styled from "styled-components"

const StyledContainer = styled(Container)`
  padding-top: 1rem;
`
const Layout = ({ children }) => {
  return <StyledContainer maxWidth="md">{children}</StyledContainer>
}

export default Layout
