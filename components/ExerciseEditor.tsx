import React, { useState } from "react"
import {
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Card,
  Paper,
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

export interface ExerciseEditorProps {
  exerciseNumber: number
  onDelete: () => any
  onChange: (e: any) => any
  text: string
}

const ExerciseEditor = ({
  exerciseNumber,
  onDelete,
  onChange,
  text,
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
      <MarkdownEditor text={text} onChange={onChange} />
    </ExerciseCard>
  )
}

export default ExerciseEditor
