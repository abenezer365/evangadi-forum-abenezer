import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js'
import answerRoutes from './routes/answer.js'
import db from './config/database.js'
import dotenv from 'dotenv';
import auth from './middleware/auth.js'
dotenv.config()

const PORT = process.env.PORT || 5000;
const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get('/', (req, res) => {
  res.status(200).json({ message: 'success' });
});

app.use('/api/user/', userRoutes)
app.use('/api/answer/',auth ,answerRoutes)


async function start() {
  try {
    await db.query('SELECT 1')
    console.log('✅ Database connected successfully')

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`)
    });
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err)
    process.exit(1)
  }
}
start()