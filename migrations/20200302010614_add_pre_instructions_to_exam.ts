import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.alterTable("exams", t => {
    t.text("pre_instructions")
      .notNullable()
      .defaultTo("")
  })
}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.alterTable("exams", t => {
    t.dropColumn("pre_instructions")
  })
}
