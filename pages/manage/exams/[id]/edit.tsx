import React, { useState } from "react"
import { Typography, Breadcrumbs } from "@material-ui/core"
import styled from "styled-components"
import Link from "next/link"
import { fetchExam, Exam } from "../../../../services/api"
import { DateTime } from "luxon"
import { withLoggedIn } from "../../../../contexes/LoginStateContext"
import Layout from "../../../../components/Layout"
import ExamEditor from "../../../../components/ExamEditor"

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 1rem;
`

interface PageProps {
  exam: Exam
}

const Page = ({ exam }: PageProps) => {
  return (
    <Layout>
      <StyledBreadcrumbs aria-label="breadcrumb">
        <Link href="/manage/exams">
          <a>Exams</a>
        </Link>
        <Typography color="textPrimary">Edit exam</Typography>
      </StyledBreadcrumbs>
      <Typography component="h1" variant="h3">
        Edit exam
      </Typography>
      <ExamEditor
        initialName={exam.name}
        initialEndsAt={DateTime.fromISO(exam.ends_at).toJSDate()}
        initialStartsAt={DateTime.fromISO(exam.starts_at).toJSDate()}
        initialExercises={exam.exercises}
        id={exam.id}
        isEdit
      />
    </Layout>
  )
}

Page.getInitialProps = async ctx => {
  const exam = await fetchExam(ctx.query.id?.toString())
  return { exam }
}

export default withLoggedIn(Page)