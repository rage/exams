import React from "react"
import { Typography, Breadcrumbs } from "@material-ui/core"
import styled from "styled-components"
import Link from "next/link"
import ExamEditor from "../../components/ExamEditor"
import { withLoggedIn } from "../../contexes/LoginStateContext"

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 1rem;
`

const Page = () => {
  return (
    <>
      <StyledBreadcrumbs aria-label="breadcrumb">
        <Link href="/exams">
          <a>Exams</a>
        </Link>
        <Typography color="textPrimary">New exam</Typography>
      </StyledBreadcrumbs>
      <Typography component="h1" variant="h3">
        New exam
      </Typography>
      <ExamEditor />
    </>
  )
}

export default withLoggedIn(Page)
