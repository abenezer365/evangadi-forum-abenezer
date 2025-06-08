import {StatusCodes} from 'http-status-codes'
import db from '../config/database.js'
export async function getSingleQuestion(req,res){
     const { qid } = req.params;
      const sql = 'SELECT * FROM questions WHERE question_id = ?';
      try {
        const [results] = await db.query(sql, [qid])
         if (results.length === 0) {
             return res.status(StatusCodes.NOT_FOUND).json({
                 message: 'Question not found',
         })}
           res.status(StatusCodes.OK).json({question: results[0]})
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Database error',
                error: error.message,
            });
      }
} 