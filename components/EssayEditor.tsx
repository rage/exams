import React, { useState, useContext } from "react"
import { TextField, Button, Typography } from "@material-ui/core"
import useTranslator from "../hooks/useTranslator"
import Alert from "@material-ui/lab/Alert"
import styled from "styled-components"
import { saveAnswer } from "../services/api"
import LoginStateContext from "../contexes/LoginStateContext"

const StyledButton = styled(Button)`
  margin-top: 1rem;
  margin-bottom: 1rem;
`

interface EssayEditorProps {
  exerciseId: string
  previousAnswer: string
}

const EssayEditor = ({ exerciseId, previousAnswer }: EssayEditorProps) => {
  const t = useTranslator()
  const { accessToken } = useContext(LoginStateContext)
  const [text, setText] = useState(previousAnswer || "")
  const [submitting, setSubmitting] = useState(false)
  const [savedText, setSavedText] = useState(text)
  const [error, setError] = useState<string | null>(null)

  const currentSaved = !submitting && !error && text === savedText

  const words = text.trim().split(/\s+/).length
  return (
    <>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        value={text}
        onChange={e => {
          setError(null)
          setText(e.target.value)
        }}
        rows={10}
        rowsMax={100}
        label={t("essay-field-label")}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <StyledButton
        disabled={submitting || text === savedText}
        color="primary"
        variant="contained"
        onClick={async () => {
          setSubmitting(true)
          setError(null)
          try {
            await saveAnswer(exerciseId, text, accessToken)
            setSavedText(text)
          } catch (e) {
            setError(`Error: ${e.toString()}`)
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {currentSaved ? t("saved") : t("save")}
      </StyledButton>
      <Typography>
        {t("words")}: {words}
      </Typography>
    </>
  )
}

export default EssayEditor
