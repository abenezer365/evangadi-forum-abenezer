import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../components/Context';
import css from './Home.module.css';
import axios from '../../../utils/axios';
import { AiOutlineLike } from 'react-icons/ai';
import { BiEditAlt } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { ClockLoader } from 'react-spinners';
import { timeAgo } from '../../../utils/formatter';


function Home() {
  const [{ user }] = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/question/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const questionData = res.data.questions;
        setQuestions(questionData);

        setError(null);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message || error.message || 'Something went wrong'
        );
        setLoading(false);
      }
    })();
  }, []);


     // Function to handle LIKE toggle
    const handleLike = async (qid, likedByUser) => {
      try {
        if (likedByUser) {
          // If already liked, unlike
          await axios.delete(`/question/${qid}/unlike`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          // If not liked yet, like it
          await axios.post(`/question/${qid}/like`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }

        // After like/unlike, update UI: fetch questions again (simple)
        const res = await axios.get('/question/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions);
      } catch (error) {
        console.error('Failed to like/unlike:', error);
      }
    };

    // Function to handle VIEW count
    const handleView = async (qid) => {
      try {
        await axios.post(`/question/${qid}/view`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Failed to record view:', error);
      }
    };





  if (loading)
    return (
      <div className='loadercontainer'>
        <ClockLoader size={40} className='loader' />
      </div>
    );

  const { first_name } = user;

  return (
    <div className={css.home}>
      <div className={css.head}>
        <Link to='/ask'>
          <button>Ask Question</button>
        </Link>
        <p>
          Welcome: {first_name} <span>😎</span>
        </p>
      </div>
      <h1>Questions</h1>
      <hr />
      <div className={css.questions}>
        {error && <p>{error}</p>}

        {questions?.map(item => {
          const fname = item.first_name;
          const lname = item.last_name;
          const initials = `${fname?.[0] ?? ''}${lname?.[0] ?? ''}`.toUpperCase();
          return (
            <div key={item.question_id}>
              <Link
                to={`/question/${item.question_id}`}
                onClick={() => handleView(item.question_id)} 
              >
                <div className={css.singleQuestion}>
                  <div className={css.askedby}>
                    <div className={css.avator}>{initials}</div>
                    <p>{fname}</p>
                  </div>
                  <p className={css.title}>{item.title}</p>
                  <div className={css.likeandcompose}>
                    <div>
                      <AiOutlineLike
                      className={item?.liked_by_user === 1 && css.liked}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLike(item.question_id, item.liked_by_user);
                      }}/>
                      <span>{item.likes_count}</span>
                      <BiEditAlt />
                    </div>
                    <p>Views:{item.views}</p>
                    <p>{timeAgo(item.time)}</p>
                  </div>
                </div>
              </Link>
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
