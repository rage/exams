import React, { useState, useEffect, useRef } from "react"
import {
  FormControl,
  FormHelperText,
  Link,
  Button,
  Typography,
  TextField,
} from "@material-ui/core"

import { useContext } from "react"
import styled from "styled-components"
import { signIn } from "../services/moocfi"
import LoginStateContext from "../contexes/LoginStateContext"
import useTranslator from "../hooks/useTranslator"

const StyledForm = styled.form`
  padding: 1em;
`

function SignIn() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState(false)
  const { setAccessToken, setAdmin } = useContext(LoginStateContext)
  const t = useTranslator()

  const emailFieldRef = useRef<HTMLInputElement>(null)
  const passwordFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const inputFieldSetter = () => {
      if (password == "" && passwordFieldRef?.current?.value) {
        setPassword(passwordFieldRef.current.value)
      }
      if (email == "" && emailFieldRef?.current?.value) {
        setEmail(emailFieldRef.current.value)
      }
    }
    const timeouts = [
      setTimeout(inputFieldSetter, 10),
      setTimeout(inputFieldSetter, 1000),
      setTimeout(inputFieldSetter, 5000),
    ]

    return () => timeouts.forEach((t) => clearTimeout(t))
  }, [])

  return (
    <>
      <Typography variant="h4" component="h1">
        {t("log-in-with-moocfi-account")}
      </Typography>
      <br />
      <Typography>
        {t("use-same-account-that-you-used-in-the-course")}
      </Typography>
      <br />
      <StyledForm>
        <FormControl required fullWidth error={error}>
          <TextField
            label={t("email-or-username")}
            variant="outlined"
            id="email"
            name="email"
            inputRef={emailFieldRef}
            autoComplete="nope"
            onChange={(o) => {
              setEmail(o.target.value)
              setError(false)
            }}
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth error={error}>
          <TextField
            label={t("password")}
            variant="outlined"
            name="password"
            type="password"
            id="password"
            inputRef={passwordFieldRef}
            autoComplete="nope"
            onChange={(o) => {
              setPassword(o.target.value)
              setError(false)
            }}
          />
          <FormHelperText error={error}>
            {error && t("logging-in-was-not-successful")}
          </FormHelperText>
        </FormControl>

        <Button
          type="submit"
          data-testid="login-button"
          variant="contained"
          color="secondary"
          fullWidth
          disabled={email.trim() === "" || password.trim() === ""}
          onClick={async (e) => {
            e.preventDefault()
            try {
              await signIn({ email, password, setAccessToken, setAdmin })
            } catch {
              setError(true)
            }
          }}
        >
          {t("log-in")}
        </Button>
        <br />
        <br />
        <Link
          href="https://tmc.mooc.fi/password_reset_keys/new"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("i-forgot-my-password")}
        </Link>
      </StyledForm>
    </>
  )
}

export default SignIn
