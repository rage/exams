import React from "react"
import Layout from "../../../components/Layout"
import { withLoggedIn } from "../../../contexes/LoginStateContext"
import { Typography } from "@material-ui/core"
import { fetchExam } from "../../../services/api"
import getAccessToken from "../../../lib/getAccessToken"
import { DateTime } from "luxon"

const Page = ({ exam }) => {
  return (
    <Layout>
      <Typography variant="h3" component="h1">
        Koe on alkanut.
      </Typography>

      <Typography>
        Aloitit kokeen:{" "}
        {DateTime.fromISO(exam.exam_starts[0].created_at)
          .setLocale("fi-FI")
          .toLocaleString(DateTime.TIME_24_SIMPLE)}
      </Typography>
    </Layout>
  )
}

Page.getInitialProps = async ctx => {
  const exam = await fetchExam(ctx.query.id?.toString(), getAccessToken(ctx))

  return { exam }
}

export default withLoggedIn(Page)
