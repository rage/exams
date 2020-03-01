import React, { useState } from "react"
import Layout from "../../components/Layout"
import { withLoggedIn } from "../../contexes/LoginStateContext"
import { fetchExam, Exam } from "../../services/api"
import { NextPage } from "next"
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core"
import { DateTime } from "luxon"

interface PageProps {
  exam: Exam
}

const Page: NextPage<PageProps> = ({ exam }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
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
      <Button
        onClick={() => {
          setConfirmDialogOpen(true)
        }}
        variant="contained"
        color="primary"
      >
        Aloita koe
      </Button>
      <Dialog
        open={confirmDialogOpen}
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
            Kun olet aloittanut kokeen, et voi enää perua aloittamista. Aloittamisen jälkeen sinulla on  {exam.time_minutes} minuuttia aikaa tehdä koetta.
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
            onClick={() => {
              setConfirmDialogOpen(false)
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
  const exam = await fetchExam(ctx.query.id?.toString())
  return { exam }
}

export default withLoggedIn(Page)
