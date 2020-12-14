require("ts-node/register")

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "exams",
      timezone: "UTC",
    },
    pool: {
      afterCreate: setTimeZoneToUTC,
      min: 2,
      max: 10,
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: process.env.POSTGRES_DATABASE,
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      timezone: "UTC",
    },
    pool: {
      afterCreate: setTimeZoneToUTC,
      min: 2,
      max: 10,
    },
  },
}

function setTimeZoneToUTC(connection, callback) {
  connection.query("SET TIMEZONE = UTC;", function (err) {
    callback(err, connection)
  })
}
