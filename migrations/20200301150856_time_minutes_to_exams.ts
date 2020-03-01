import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.alterTable("exams", t => {
    t.integer("time_minutes")
      .notNullable()
      .defaultTo(120)
  })
}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.alterTable("exams", t => {
    t.dropColumn("time_minutes")
  })
}
