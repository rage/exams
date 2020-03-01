import React, { useState } from "react"
import { Typography, Breadcrumbs, NoSsr } from "@material-ui/core"
import styled from "styled-components"
import Link from "next/link"
import ExamEditor from "../../../components/ExamEditor"
import { fetchExam, Exam } from "../../../services/api"
import { DateTime } from "luxon"

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 1rem;
`

interface PageProps {
  exam: Exam
}

const Page = ({ exam }: PageProps) => {
  return (
    <>
      <StyledBreadcrumbs aria-label="breadcrumb">
        <Link href="/exams">
          <a>Exams</a>
        </Link>
        <Typography color="textPrimary">Edit exam</Typography>
      </StyledBreadcrumbs>
      <Typography component="h1" variant="h3">
        Edit exam
      </Typography>
      <NoSsr>
        <ExamEditor
          initialName={exam.name}
          initialEndsAt={DateTime.fromISO(exam.ends_at).toJSDate()}
          initialStartsAt={DateTime.fromISO(exam.starts_at).toJSDate()}
          initialExercises={exam.exercises}
          id={exam.id}
          isEdit
        />
      </NoSsr>
    </>
  )
}

Page.getInitialProps = async ctx => {
  const exam = await fetchExam(ctx.query.id?.toString())
  return { exam }
}

export default Page