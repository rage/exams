import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.createTable("answers", t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"))
    t.text("content").notNullable()
    t.uuid("exam_id")
      .notNullable()
      .references("id")
      .inTable("exams")
    t.uuid("exercise_id")
      .notNullable()
      .references("id")
      .inTable("exercises")
    t.integer("user_id").notNullable()
    t.timestamps(true, true)
  })
}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTableIfExists("answers")
  await knex.schema.dropTableIfExists("exams")
}
