import jwt from 'jsonwebtoken'
import {StatusCodes} from 'http-status-codes'
import dotenv from 'dotenv';
dotenv.config()

//Authorization Middle waire(JWT)
async function auth(req,res,next) {
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer')){
          return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized credentials." })
    }
    const token = header.split(' ')[1]
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET)
            req.user = {
                username : data.username,
                user_id : data.user_id
            }
            next()
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized credentials." })
    }

}

export default auth;