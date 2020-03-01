import React, { useContext } from "react"
import { Typography } from "@material-ui/core"
import LoginStateContext, { withLoggedIn } from "../contexes/LoginStateContext"
import Layout from "../components/Layout"

const Page = () => {
  const { loggedIn } = useContext(LoginStateContext)
  return (
    <Layout>
      <Typography component="h1" variant="h3">
        Koepalvelu {loggedIn.toString()}
      </Typography>
    </Layout>
  )
}

export default withLoggedIn(Page)
