import { NextApiRequest, NextApiResponse } from "next"
const { Model } = require("objection")
import { userDetails } from "../../../../../services/moocfi"
import { DateTime, Duration } from "luxon"
import Exercise from "../../../../../backend/models/Exercise"
import Answer from "../../../../../backend/models/Answer"

const MINUTE_IN_MS = 60000

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

  const exercise = await Exercise.query().withGraphJoined("exams").withGraphJoined("exams.exam_starts").findById(req.query.id.toString())
  // TODO: Check if can answer
  console.log(JSON.stringify(exercise, undefined, 2))

  // @ts-ignore
  const exam = exercise.exams
  const examStarts: any[] = exam.exam_starts

  const ownExamStarts = examStarts.filter(o => o.user_id === userDetails.id)
  if (!ownExamStarts[0]) {
    return res.status(403).json({ error: "Time has ended" })
  }
  // @ts-ignore
  const now = DateTime.local()
  const startTime = DateTime.fromJSDate(ownExamStarts[0].created_at)
  const endTime = startTime.plus(
    Duration.fromMillis(exam.time_minutes * MINUTE_IN_MS),
  )

  if (now < startTime || now > endTime) {
    return res.status(403).json({ error: "Time has ended" })
  }

  await Answer.query()
    .allowGraph("[content, exam_id, exercise_id, user_id]")
    .insertGraph({
      // @ts-ignore
      user_id: userDetails.id,
      // @ts-ignore
      exam_id: exercise.exams.id.toString(),
      // @ts-ignore
      exercise_id: exercise.id,
      content: req.body.content
    })
  res.status(200).json({ message: "You have started the exam." })
}
