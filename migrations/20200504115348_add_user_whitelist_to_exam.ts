import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.createTable("exam_whitelisted_users", t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"))
    t.integer("user_id").notNullable()
    t.uuid("exam_id")
      .notNullable()
      .references("id")
      .inTable("exams")
    t.timestamps(true, true)
  })
  await knex.schema.alterTable("exams", t => {
    t.boolean("has_user_whitelist")
      .notNullable()
      .defaultTo(false)
  })
}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTableIfExists("exam_whitelisted_users")
  await knex.schema.alterTable("exams", t => {
    t.dropColumn("has_user_whitelist")
  })
}
