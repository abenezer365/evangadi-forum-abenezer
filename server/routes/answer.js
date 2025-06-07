import express from 'express'
import {postAnswer,getAnswer} from '../controller/answer.js'
const router = express.Router()

router.post('/postanswer', postAnswer)
router.get('/getanswer',getAnswer)

export default router;