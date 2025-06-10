import React, { useEffect, useRef, useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useParams } from 'react-router-dom'
import axios  from '../../../utils/axios'
import css from './SingleQuestion.module.css'
import { formatDistanceToNow, parseISO } from 'date-fns'

function SingleQuestion() {
const [showAnswerBox, setShowAnswerBox] = useState(false)
const answerRef = useRef(null)
  const toggleAnswerBox = () => {
    setShowAnswerBox(prev => !prev)
  }
  const token = localStorage.getItem('token')
  const {qid} = useParams()
    const [question, setQuestion] = useState({})
    const [answer , setAnswer] = useState([])
    useEffect(() => {
  const sendView = async () => {
    try {
      await axios.post(`/question/${qid}/view`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error sending view', err);
    }
  };

  sendView();
}, [qid]);

    useEffect(()=>{
        (async()=>{
            try {
                const res = await axios.get(`/question/${qid}`,{
                 headers: { Authorization: `Bearer ${token}`}
                })
                setQuestion(res.data.question)
                const answerResponse = await axios.get(`/answer/${qid}`,{
                 headers: { Authorization: `Bearer ${token}`}
                })
                setAnswer(answerResponse.data.answer)
            } catch (error) {
                console.log(error)
            }
        })()
    }, [qid,postAnswer])
    
   async function postAnswer(e) {
       e.preventDefault()
        try {
            await axios.post(`/answer/${qid}`, {
                answer : answerRef.current.value}, {
                headers: { Authorization: `Bearer ${token}`}
              })
            answerRef.current.value = ''
        } catch (error) {
            console.log(error)
        }
    }
  return (
   <>
   <div className={css.single}>

    <div className={css.wrapper}>
      <div className={css.questionHeader}>
        <h2 className={css.questionTitle}>{question?.title}</h2>
        <p className={css.questionMeta}>Asked by: {question?.username}</p>
        <p className={css.questionMeta}>Tag: {question?.tag}</p>
        <p className={css.questionDescription}>{question?.description}</p>
      </div>
      <div className={css.answers}>
        <h3>Recent Answers</h3>
        {
          answer?.length <= 0 || answer == [{}] && <p>No reply yet! 😪</p>
        }
        {answer?.map(item => {
                const fname = item.first_name; 
                const lname = item.last_name;
                const initials = `${fname?.[0] ?? ''}${lname?.[0] ?? ''}`.toUpperCase();
                const timeAgo = formatDistanceToNow(parseISO(item.time), { addSuffix: true })
                return (
                  <div key={item.question_id} >
                   <div className={css.singleAnswer}>
                    <div className={css.answeredBy}>
                      <div className={css.avator}>{initials}</div>
                      <p>{fname}</p>
                    </div>
                    <p className={css.desc}>{item.answer}</p>
                    <p className={css.time}>{timeAgo}</p>
                   </div>
                    <hr />
                </div>
                  );
              })
            }      
      </div>
      <div className={css.answerSection}>
        <div className={css.answerToggle} onClick={toggleAnswerBox}>
          Answer This Question
          {showAnswerBox ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {showAnswerBox && (
          <form onSubmit={postAnswer}>

            <div className={css.answerBox}>
            <textarea
            ref={answerRef}
            className={css.answerInput}
            placeholder="Write your answer here..."
            />
            <button type='submit' className={css.answerBtn} >
              Post Your Answer
            </button>
          </div>
            </form>
        )}
      </div>
    </div>
        </div>
   </>
  )
}

export default SingleQuestion


