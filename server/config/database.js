import mysql from 'mysql2'
import dotenv from 'dotenv'
import {users,questions,answers} from '../models/schema.js'

dotenv.config()

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

const db = connection.promise()

async function createTables() {
  try {
      await db.query(users)
      await db.query(questions)
      await db.query(answers)
  } catch (err) {
    console.error('❌ Error creating tables:', err.message);
    process.exit(1);
  }
}
createTables();

export default db;