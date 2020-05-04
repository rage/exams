import { Model } from "objection"

export default class ExamWhitelistedUser extends Model {
  exam_id: string

  static get tableName() {
    return "exam_whitelisted_users"
  }

  static get relationMappings() {
    const Exam = require("./Exam").default
    return {
      exams: {
        relation: Model.BelongsToOneRelation,
        modelClass: Exam,
        join: {
          from: "exams.id",
          to: "exam_whitelisted_users.exam_id",
        },
      },
    }
  }
}
