import React, { useState } from "react"
import {
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Card,
  Paper,
  Dialog,
  Breadcrumbs,
} from "@material-ui/core"
import styled from "styled-components"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { Parser, HtmlRenderer } from "commonmark"

import { KeyboardDateTimePicker } from "@material-ui/pickers"
import { createExam, Exercise } from "../../services/api"
import Link from "next/link"

const Row = styled.div`
  margin-bottom: 1rem;
`

const ExerciseCard = styled(Card)`
  padding: 1rem;
  margin-bottom: 1rem;
`

const DeleteButton = styled(Button)`
  float: right;
  margin-bottom: 5px;
`

const StyledAppBar = styled(Paper)`
  margin-bottom: 1rem;

  .MuiTabs-indicator {
    background-color: #8398f9;
    height: 0.25rem;
  }
`

const ExerciseCardTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`

const ActionButton = styled(Button)`
  margin-bottom: 1rem;
`

const ErrorContainer = styled(Card)`
  padding: 1rem;
`

const StyledBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 1rem;
`

const App = () => {
  const router = useRouter()
  const [name, setName] = useState("")
  const [startDatetime, setStartDatetime] = useState(new Date())
  const [endDatetime, setEndDatetime] = useState(new Date())
  const [exerciseArray, setExerciseArray] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [error, setError] = useState(null)
  const [errorData, setErrorData] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const reader = new Parser()
  const writer = new HtmlRenderer()

  return (
    <>
      <Dialog
        open={error !== null}
        onClose={() => {
          setError(null)
        }}
      >
        <ErrorContainer>
          <Typography>Error: {error && error}</Typography>
          <pre>{errorData && JSON.stringify(errorData, undefined, 2)}</pre>
        </ErrorContainer>
      </Dialog>
      <StyledBreadcrumbs aria-label="breadcrumb">
        <Link href="/exams">
          <a>Exams</a>
        </Link>
        <Typography color="textPrimary">New exam</Typography>
      </StyledBreadcrumbs>
      <Typography component="h1" variant="h3">
        New exam
      </Typography>
      <br />
      <form>
        <Row>
          <TextField
            label="Exam name"
            fullWidth
            id="exam-name"
            variant="outlined"
            type="text"
            required
            value={name}
            onChange={e => {
              setName(e.target.value)
            }}
          />
        </Row>
        <Row>
          <KeyboardDateTimePicker
            ampm={false}
            label="Start date and time"
            inputVariant="outlined"
            fullWidth
            value={startDatetime}
            onChange={date => {
              setStartDatetime(date.toJSDate())
            }}
            format="yyyy-MM-dd HH:mm"
            required
          />
        </Row>
        <Row>
          <KeyboardDateTimePicker
            ampm={false}
            label="End date and time"
            inputVariant="outlined"
            fullWidth
            value={endDatetime}
            onChange={date => {
              setEndDatetime(date.toJSDate())
            }}
            format="yyyy-MM-dd HH:mm"
            required
          />
        </Row>
        {exerciseArray.map((text, exerciseNumber) => {
          return (
            <ExerciseCard key={exerciseNumber}>
              <ExerciseCardTitleContainer>
                <Typography component="h2" variant="h5">
                  Exercise {exerciseNumber + 1}
                </Typography>
                <DeleteButton
                  onClick={e => {
                    const newArray = [...exerciseArray]
                    newArray.splice(exerciseNumber, 1)
                    setExerciseArray(newArray)
                  }}
                  variant="outlined"
                >
                  Remove
                </DeleteButton>
              </ExerciseCardTitleContainer>
              <StyledAppBar position="static">
                <Tabs
                  indicatorColor="primary"
                  value={activeTab}
                  onChange={(_, value) => {
                    setActiveTab(value)
                  }}
                >
                  <Tab label="Source" />
                  <Tab label="Preview" />
                </Tabs>
              </StyledAppBar>
              {activeTab === 0 && (
                <TextField
                  label={`Content`}
                  fullWidth
                  id={`exercise-${exerciseNumber + 1}`}
                  variant="outlined"
                  type="text"
                  value={text}
                  onChange={e => {
                    const newArray = [...exerciseArray]
                    newArray[exerciseNumber] = e.target.value
                    setExerciseArray(newArray)
                  }}
                  rows={20}
                  rowsMax={1000}
                  multiline
                  required
                />
              )}
              {activeTab === 1 && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: writer.render(
                      reader.parse(exerciseArray[exerciseNumber]),
                    ),
                  }}
                />
              )}
            </ExerciseCard>
          )
        })}
        <ActionButton
          color="primary"
          fullWidth
          variant="outlined"
          onClick={() => {
            setExerciseArray(exerciseArray.concat(""))
          }}
        >
          Add exercise
        </ActionButton>

        <br />

        <ActionButton
          color="primary"
          fullWidth
          type="submit"
          variant="contained"
          disabled={submitting}
          onClick={async e => {
            e.preventDefault()
            setSubmitting(true)
            try {
              const { id } = await createExam({
                name: name,
                starts_at: startDatetime,
                ends_at: endDatetime,
                exercises: exerciseArray.map(o => {
                  return {
                    content: o,
                  } as Exercise
                }),
              })
              router.push(`/exams/${id}`)
            } catch (e) {
              setError(e.message)
              setErrorData(e?.response?.data)
              setSubmitting(false)
            }
          }}
        >
          Save
        </ActionButton>
      </form>
      <br />
    </>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
})
