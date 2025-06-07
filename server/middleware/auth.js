import jwt from 'jsonwebtoken'
import {StatusCodes} from 'http-status-codes'
import dotenv from 'dotenv';
dotenv.config()
async function auth(req,res,next) {
    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer')){
          return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized credentials." })
        }
    const token = header.split(' ')[1]
        try {
            const data = jwt.verify(token, process.env.SECRET)
            // return res.status(StatusCodes.OK).json({ message: "Succesfully Authenticated", data : data })
            req.user = {data}
            next()
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized credentials." })
        
    }

}

export default auth;