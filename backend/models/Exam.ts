import { Model } from "objection"

export default class Exam extends Model {
  static get tableName() {
    return "exams"
  }

  static get relationMappings() {
    const Exercise = require("./Exercise").default

    return {
      exercises: {
        relation: Model.HasManyRelation,
        modelClass: Exercise,
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
      required: ["name"],
      properties: {
        name: { type: "string", minLength: 1, maxLength: 1000 },
      },
    }
  }
}
