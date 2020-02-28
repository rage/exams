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
import { createExam, Exercise } from "../services/api"
import Link from "next/link"
import ExerciseEditor from "./ExerciseEditor"

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

const ExamEditor = () => {
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
            <ExerciseEditor
              key={exerciseNumber}
              exerciseNumber={exerciseNumber}
              text={exerciseArray[exerciseNumber]}
              onDelete={() => {
                const newArray = [...exerciseArray]
                newArray.splice(exerciseNumber, 1)
                setExerciseArray(newArray)
              }}
              onChange={e => {
                const newArray = [...exerciseArray]
                newArray[exerciseNumber] = e.target.value
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

export default ExamEditor
