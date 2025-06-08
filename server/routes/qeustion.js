import express from 'express'
import { getSingleQuestion, postQuestion, getAllQuestion } from '../controller/question.js';
const router = express.Router()

router.post('/', postQuestion)
router.get('/', getAllQuestion)
router.get('/:qid', getSingleQuestion)

export default router;