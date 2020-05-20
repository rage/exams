import * as Knex from "knex"

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.alterTable("exercises", (t) => {
    t.enu("type", ["only_assignment", "essay"], {
      useNative: true,
      enumName: "exercise_type",
    })
      .notNullable()
      .defaultTo("only_assignment")
    t.integer("min_words")
    t.integer("max_words")
  })
}

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.alterTable("exercises", (t) => {
    t.dropColumn("type")
    t.dropColumn("min_words")
    t.dropColumn("max_words")
  })
  await knex.raw('DROP TYPE "exercise_type";')
}
