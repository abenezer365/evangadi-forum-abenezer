import express from 'express'
import {postAnswer,getAnswer} from '../controller/answer.js'
const router = express.Router()

router.post('/:qid', postAnswer)
router.get('/:qid',getAnswer)

export default router;