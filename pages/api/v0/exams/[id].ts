import { NextApiRequest, NextApiResponse } from "next"
import Exam from "../../../../backend/models/Exam"
const { Model } = require("objection")
import { transaction } from "objection"

const Knex = require("knex")
const knexConfig = require("../../../../knexfile")
const knex = Knex(knexConfig.development)
// Bind all Models to the knex instance. You only
// need to do this once before you use any of
// your model classes.
Model.knex(knex)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(404).json({ message: "wat" })
  }

  try {
    const exam = await Exam.query()
      .withGraphJoined("exercises")
      .findById(req.query.id)
    return res.status(200).json({ exam })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
