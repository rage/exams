import React from "react"
import { NextPage } from "next"
import { Exam, fetchExam } from "../../services/api"
import { Typography, Card, CardContent } from "@material-ui/core"
import { DateTime } from "luxon"
import { Parser, HtmlRenderer } from "commonmark"
import Link from "../../components/Link"

interface PageProps {
  exam: Exam
}

const Page: NextPage<PageProps> = ({ exam }) => {
  const reader = new Parser()
  const writer = new HtmlRenderer()
  return (
    <>
      <Typography variant="h3" component="h1">
        {exam.name}
      </Typography>

      <Card>
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
      </Card>
      <br />
      {exam.exercises.map((exercise, i) => {
        return (
          <Card key={exercise.id}>
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
          </Card>
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
