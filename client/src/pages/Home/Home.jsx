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
  const [likedStatus, setLikedStatus] = useState({});
  const [{ user }] = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch all questions
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/question/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const questionData = res.data.questions;
        setQuestions(questionData);

        // Initialize liked status from backend response
        const initialLikedStatus = {};
        questionData.forEach(q => {
          initialLikedStatus[q.question_id] = !!q.liked_by_user;
        });
        setLikedStatus(initialLikedStatus);

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

  // Toggle Like/Unlike
  const handleLike = async (e, questionId) => {
    e.preventDefault();
    try {
      if (!likedStatus[questionId]) {
        await axios.post(`/question/${questionId}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.delete(`/question/${questionId}/unlike`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Update UI
      setQuestions(prev =>
        prev.map(q =>
          q.question_id === questionId
            ? {
                ...q,
                likes_count: q.likes_count + (likedStatus[questionId] ? -1 : 1),
              }
            : q
        )
      );
      setLikedStatus(prev => ({
        ...prev,
        [questionId]: !prev[questionId],
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  // Add view on click
  const handleView = async questionId => {
    try {
      await axios.post(`/question/${questionId}/view`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Error updating view:', err);
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
                        onClick={e => handleLike(e, item.question_id)}
                        className={
                          likedStatus[item.question_id] ? css.liked : css.disliked
                        }
                      />
                      <span>{item.likes_count || 0}</span>
                      <BiEditAlt />
                    </div>
                    <p>Views: {item.views || 0}</p>
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
