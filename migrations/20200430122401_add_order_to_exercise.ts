import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.alterTable("exercises", (t) => {
    t.integer("order").notNullable().defaultTo(0)
  })
}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.alterTable("exercises", (t) => {
    t.dropColumn("order")
  })
}
