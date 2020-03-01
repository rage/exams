import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.createTable("exam_starts", t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"))
    t.uuid("exam_id")
      .notNullable()
      .references("id")
      .inTable("exams")
    t.integer("user_id").notNullable()
    t.unique(["user_id", "exam_id"])
    t.timestamps(true, true)
  })
}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTableIfExists("exam_starts")
}
