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
import { Parser, HtmlRenderer } from "commonmark"

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

const PreviewDiv = styled.div`
  min-height: 400px;
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
  const [activeTab, setActiveTab] = useState(0)
  const reader = new Parser()
  const writer = new HtmlRenderer()
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
          onChange={onChange}
          rows={20}
          rowsMax={1000}
          multiline
          required
        />
      )}
      {activeTab === 1 && (
        <PreviewDiv
          dangerouslySetInnerHTML={{
            __html: writer.render(reader.parse(text)),
          }}
        />
      )}
    </ExerciseCard>
  )
}

export default ExerciseEditor
