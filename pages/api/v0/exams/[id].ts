import { NextApiRequest, NextApiResponse } from "next"
import Exam from "../../../../backend/models/Exam"
const { Model } = require("objection")
import { transaction } from "objection"
import { userDetails } from "../../../../services/moocfi"
import ExamWhitelistedUser from "../../../../backend/models/ExamWhitelistedUser"

const Knex = require("knex")
const knexConfig = require("../../../../knexfile")
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
  const authorization = req.headers.authorization.replace(/bearer /i, "")
  const details = await userDetails(authorization)
  if (!details.id) {
    return res.status(403).json({ error: "Please log in" })
  }
  const admin = details.administrator

  if (req.method === "GET") {
    return handleGet(req, res, details)
  }
  if (req.method === "PATCH") {
    return handlePatch(req, res, admin)
  }

  return res.status(404).json({ message: "wat" })
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  details: any,
) {
  const admin = details.administrator
  const id = req.query.id
  try {
    let query = Exam.query()
    if (admin) {
      query = query
        .withGraphJoined("exercises")
        .orderBy("exercises.order", "ASC")
    }
    const exam = await query.findById(id)
    if (exam.has_user_whitelist && !admin) {
      const whitelistedUsers = await ExamWhitelistedUser.query()
        .where({
          user_id: details.id,
          exam_id: exam.id,
        })
        .limit(1)
      if (whitelistedUsers.length < 1) {
        return res.status(403).json({ error: "You're not on the whitelist." })
      }
    }

    return res.status(200).json({ exam })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

async function handlePatch(
  req: NextApiRequest,
  res: NextApiResponse,
  admin: boolean,
) {
  if (!admin) {
    return res.status(403).json({ error: "Only admins can do that" })
  }
  try {
    const id = req.query.id
    const exam = req.body.exam
    exam.id = id
    const result = await transaction(Exam.knex(), (trx) => {
      return Exam.query(trx)
        .allowGraph(
          "[id, name, starts_at, ends_at, time_minutes, pre_instructions, exercises.[content, id, order]]",
        )
        .upsertGraph(req.body.exam)
    })
    res.status(200).json({ exam: result })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
