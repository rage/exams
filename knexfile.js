require("ts-node/register")

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "exams",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "exams",
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
}
