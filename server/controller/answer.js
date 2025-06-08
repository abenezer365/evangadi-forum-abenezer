import {StatusCodes} from 'http-status-codes'
import connection from '../config/database.js'



export async function postAnswer(req,res){
    const answer = req.body.answer
    const {qid} = req.params
    console.log(qid)
    const user_id = req.user.user_id
    if(!answer || !qid || !user_id){
          return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please fill in all required fields." });
    }
    if(answer.length < 10 || !isNaN(answer)){
       return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Very short or Invalid input'});  
    }
    const inputAnswerQuery = 'INSERT INTO answers (question_id , user_id, answer) VALUES (?,?,?) '
    try {
        await connection.execute(inputAnswerQuery,[qid,user_id,answer])
        res.status(StatusCodes.CREATED).json({ message: 'Succusfully Created the reply(Answer)'});
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Unable to insert to database: Internal Server Error", error : error.message });
    }
} 
export async function getAnswer(req,res){
     const { qid } = req.params;
     if(!qid){
          return res.status(StatusCodes.NOT_FOUND).json({ message: "Can't find answer for these questions" });
        }
        const selectAnswer = `
                    SELECT 
                        a.answer_id, 
                        a.question_id,
                        a.user_id,
                        a.answer,
                        a.time,
                        u.username,
                        u.first_name,
                        u.last_name
                    FROM answers a
                    JOIN users u ON a.user_id = u.user_id
                    WHERE a.question_id = ?
                    ORDER BY a.time DESC
                    `;
        try {
            const [answers] = await connection.query(selectAnswer,[qid])
            if(answers.length === 0){
                return res.status(StatusCodes.OK).json({ message: "Nothing is here, LOL 😂"});
            }
            return res.status(StatusCodes.OK).json({ message: "Succusfully qeuried answers", answer: answers });
        
    } catch (error) {
        res.status(StatusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Unable to retrieve answers for this question. Sorry 😒'});
    }
} 