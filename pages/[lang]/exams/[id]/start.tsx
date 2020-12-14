import React, { useContext } from "react"
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
import LoginStateContext, {
  withLoggedIn,
} from "../../../../contexes/LoginStateContext"
import withLocale from "../../../../lib/withLocale"
import useTranslator from "../../../../hooks/useTranslator"
import EssayEditor from "../../../../components/EssayEditor"
import usePromise from "react-use-promise"
import { useRouter } from "next/router"

const ExerciseCard = styled(Card)`
  padding: 1rem;
  margin-bottom: 2rem;
`

const MINUTE_IN_MS = 60000

const Page = () => {
  const t = useTranslator()
  const router = useRouter()
  const now = useTime()
  const { accessToken } = useContext(LoginStateContext)
  const examId = router.query.id?.toString()
  const [exam, examError] = usePromise(() => fetchExam(examId, accessToken), [
    accessToken,
    examId,
  ])
  const [examExercises, examExercisesError] = usePromise(
    () => fetchExamExercises(examId, accessToken),
    [accessToken, examId],
  )
  const [examStarts, examStartsError] = usePromise(
    () => fetchExamStarts(examId, accessToken),
    [accessToken, examId],
  )

  if (examError || examExercisesError || examStartsError) {
    return <Layout>{t("loading-error")}</Layout>
  }

  if (!exam || !examExercises || !examStarts) {
    return <Layout>{t("loading")}...</Layout>
  }

  const reader = new Parser()
  const writer = new HtmlRenderer()
  const startTime = DateTime.fromISO(examStarts[0].created_at).setLocale(
    "fi-FI",
  )
  const endTime = startTime.plus(
    Duration.fromMillis(exam.time_minutes * MINUTE_IN_MS),
  )

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

export default withLocale(withLoggedIn(Page))
