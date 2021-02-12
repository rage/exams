import { NextApiRequest, NextApiResponse } from "next"
import Exam from "../../../backend/models/Exam"
const { Model } = require("objection")
import { transaction } from "objection"
import { userDetails } from "../../../services/moocfi"
import ExamWhitelistedUser from "../../../backend/models/ExamWhitelistedUser"

const Knex = require("knex")
const knexConfig = require("../../../knexfile")
const knex = Knex(
  process.env.NODE_ENV === "production"
    ? knexConfig.production
    : knexConfig.development,
)
// Bind all Models to the knex instance. You only
// need to do this once before you use any of
// your model classes.
Model.knex(knex)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const authorization = req.headers.authorization?.replace(/bearer /i, "")
  if (!authorization) {
    return res.status(403).json({ error: "Please log in" })
  }
  const details = await userDetails(authorization)
  if (!details.id) {
    return res.status(403).json({ error: "Please log in" })
  }
  const admin = details.administrator

  try {
    if (req.method === "POST") {
      return handlePost(req, res, admin)
    }

    if (req.method === "GET") {
      return handleGet(req, res, details)
    }
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const handlePost = async (
  req: NextApiRequest,
  res: NextApiResponse,
  admin: boolean,
) => {
  if (!admin) {
    return res.status(403).json({ error: "Only admins can do that" })
  }
  const inserted = await transaction(Exam.knex(), (trx) => {
    return Exam.query(trx)
      .allowGraph(
        "[name, starts_at, ends_at, time_minutes, pre_instructions, exercises.content]",
      )
      .insertGraph(req.body.exam)
  })
  res.status(200).json({ exam: inserted })
}

const handleGet = async (
  req: NextApiRequest,
  res: NextApiResponse,
  details: any,
) => {
  let exams = await Exam.query()

  if (!details.administrator) {
    const whitelists = await ExamWhitelistedUser.query()
      .where("user_id", details.id)
      .whereIn(
        "exam_id",
        exams.map((o) => o.id),
      )
    exams = exams.filter((exam) => {
      if (!exam.has_user_whitelist) {
        return true
      }
      // TODO: group whitelists for more efficicency
      return whitelists.some((o) => o.exam_id === exam.id)
    })
  }
  res.status(200).json({ exams: exams })
}
