import cookies from "next-cookies"

const getAccessToken = (ctx) => {
  return cookies(ctx).access_token
}

export default getAccessToken
