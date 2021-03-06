import React from "react"
import { NextPage } from "next"
import { Exam, fetchExam } from "../../../services/api"
import {
  Typography,
  Card,
  CardContent,
  Breadcrumbs,
  Button,
} from "@material-ui/core"
import { DateTime } from "luxon"
import { Parser, HtmlRenderer } from "commonmark"
import styled from "styled-components"
import Link from "next/link"
import { withLoggedIn } from "../../../contexes/LoginStateContext"
import Layout from "../../../components/Layout"
import getAccessToken from "../../../lib/getAccessToken"

interface PageProps {
  exam: Exam
}

const StyledCard = styled(Card)`
  margin-bottom: 1rem;
`

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 1rem;
`

const Page: NextPage<PageProps> = ({ exam }) => {
  const reader = new Parser()
  const writer = new HtmlRenderer()

  return (
    <Layout>
      <StyledBreadcrumbs aria-label="breadcrumb">
        <Link href="/manage/exams">
          <a>Exams</a>
        </Link>
        <Typography color="textPrimary">{exam.name}</Typography>
      </StyledBreadcrumbs>
      <Typography variant="h3" component="h1">
        {exam.name}
      </Typography>

      <StyledCard>
        <CardContent>
          <Typography>
            Starts at:{" "}
            {DateTime.fromISO(exam.starts_at)
              .toLocal()
              .toLocaleString(DateTime.DATETIME_FULL)}
          </Typography>
          <Typography>
            Ends at:{" "}
            {DateTime.fromISO(exam.ends_at)
              .toLocal()
              .toLocaleString(DateTime.DATETIME_FULL)}
          </Typography>
          <Typography>
            Time to do the exam in minutes: {exam.time_minutes}
          </Typography>
        </CardContent>
      </StyledCard>

      <StyledCard>
        <CardContent>
          <Typography component="h2" variant="h5">
            Instructions to show before starting the exam
          </Typography>
          <div
            dangerouslySetInnerHTML={{
              __html: writer.render(reader.parse(exam.pre_instructions)),
            }}
          />
        </CardContent>
      </StyledCard>

      {exam.exercises.map((exercise, i) => {
        return (
          <StyledCard key={exercise.id}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Exercise {i + 1} ({exercise.type})
              </Typography>

              <div
                dangerouslySetInnerHTML={{
                  __html: writer.render(reader.parse(exercise.content)),
                }}
              />
            </CardContent>
          </StyledCard>
        )
      })}
      <Link href="/manage/exams/[id]/edit" as={`/manage/exams/${exam.id}/edit`}>
        <a>
          <Button variant="outlined" color="primary">
            Edit
          </Button>
        </a>
      </Link>
    </Layout>
  )
}

Page.getInitialProps = async (ctx) => {
  const exam = await fetchExam(ctx.query.id?.toString(), getAccessToken(ctx))
  return { exam }
}

export default withLoggedIn(Page)
