import React, { useState } from "react"
import {
  Typography,
  Container,
  TextField,
  Button,
  AppBar,
  Tab,
  Tabs,
  Card,
  Paper,
} from "@material-ui/core"
import styled from "styled-components"
import dynamic from "next/dynamic"

import { Parser, HtmlRenderer } from "commonmark"

import { KeyboardDateTimePicker } from "@material-ui/pickers"

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

const App = () => {
  const [startDatetime, setStartDatetime] = useState(new Date())
  const [endDatetime, setEndDatetime] = useState(new Date())
  const [exerciseArray, setExerciseArray] = useState(["best exercise"])
  const [activeTab, setActiveTab] = useState(0)

  const reader = new Parser()
  const writer = new HtmlRenderer()

  return (
    <Container maxWidth="sm">
      <br />
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
              setStartDatetime(date)
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
              setEndDatetime(date)
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

        <ActionButton color="primary" fullWidth variant="contained">
          Save
        </ActionButton>
      </form>
      <br />
    </Container>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
})
