import { Model } from "objection"

export default class Exam extends Model {
  id: string
  has_user_whitelist: boolean

  static get tableName() {
    return "exams"
  }

  static get relationMappings() {
    const Exercise = require("./Exercise").default
    const ExamStart = require("./ExamStart").default

    return {
      exercises: {
        relation: Model.HasManyRelation,
        modelClass: Exercise,
        join: {
          from: "exams.id",
          to: "exercises.exam_id",
        },
      },
      exam_starts: {
        relation: Model.HasManyRelation,
        modelClass: ExamStart,
        join: {
          from: "exams.id",
          to: "exam_starts.exam_id",
        },
      },
    }
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", minLength: 1, maxLength: 1000 },
      },
    }
  }
}
