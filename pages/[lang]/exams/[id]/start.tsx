import React from "react"
import { Typography, Card, TextField } from "@material-ui/core"
import { DateTime, Duration } from "luxon"
import { Parser, HtmlRenderer } from "commonmark"
import styled from "styled-components"
import Alert from "@material-ui/lab/Alert"
import { useTime } from "../../../../hooks/useTime"
import Layout from "../../../../components/Layout"
import {
  fetchExam,
  fetchExamExercises,
  fetchExamStarts,
} from "../../../../services/api"
import getAccessToken from "../../../../lib/getAccessToken"
import { withLoggedIn } from "../../../../contexes/LoginStateContext"
import withLocale from "../../../../lib/withLocale"
import useTranslator from "../../../../hooks/useTranslator"
import EssayEditor from "../../../../components/EssayEditor"
import { maxBy } from "lodash"

const ExerciseCard = styled(Card)`
  padding: 1rem;
  margin-bottom: 2rem;
`

const MINUTE_IN_MS = 60000

const Page = ({ exam, examExercises, examStarts }) => {
  const t = useTranslator()
  const reader = new Parser()
  const writer = new HtmlRenderer()
  const startTime = DateTime.fromISO(examStarts[0].created_at).setLocale(
    "fi-FI",
  )
  const endTime = startTime.plus(
    Duration.fromMillis(exam.time_minutes * MINUTE_IN_MS),
  )

  const now = useTime()

  let onGoing = true

  if (now < startTime || now > endTime) {
    onGoing = false
  }

  const remaining = endTime.diff(now).as("minutes")

  return (
    <Layout>
      <Typography variant="h3" component="h1">
        {exam.name}
      </Typography>
      <br />
      <Typography variant="h5" component="p">
        {t("you-have-started-the-exam")}
      </Typography>

      {remaining > 0 && remaining < 10 && (
        <>
          <br />
          <Alert severity="warning">
            {t("time-remaining-warning-1")} {Math.ceil(remaining)}{" "}
            {t("time-remaining-warning-2")}
          </Alert>
          <br />
        </>
      )}
      <br />
      <Typography>
        {t("exam-started-at")}:{" "}
        {startTime.toLocaleString(DateTime.TIME_24_SIMPLE)}.
      </Typography>
      <Typography>
        {t("total-exam-time")}: {exam.time_minutes} {t("minutes")}.
      </Typography>
      <Typography>
        {t("exam-ends-at")}: {endTime.toLocaleString(DateTime.TIME_24_SIMPLE)}.
      </Typography>
      <br />
      <Typography variant="h4" component="h2">
        {t("exercises-title")}
      </Typography>
      <br />
      {onGoing &&
        examExercises.map((o, i) => {
          // server sorts these
          const latestAnswer = o.answers[0]
          return (
            <ExerciseCard key={o.id}>
              <Typography variant="h5" component="h3">
                {t("exercise-title")} {i + 1}
              </Typography>
              <div
                dangerouslySetInnerHTML={{
                  __html: writer.render(reader.parse(o.content)),
                }}
              />
              {o.type === "essay" && (
                <EssayEditor
                  previousAnswer={latestAnswer?.content}
                  exerciseId={o.id}
                />
              )}
            </ExerciseCard>
          )
        })}

      {!onGoing && <Typography>{t("exam-has-ended")}</Typography>}

      <br />

      <Typography variant="h4" component="h2">
        {t("instructions-from-previous page")}
      </Typography>
      <br />
      <ExerciseCard>
        <div
          dangerouslySetInnerHTML={{
            __html: writer.render(reader.parse(exam.pre_instructions)),
          }}
        />
      </ExerciseCard>
    </Layout>
  )
}

Page.getInitialProps = async (ctx) => {
  const exam = await fetchExam(ctx.query.id?.toString(), getAccessToken(ctx))
  const examExercises = await fetchExamExercises(
    ctx.query.id?.toString(),
    getAccessToken(ctx),
  )
  const examStarts = await fetchExamStarts(
    ctx.query.id?.toString(),
    getAccessToken(ctx),
  )

  return { exam, examExercises, examStarts }
}

export default withLocale(withLoggedIn(Page))
