import pgPromise from 'pg-promise'

const connection = {
  host: 'localhost',
  port: 5432,
  database: 'aruna',
  user: 'aruna',
  password: 'aruna'
}

const db = pgPromise()(connection)

export { db }
export { pgPromise }
