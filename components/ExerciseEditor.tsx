import React, { useState } from "react"
import {
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Card,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core"
import styled from "styled-components"
import MarkdownEditor from "./MarkdownEditor"

const ExerciseCard = styled(Card)`
  padding: 1rem;
  margin-bottom: 1rem;
`

const DeleteButton = styled(Button)`
  float: right;
  margin-bottom: 5px;
`

const ExerciseCardTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
`

const StyledFormControl = styled(FormControl)`
  margin-bottom: 1rem;
  width: 100%;
`

export interface ExerciseEditorProps {
  exerciseNumber: number
  onDelete: () => any
  onChange: (e: any) => any
  text: string
  type: string
}

const ExerciseEditor = ({
  exerciseNumber,
  onDelete,
  onChange,
  text,
  type,
}: ExerciseEditorProps) => {
  return (
    <ExerciseCard>
      <ExerciseCardTitleContainer>
        <Typography component="h2" variant="h5">
          Exercise {exerciseNumber + 1}
        </Typography>
        <DeleteButton onClick={onDelete} variant="outlined">
          Remove
        </DeleteButton>
      </ExerciseCardTitleContainer>
      <StyledFormControl>
        <InputLabel id={`exercise-type-dropdown-${exerciseNumber + 1}`}>
          Exercise type
        </InputLabel>
        <Select
          value={type}
          labelId={`exercise-type-dropdown-${exerciseNumber + 1}`}
          onChange={(e) => {
            onChange({ type: e.target.value, content: text })
          }}
        >
          <MenuItem value="only_assignment">Only assignment</MenuItem>
          <MenuItem value="essay">Essay</MenuItem>
        </Select>
      </StyledFormControl>
      <MarkdownEditor
        text={text}
        onChange={(e) => {
          onChange({ content: e.target.value, type })
        }}
      />
    </ExerciseCard>
  )
}

export default ExerciseEditor
