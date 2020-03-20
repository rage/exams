import React, { useState, useContext } from "react"
import Layout from "../../components/Layout"
import LoginStateContext, {
  withLoggedIn,
} from "../../contexes/LoginStateContext"
import { fetchExam, Exam, startExam, fetchExamStarts } from "../../services/api"
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
import getAccessToken from "../../lib/getAccessToken"
import { Router, useRouter } from "next/router"
import { useTime } from "../../hooks/useTime"

interface PageProps {
  exam: Exam
}

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`

const Page: NextPage<PageProps> = ({ exam }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { accessToken } = useContext(LoginStateContext)
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
        Koe: {exam.name}
      </Typography>
      <br />
      <Typography>
        Kokeen voi aloittaa aikaisintaan:{" "}
        {DateTime.fromISO(exam.starts_at)
          .setLocale("fi-FI")
          .toLocaleString(DateTime.DATETIME_FULL)}
        .
      </Typography>
      <Typography>
        Koe täytyy olla tehtynä viimeistään:{" "}
        {DateTime.fromISO(exam.ends_at)
          .setLocale("fi-FI")
          .toLocaleString(DateTime.DATETIME_FULL)}
        .
      </Typography>
      <br />
      <Typography>
        Kun aloitat kokeen, sinulla on {exam.time_minutes} minuuttia aikaa tehdä
        se.
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
        Aloita koe
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
          {"Haluatko varmasti aloittaa kokeen?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Kun olet aloittanut kokeen, et voi enää perua aloittamista.
            Aloittamisen jälkeen sinulla on {exam.time_minutes} minuuttia aikaa
            tehdä koetta.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmDialogOpen(false)
            }}
            color="primary"
          >
            Peru
          </Button>
          <Button
            onClick={async () => {
              setConfirmDialogOpen(false)
              await startExam(exam.id, accessToken)
              router.push(`/exams/${router.query.id?.toString()}/start`)
            }}
            color="primary"
            autoFocus
          >
            Aloita koe
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

Page.getInitialProps = async ctx => {
  const exam = await fetchExam(ctx.query.id?.toString(), getAccessToken(ctx))
  const location = `/exams/${ctx.query.id?.toString()}/start`
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

export default withLoggedIn(Page)
