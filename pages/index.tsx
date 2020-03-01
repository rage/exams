import React from "react"
import { NextPage } from "next"
import { Typography, Card, Button, ButtonBase } from "@material-ui/core"
import { DateTime } from "luxon"
import styled from "styled-components"
import Link from "next/link"
import { SimpleExam, fetchExams } from "../services/api"
import Layout from "../components/Layout"
import { withLoggedIn } from "../contexes/LoginStateContext"

interface PageProps {
  exams: SimpleExam[]
}

const ExamCard = styled(Card)`
  padding: 1rem;
  width: 100%;
`

const StyledButtonBase = styled(ButtonBase)`
  margin-bottom: 1rem;
  width: 100%;
`

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
`

const Page: NextPage<PageProps> = ({ exams }) => {
  return (
    <Layout>
      <Typography variant="h3" component="h1">
        Exams
      </Typography>

      <br />

      {exams.map(o => {
        return (
          <Link key={o.id} href="/exams/[id].tsx" as={`/exams/${o.id}`}>
            <StyledLink>
              <StyledButtonBase component="div">
                <ExamCard>
                  <Typography variant="h5" component="h2">
                    {o.name}
                  </Typography>
                  <Typography>
                    {DateTime.fromISO(o.starts_at).toLocaleString(
                      DateTime.DATE_FULL,
                    )}
                  </Typography>
                </ExamCard>
              </StyledButtonBase>
            </StyledLink>
          </Link>
        )
      })}
    </Layout>
  )
}

Page.getInitialProps = async ctx => {
  const exams = await fetchExams()
  return { exams }
}

export default withLoggedIn(Page)
