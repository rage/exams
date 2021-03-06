import React from "react"
import { Typography, Breadcrumbs } from "@material-ui/core"
import styled from "styled-components"
import Link from "next/link"
import { withLoggedIn } from "../../../contexes/LoginStateContext"
import Layout from "../../../components/Layout"
import ExamEditor from "../../../components/ExamEditor"

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 1rem;
`

const Page = () => {
  return (
    <Layout>
      <StyledBreadcrumbs aria-label="breadcrumb">
        <Link href="/manage/exams">
          <a>Exams</a>
        </Link>
        <Typography color="textPrimary">New exam</Typography>
      </StyledBreadcrumbs>
      <Typography component="h1" variant="h3">
        New exam
      </Typography>
      <ExamEditor />
    </Layout>
  )
}

export default withLoggedIn(Page)
