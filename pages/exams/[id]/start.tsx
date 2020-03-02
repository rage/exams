import React from "react"
import Layout from "../../../components/Layout"
import { withLoggedIn } from "../../../contexes/LoginStateContext"
import { Typography, Card } from "@material-ui/core"
import { fetchExam, fetchExamExercises } from "../../../services/api"
import getAccessToken from "../../../lib/getAccessToken"
import { DateTime, Duration } from "luxon"
import { Parser, HtmlRenderer } from "commonmark"
import styled from "styled-components"

const ExerciseCard = styled(Card)`
  padding: 1rem;
`

const MINUTE_IN_MS = 60000

const Page = ({ exam, examExercises }) => {
  const reader = new Parser()
  const writer = new HtmlRenderer()
  const startTime = DateTime.fromISO(exam.exam_starts[0].created_at).setLocale(
    "fi-FI",
  )
  const endTime = startTime.plus(
    Duration.fromMillis(exam.time_minutes * MINUTE_IN_MS),
  )
  return (
    <Layout>
      <Typography variant="h3" component="h1">
        {exam.name}
      </Typography>
      <Typography variant="h5" component="p">
        Olet aloittanut kokeen.
      </Typography>
      <br />
      <Typography>
        Aloitit kokeen: {startTime.toLocaleString(DateTime.TIME_24_SIMPLE)}.
      </Typography>
      <Typography>Koeaikaa yhteensä: {exam.time_minutes} minuuttia.</Typography>
      <Typography>
        Koeaika loppuu: {endTime.toLocaleString(DateTime.TIME_24_SIMPLE)}.
      </Typography>
      <br />
      <Typography variant="h4" component="h2">
        Tehtävät
      </Typography>
      <br />
      {examExercises.map((o, i) => {
        return (
          <ExerciseCard key={o.id}>
            <Typography variant="h5" component="h3">
              Tehtävä {i + 1}
            </Typography>
            <div
              dangerouslySetInnerHTML={{
                __html: writer.render(reader.parse(o.content)),
              }}
            />
          </ExerciseCard>
        )
      })}
    </Layout>
  )
}

Page.getInitialProps = async ctx => {
  const exam = await fetchExam(ctx.query.id?.toString(), getAccessToken(ctx))
  const examExercises = await fetchExamExercises(
    ctx.query.id?.toString(),
    getAccessToken(ctx),
  )

  return { exam, examExercises }
}

export default withLoggedIn(Page)
