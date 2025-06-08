import express from 'express'
import { getSingleQuestion } from '../controller/question.js';
const router = express.Router()

router.get('/:qid',getSingleQuestion)
export default router;