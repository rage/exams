import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  await knex.schema.createTable("exams", t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"))
    t.text("name").notNullable()
    t.dateTime("starts_at").notNullable()
    t.dateTime("ends_at").notNullable()
    t.timestamps(true, true)
  })
  await knex.schema.createTable("exercises", t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"))
    t.text("content").notNullable()
    t.uuid("exam_id")
      .notNullable()
      .references("id")
      .inTable("exams")
    t.timestamps(true, true)
  })
}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTableIfExists("exercises")
  await knex.schema.dropTableIfExists("exams")
}
