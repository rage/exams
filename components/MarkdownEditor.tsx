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

const StyledAppBar = styled(Paper)`
  margin-bottom: 1rem;

  .MuiTabs-indicator {
    background-color: #8398f9;
    height: 0.25rem;
  }
`

const PreviewDiv = styled.div`
  min-height: 400px;
`

export interface ExerciseEditorProps {
  onChange: (e: any) => any
  text: string
}

const MarkdownEditor = ({ text, onChange }: ExerciseEditorProps) => {
  const [activeTab, setActiveTab] = useState(0)
  const reader = new Parser()
  const writer = new HtmlRenderer()
  return (
    <>
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
    </>
  )
}

export default MarkdownEditor
