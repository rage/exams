import React from "react"
import { NextPage } from "next"
import { Exam, fetchExam } from "../../services/api"
import { Typography, Card, CardContent, Breadcrumbs } from "@material-ui/core"
import { DateTime } from "luxon"
import { Parser, HtmlRenderer } from "commonmark"
import styled from "styled-components"
import Link from "next/link"

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
    <>
      <StyledBreadcrumbs aria-label="breadcrumb">
        <Link href="/exams">
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
        </CardContent>
      </StyledCard>

      {exam.exercises.map((exercise, i) => {
        return (
          <StyledCard key={exercise.id}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Exercise {i + 1}
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
    </>
  )
}

Page.getInitialProps = async ctx => {
  const exam = await fetchExam(ctx.query.id?.toString())
  return { exam }
}

export default Page
