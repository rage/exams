import { Model } from "objection"

export default class ExamStart extends Model {
  static get tableName() {
    return "exam_starts"
  }

  static get relationMappings() {
    const Exam = require("./Exam").default
    return {
      exams: {
        relation: Model.BelongsToOneRelation,
        modelClass: Exam,
        join: {
          from: "exams.id",
          to: "exam_starts.exam_id",
        },
      },
    }
  }
}
