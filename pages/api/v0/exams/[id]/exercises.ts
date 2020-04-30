import { NextApiRequest, NextApiResponse } from "next"
const { Model } = require("objection")
import { userDetails } from "../../../../../services/moocfi"
import ExamStart from "../../../../../backend/models/ExamStart"
import Exercise from "../../../../../backend/models/Exercise"
import Answer from "../../../../../backend/models/Answer"

const Knex = require("knex")
const knexConfig = require("../../../../../knexfile")
const knex = Knex(process.env.NODE_ENV === "production" ? knexConfig.production : knexConfig.development)
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
    if (req.method === "GET") {
      return handleGet(req, res, details)
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const handleGet = async (
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
  if (existingStarts.length < 1) {
    return res
      .status(403)
      .json({ error: "Please start the exam in order to see the exercises." })
  }
  const exercises = await Exercise.query().where({
    exam_id: req.query.id.toString()
  })

  const answers = await Answer.query().where("user_id", userDetails.id).whereIn("exercise_id", exercises.map(o => o.id)).orderBy("created_at", "DESC")



  res.status(200).json({ exercises: exercises.map(ex => { return {...ex, answers: answers.filter(a => a.exercise_id === ex.id) }}) })
}
