import { NextApiRequest, NextApiResponse } from "next"
const { Model } = require("objection")
import { userDetails } from "../../../../../services/moocfi"
import ExamStart from "../../../../../backend/models/ExamStart"

const Knex = require("knex")
const knexConfig = require("../../../../../knexfile")
const knex = Knex(knexConfig.development)
// Bind all Models to the knex instance. You only
// need to do this once before you use any of
// your model classes.
Model.knex(knex)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let admin = false
  const authorization = req.headers.authorization
    .toLowerCase()
    .replace("bearer ", "")

  const details = await userDetails(authorization)

  admin = details.administrator

  try {
    if (req.method === "POST") {
      return handlePost(req, res, details)
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userDetails: any,
) => {
  const existingStarts = await ExamStart.query()
    .where({
      user_id: userDetails.id,
      exam_id: req.query.id.toString(),
    })
    .limit(1)
  if (existingStarts.length > 0) {
    return res.status(403).json({ error: "You have already started this exam" })
  }
  await ExamStart.query()
    .allowGraph("[user_id, exam_id]")
    .insertGraph({
      // @ts-ignore
      user_id: userDetails.id,
      exam_id: req.query.id.toString(),
    })
}
