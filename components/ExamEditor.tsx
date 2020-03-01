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
import { createExam, Exercise, updateExam } from "../services/api"
import Link from "next/link"
import ExerciseEditor from "./ExerciseEditor"
import MarkdownEditor from "./MarkdownEditor"

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

const PreviewDiv = styled.div`
  min-height: 400px;
`

interface ExamEditorProps {
  initialValues: InitialValues
}

interface InitialValues {
  name: string
  startsAt: Date
  endsAt: Date
  exercises: string[]
}

const defaultProps: ExamEditorProps = {
  initialValues: {
    name: "",
    startsAt: new Date(),
    endsAt: new Date(),
    exercises: [],
  },
}

const ExamEditor = ({
  initialName = "",
  initialStartsAt = new Date(),
  initialEndsAt = new Date(),
  initialExercises = [],
  intialTimeMinutes = 120,
  initialPreInstructions = "",
  isEdit = false,
  id = "",
}) => {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [preExamInstructions, setPreExamInstructions] = useState(
    initialPreInstructions,
  )
  const [timeMinutes, setTimeMinutes] = useState(intialTimeMinutes)
  const [startsAt, setStartsAt] = useState(initialStartsAt)
  const [endsAt, setEndsAt] = useState(initialEndsAt)
  const [exerciseArray, setExerciseArray] = useState(initialExercises)
  const [error, setError] = useState(null)
  const [errorData, setErrorData] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const isValid = name !== ""

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
            label="Starts at"
            inputVariant="outlined"
            fullWidth
            value={startsAt}
            onChange={date => {
              setStartsAt(date.toJSDate())
            }}
            format="yyyy-MM-dd HH:mm"
            required
          />
        </Row>
        <Row>
          <KeyboardDateTimePicker
            ampm={false}
            label="Ends at"
            inputVariant="outlined"
            fullWidth
            value={endsAt}
            onChange={date => {
              setEndsAt(date.toJSDate())
            }}
            format="yyyy-MM-dd HH:mm"
            required
          />
        </Row>
        <Row>
          <TextField
            label="Time to do the exam in minutes"
            fullWidth
            id="time-minutes"
            variant="outlined"
            type="number"
            required
            value={timeMinutes}
            onChange={e => {
              setTimeMinutes(parseInt(e.target.value, 10))
            }}
          />
        </Row>

        <ExerciseCard>
          <ExerciseCardTitleContainer>
            <Typography component="h2" variant="h5">
              Instructions to show before starting the exam
            </Typography>
          </ExerciseCardTitleContainer>
          <MarkdownEditor
            text={preExamInstructions}
            onChange={e => {
              setPreExamInstructions(e.target.value)
            }}
          ></MarkdownEditor>
        </ExerciseCard>

        {exerciseArray.map((entry, exerciseNumber) => {
          return (
            <ExerciseEditor
              key={exerciseNumber}
              exerciseNumber={exerciseNumber}
              text={entry.content}
              onDelete={() => {
                const newArray = [...exerciseArray]
                newArray.splice(exerciseNumber, 1)
                setExerciseArray(newArray)
              }}
              onChange={e => {
                const newArray = [...exerciseArray]
                newArray[exerciseNumber].content = e.target.value
                setExerciseArray(newArray)
              }}
            />
          )
        })}
        <ActionButton
          color="primary"
          fullWidth
          variant="outlined"
          onClick={() => {
            setExerciseArray(exerciseArray.concat({ content: "" }))
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
          disabled={!isValid || submitting}
          onClick={async e => {
            e.preventDefault()
            setSubmitting(true)
            try {
              let res = null
              if (isEdit) {
                res = await updateExam({
                  id,
                  name: name,
                  starts_at: startsAt.toISOString(),
                  ends_at: endsAt.toISOString(),
                  exercises: exerciseArray,
                  time_minutes: timeMinutes,
                  pre_instructions: preExamInstructions,
                })
              } else {
                res = await createExam({
                  name: name,
                  starts_at: startsAt,
                  ends_at: endsAt,
                  exercises: exerciseArray,
                  time_minutes: timeMinutes,
                  pre_instructions: preExamInstructions,
                })
              }
              router.push(`/manage/exams/${res.id}`)
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

export default ExamEditor
