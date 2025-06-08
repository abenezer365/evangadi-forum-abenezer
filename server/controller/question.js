import {StatusCodes} from 'http-status-codes'
import connection from '../config/database.js'

export async function postQuestion(req,res){
  const {username, user_id} = req.user
  const queryUser = 'SELECT * FROM users where user_id = ?'
  const {title ,description, tag} = req.body

 if(!title || !description ){
         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please fill in all required fields." });
    }

   if(title.length < 10 || description.length < 15){
         return res.status(StatusCodes.BAD_REQUEST).json({ message: "The Input can't be processed. Please make sure you insert valid amount!" });
    }

  try {
   const [rows] = await connection.execute(queryUser,[user_id])
        if (rows.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        const user = rows[0];
       const insertQuestionQuery = `INSERT INTO questions (user_id, title, description, tag) VALUES (?, ?, ?, ?)`;
        await connection.execute(insertQuestionQuery,[user.user_id,title,description,tag])

        res.status(StatusCodes.CREATED).json({
            message: 'Successfully Posted 👌',
            title : title, 
            question : description,
            created_by: {
                user_id: user.user_id,
                username: username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        })

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "❌ Error Posting your question!",
            error: `Error inserting into Database: ${error.message}`
        });
    }
}
export async function getAllQuestion(req,res){
  const selectAllQuestionQuery = `
        SELECT 
          q.question_id,
          q.title,
          q.description,
          q.tag,
          q.time,
          u.user_id,
          u.username,
          u.first_name,
          u.last_name
        FROM questions q
        JOIN users u ON q.user_id = u.user_id
        ORDER BY q.time DESC
      `;
  try {    
    const [result] = await connection.execute(selectAllQuestionQuery)
    res.status(StatusCodes.OK).json({questions : result})
  } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Unable to query questions',
                error: `Internal server error (database error)${error.message}`,
        })
      }
  
}
export async function getSingleQuestion(req,res){
     const { qid } = req.params;
      const slectSingleQuery = 'SELECT  q.*,  u.username,  u.first_name,  u.last_name FROM questions q JOIN users u ON q.user_id = u.user_id WHERE q.question_id = ? '
      try {
        const [results] = await connection.execute(slectSingleQuery, [qid])
         if (results.length === 0) {
             return res.status(StatusCodes.NOT_FOUND).json({
                 message: 'Question not found',
         })}
           res.status(StatusCodes.OK).json({question: results[0]})
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Internal (Database error) occured',
                error: error.message,
            });
      }
} 