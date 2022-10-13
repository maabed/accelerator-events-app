// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()


const config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    extension: 'ts',
    tableName: 'migrations'
  }

};

module.exports = config;
