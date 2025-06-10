import express from 'express'
import { getSingleQuestion, myQuestions, postQuestion, getAllQuestion, likeQuestion, viewCount, deleteLike } from '../controller/question.js';
const router = express.Router()

router.post('/', postQuestion)
router.get('/', getAllQuestion)
router.get('/myquestions', myQuestions)
router.get('/:qid', getSingleQuestion)

router.post('/:qid/view', viewCount)
router.delete('/:qid/unlike', deleteLike)
router.post('/:qid/like', likeQuestion)

export default router;