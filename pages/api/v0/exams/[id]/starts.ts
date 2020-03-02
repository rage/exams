import { NextApiRequest, NextApiResponse } from "next"
const { Model } = require("objection")
import { userDetails } from "../../../../../services/moocfi"
import ExamStart from "../../../../../backend/models/ExamStart"
import Exam from "../../../../../backend/models/Exam"
import { DateTime } from "luxon"

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
  const exam = await Exam.query().findById(req.query.id.toString())
  // @ts-ignore
  const startTime = DateTime.fromISO(exam.starts_at)
  const now = DateTime.local()
  // @ts-ignore
  const endTime = DateTime.fromISO(exam.ends_at)

  if (now < startTime || now > endTime) {
    return res.status(403).json({ error: "Exam is not open at the moment." })
  }
  await ExamStart.query()
    .allowGraph("[user_id, exam_id]")
    .insertGraph({
      // @ts-ignore
      user_id: userDetails.id,
      exam_id: req.query.id.toString(),
    })
  res.status(200).json({ message: "You have started the exam." })
}

const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse,
  userDetails: any,
) => {
  try {
    const existingStarts = await ExamStart.query()
      .where({
        user_id: userDetails.id,
        exam_id: req.query.id.toString(),
      })
      .limit(1)
    return res.status(200).json({ exam_starts: existingStarts })
  } catch (e) {
    return res.status(200).json({ exam_starts: [] })
  }
}
