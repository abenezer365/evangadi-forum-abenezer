import express from 'express'
import {postAnswer,getAnswer} from '../controller/answer.js'
const router = express.Router()

router.post('/', postAnswer)
router.get('/:qid',getAnswer)

export default router;