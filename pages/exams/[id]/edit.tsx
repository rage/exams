import React, { useState } from "react"
import { Typography, Breadcrumbs, NoSsr } from "@material-ui/core"
import styled from "styled-components"
import Link from "next/link"
import ExamEditor from "../../../components/ExamEditor"

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 1rem;
`

const App = () => {
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
        <ExamEditor />
      </NoSsr>
    </>
  )
}

export default App
