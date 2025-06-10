//Contributed Modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {StatusCodes} from 'http-status-codes'
//Routes
import userRoutes from './routes/user.js'
import answerRoutes from './routes/answer.js'
import questionRoutes from './routes/qeustion.js'
//Database Promise
import db from './config/database.js'
//Auth Miidleware
import auth from './middleware/auth.js'


dotenv.config()

const PORT = process.env.PORT || 5000;
const app = express();

//System Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Server checking route
app.get('/', (req, res) => {
  res.status(StatusCodes.OK).json({ message: '🚀 Server is up!' });
});

//Route Middleware
app.use('/api/user/', userRoutes)
app.use('/api/answer/',auth,answerRoutes)
app.use('/api/question/',auth,questionRoutes)



async function start() {
  try {
    await db.execute('SELECT 1')
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