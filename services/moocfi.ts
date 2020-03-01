import TmcClient from "tmc-client-js"
import axios from "axios"

const tmcClient = new TmcClient(
  "59a09eef080463f90f8c2f29fbf63014167d13580e1de3562e57b9e6e4515182",
  "2ddf92a15a31f87c1aabb712b7cfd1b88f3465465ec475811ccce6febb1bad28",
)

interface SignInProps {
  email: string
  password: string
  setAccessToken: (token: string | undefined) => void
}

export const signIn = async ({
  email,
  password,
  setAccessToken,
}: SignInProps) => {
  const res = await tmcClient.authenticate({ username: email, password })
  const details = await userDetails(res.accessToken)

  document.cookie = `access_token=${res.accessToken};path=/`

  document.cookie = `admin=${details.administrator};path=/`

  setAccessToken(res.accessToken)

  return res
}

interface SignOutProps {
  setAccessToken: (token: string | undefined) => void
}

export const signOut = async ({ setAccessToken }: SignOutProps) => {
  document.cookie =
    "access_token" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
  document.cookie = "admin" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
  // Give browser a moment to react to the change
  setAccessToken(undefined)
}

export async function userDetails(accessToken: string) {
  const res = await axios.get(
    `https://tmc.mooc.fi/api/v8/users/current?show_user_fields=true`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return res.data
}
