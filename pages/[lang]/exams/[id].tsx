import React, { useState, useContext } from "react"
import { Parser, HtmlRenderer } from "commonmark"
import { NextPage } from "next"
import styled from "styled-components"
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardContent,
  Card,
} from "@material-ui/core"
import { DateTime } from "luxon"
import { Router, useRouter } from "next/router"
import LoginStateContext, {
  withLoggedIn,
} from "../../../contexes/LoginStateContext"
import { useTime } from "../../../hooks/useTime"
import Layout from "../../../components/Layout"
import {
  startExam,
  fetchExam,
  fetchExamStarts,
  Exam,
} from "../../../services/api"
import getAccessToken from "../../../lib/getAccessToken"
import withLocale from "../../../lib/withLocale"
import useTranslator from "../../../hooks/useTranslator"
import { LocaleContext } from "../../../contexes/LocaleContext"

interface PageProps {
  exam: Exam
}

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`

const Page: NextPage<PageProps> = ({ exam }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { accessToken } = useContext(LoginStateContext)
  const t = useTranslator()
  const { locale } = useContext(LocaleContext)
  const reader = new Parser()
  const writer = new HtmlRenderer()
  const router = useRouter()

  const startTime = DateTime.fromISO(exam.starts_at)
  const now = useTime()
  const endTime = DateTime.fromISO(exam.ends_at)

  let canStart = true

  if (now < startTime || now > endTime) {
    canStart = false
  }

  return (
    <Layout>
      <Typography variant="h3" component="h1">
        {t("exam-title")}: {exam.name}
      </Typography>
      <br />
      <Typography>
        {t("exam-can-be-started-at")}:{" "}
        {DateTime.fromISO(exam.starts_at)
          .setLocale(locale)
          .toLocaleString(DateTime.DATETIME_FULL)}
        .
      </Typography>
      <Typography>
        {t("exam-must-be-completed-before")}:{" "}
        {DateTime.fromISO(exam.ends_at)
          .setLocale(locale)
          .toLocaleString(DateTime.DATETIME_FULL)}
        .
      </Typography>
      <br />
      <Typography>
        {t("start-exam-time-1")} {exam.time_minutes} {t("start-exam-time-2")}
      </Typography>
      <br />

      <div
        dangerouslySetInnerHTML={{
          __html: writer.render(reader.parse(exam.pre_instructions)),
        }}
      />

      <br />

      <Button
        onClick={() => {
          setConfirmDialogOpen(true)
        }}
        disabled={!canStart}
        variant="contained"
        color="primary"
      >
        {t("start-exam")}
      </Button>
      <Dialog
        open={confirmDialogOpen && canStart}
        onClose={() => {
          setConfirmDialogOpen(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("are-you-sure-you-want-to-start-the-exam")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("start-exam-warning-1")} {exam.time_minutes}{" "}
            {t("start-exam-warning-2")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmDialogOpen(false)
            }}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={async () => {
              setConfirmDialogOpen(false)
              await startExam(exam.id, accessToken)
              router.push(
                `/${locale}/exams/${router.query.id?.toString()}/start`,
              )
            }}
            color="primary"
            autoFocus
          >
            {t("start-exam")}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

Page.getInitialProps = async ctx => {
  const exam = await fetchExam(ctx.query.id?.toString(), getAccessToken(ctx))
  const location = `/${ctx.query.lang?.toString()}/exams/${ctx.query.id?.toString()}/start`
  const examStarts = await fetchExamStarts(
    ctx.query.id?.toString(),
    getAccessToken(ctx),
  )
  // @ts-ignore
  if (examStarts.length > 0) {
    if (ctx.res) {
      // Seems to be the version used by zeit
      ctx.res.writeHead(302, {
        Location: location,
        // Add the content-type for SEO considerations
        "Content-Type": "text/html; charset=utf-8",
      })
      ctx.res.end()
      return
    }

    // @ts-ignore
    Router.replace(location)
  }
  return { exam }
}

export default withLocale(withLoggedIn(Page))
