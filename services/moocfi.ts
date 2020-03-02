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
  setAdmin: (admin: boolean) => void
}

export const signIn = async ({
  email,
  password,
  setAccessToken,
  setAdmin,
}: SignInProps) => {
  const res = await tmcClient.authenticate({ username: email, password })
  const details = await userDetails(res.accessToken)

  const now = new Date()
  const time = now.getTime()
  const expireTime = time + 1000 * 36000 * 60
  now.setTime(expireTime)

  document.cookie = `access_token=${
    res.accessToken
  };expires=${now.toUTCString()};path=/`

  document.cookie = `admin=${
    details.administrator
  };expires=${now.toUTCString()};path=/`

  setAccessToken(res.accessToken)
  setAdmin(details.administrator)

  return res
}

interface SignOutProps {
  setAccessToken: (token: string | undefined) => void
  setAdmin: (admin: boolean) => void
}

export const signOut = async ({ setAccessToken, setAdmin }: SignOutProps) => {
  document.cookie =
    "access_token" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
  document.cookie = "admin" + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/"
  // Give browser a moment to react to the change
  setAccessToken(undefined)
  setAdmin(false)
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
