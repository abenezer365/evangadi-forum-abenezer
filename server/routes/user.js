import express from 'express'
import {login,signup,check} from '../controller/user.js'
import auth from '../middleware/auth.js'
const router = express.Router()

router.post('/login', login)
router.post('/signup',signup)
router.get('/check', auth ,check)

export default router;