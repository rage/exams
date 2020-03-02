import cookies from "next-cookies"

export default ctx => {
  return cookies(ctx).access_token
}
