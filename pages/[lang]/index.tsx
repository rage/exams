import React, { useContext } from "react"
import { NextPage } from "next"
import { Typography, Card, Button, ButtonBase, NoSsr } from "@material-ui/core"
import { DateTime } from "luxon"
import styled from "styled-components"
import Link from "next/link"
import { SimpleExam, fetchExams } from "../../services/api"
import { withLoggedIn } from "../../contexes/LoginStateContext"
import getAccessToken from "../../lib/getAccessToken"
import { useTime } from "../../hooks/useTime"
import Layout from "../../components/Layout"
import withLocale from "../../lib/withLocale"
import useTranslator from "../../hooks/useTranslator"
import { LocaleContext } from "../../contexes/LocaleContext"

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
  const t = useTranslator()
  const { locale } = useContext(LocaleContext)
  const now = useTime()
  const currentDateString = now.toLocaleString(DateTime.DATE_FULL)

  return (
    <Layout>
      <Typography variant="h3" component="h1">
        {t("exams-today")}
      </Typography>

      <br />

      {exams
        .filter((o) => {
          const start = DateTime.fromISO(o.starts_at)
          const end = DateTime.fromISO(o.ends_at)
          return (
            start.toLocaleString(DateTime.DATE_FULL) === currentDateString ||
            (now > start && now < end)
          )
        })
        .sort((o1, o2) =>
          DateTime.fromISO(o1.starts_at)
            .diff(DateTime.fromISO(o2.starts_at))
            .as("seconds"),
        )
        .map((o) => {
          return (
            <Link
              key={o.id}
              href={`${locale}/exams/[id].tsx`}
              as={`${locale}/exams/${o.id}`}
            >
              <StyledLink>
                <StyledButtonBase component="div">
                  <ExamCard>
                    <Typography variant="h5" component="h2">
                      {o.name}
                    </Typography>
                    <Typography>
                      <NoSsr>
                        {DateTime.fromISO(o.starts_at).toLocaleString(
                          DateTime.DATE_FULL,
                        )}
                      </NoSsr>
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

Page.getInitialProps = async (ctx) => {
  const exams = await fetchExams(getAccessToken(ctx))
  return { exams }
}

export default withLocale(withLoggedIn(Page))
