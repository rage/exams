import { Model } from "objection"

export default class Answer extends Model {
  exercise_id: string

  static get tableName() {
    return "answers"
  }

  static get relationMappings() {
    const Exam = require("./Exam").default
    const Exercise = require("./Exercise").default
    return {
      exam: {
        relation: Model.BelongsToOneRelation,
        modelClass: Exam,
        join: {
          from: "exams.id",
          to: "answers.exam_id",
        },
      },
      exercise: {
        relation: Model.BelongsToOneRelation,
        modelClass: Exercise,
        join: {
          from: "exercise.id",
          to: "amswers.exercise_id",
        },
      },
    }
  }
}
