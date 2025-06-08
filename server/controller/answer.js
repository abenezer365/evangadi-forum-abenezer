import {StatusCodes} from 'http-status-codes'
import connection from '../config/database.js'
export async function postAnswer(req,res){
    const answer = req.body.answer
    const questionid = req.body.questionid
    const userid = req.user.data.uid
    if(!answer || !questionid || !userid){
          return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please fill in all required fields." });
        }
        if(answer.length < 10 || !isNaN(answer)){
       return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Very short or Invalid input'});
        
    }
    const inputAnswerQuery = 'INSERT INTO answers (question_id , user_id, answer) VALUES (?,?,?) '
    try {
        await connection.query(inputAnswerQuery,[questionid,userid,answer])
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
                        u.username
                    FROM answers a
                    JOIN users u ON a.user_id = u.user_id
                    WHERE a.question_id = ?
                    ORDER BY a.time DESC
                    `;

        
        try {
            const [answers] = await connection.query(selectAnswer,[qid])
            console.log(answers)
            return res.status(StatusCodes.OK).json({ message: "Succusfully qeuried answers", Answer: answers });
        
    } catch (error) {
        
    }
    res.status(StatusCodes.OK).json({ message: 'Get answer'});
} 


// To check answer functionality
// INSERT INTO questions (user_id, title, question, description) VALUES (1, 'Test Title', 'Test Question?', 'Test Description');
