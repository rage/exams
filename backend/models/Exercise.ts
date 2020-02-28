import { Model } from "objection"
import path from "path"

export default class Exercise extends Model {
  static get tableName() {
    return "exercises"
  }

  static get relationMappings() {
    const Exam = require("./Exam").default
    return {
      exams: {
        relation: Model.BelongsToOneRelation,
        modelClass: Exam,
        join: {
          from: "exams.id",
          to: "exercises.exam_id",
        },
      },
    }
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["content"],
      properties: {
        content: { type: "string", minLength: 1 },
      },
    }
  }
}
