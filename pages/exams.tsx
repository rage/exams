import React from "react"
import { NextPage } from "next"
import { Typography, Card } from "@material-ui/core"
import { DateTime } from "luxon"
import { SimpleExam, fetchExams } from "../services/api"
import styled from "styled-components"
import Link from "next/link"

interface PageProps {
  exams: SimpleExam[]
}

const ExamCard = styled(Card)`
  margin-bottom: 1rem;
  padding: 1rem;
`

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
`

const Page: NextPage<PageProps> = ({ exams }) => {
  return (
    <>
      <Typography variant="h3" component="h1">
        Exams
      </Typography>

      <br />

      {exams.map(o => {
        return (
          <Link key={o.id} href="/exams/[id].tsx" as={`/exams/${o.id}`}>
            <StyledLink>
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
            </StyledLink>
          </Link>
        )
      })}
    </>
  )
}

Page.getInitialProps = async ctx => {
  const exams = await fetchExams()
  return { exams }
}

export default Page
