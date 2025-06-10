import { StatusCodes } from 'http-status-codes';
import connection from '../config/database.js';

export async function postQuestion(req, res) {
  const { username, user_id } = req.user;
  const { title, description, tag } = req.body;

  if (!title || !description) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Please fill in all required fields.'
    });
  }

  if (title.length < 10 || description.length < 15) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "The Input can't be processed. Please make sure you insert valid amount!"
    });
  }

  try {
    const [userResult] = await connection.execute('SELECT * FROM users WHERE user_id = ?', [user_id]);
    if (userResult.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }

    const user = userResult[0];
    const insertQuery = 'INSERT INTO questions (user_id, title, description, tag) VALUES (?, ?, ?, ?)';
    await connection.execute(insertQuery, [user_id, title, description, tag]);

    res.status(StatusCodes.CREATED).json({
      message: 'Successfully Posted 👌',
      title,
      question: description,
      created_by: {
        user_id: user.user_id,
        username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: '❌ Error Posting your question!',
      error: `Error inserting into Database: ${error.message}`
    });
  }
}

export async function getAllQuestion(req, res) {
  const userId = req.user?.user_id || null;

  const query = `
    SELECT 
      q.question_id,
      q.title,
      q.description,
      q.tag,
      q.time,
      q.views,
      u.user_id,
      u.username,
      u.first_name,
      u.last_name,
      (SELECT COUNT(*) FROM likes WHERE question_id = q.question_id) AS likes_count,
      ${
        userId
          ? `(SELECT COUNT(*) FROM likes WHERE question_id = q.question_id AND user_id = ?) AS liked_by_user`
          : `0 AS liked_by_user`
      }
    FROM questions q
    JOIN users u ON q.user_id = u.user_id
    ORDER BY q.time DESC
  `;

  try {
    const [rows] = userId
      ? await connection.execute(query, [userId])
      : await connection.query(query);

    res.status(200).json({ questions: rows });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch questions',
      error: error.message
    });
  }
}

export async function getSingleQuestion(req, res) {
  const { qid } = req.params;
  const query = `
    SELECT q.*, u.username, u.first_name, u.last_name
    FROM questions q
    JOIN users u ON q.user_id = u.user_id
    WHERE q.question_id = ?
  `;

  try {
    const [result] = await connection.execute(query, [qid]);
    if (result.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Question not found' });
    }
    res.status(StatusCodes.OK).json({ question: result[0] });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Internal (Database error) occurred',
      error: error.message
    });
  }
}

export async function likeQuestion(req, res) {
  const { user_id } = req.user;
  const { qid } = req.params;

  try {
    const query = 'INSERT IGNORE INTO likes (user_id, question_id) VALUES (?, ?)';
    await connection.execute(query, [user_id, qid]);
    res.status(200).json({ message: 'Liked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Like failed', error: err.message });
  }
}

export async function deleteLike(req, res) {
  const { user_id } = req.user;
  const { qid } = req.params;

  try {
    const query = 'DELETE FROM likes WHERE user_id = ? AND question_id = ?';
    await connection.execute(query, [user_id, qid]);
    res.status(200).json({ message: 'Unliked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Unlike failed', error: err.message });
  }
}

export async function viewCount(req, res) {
  const {user_id} = req.user;
  const {qid} = req.params;

  if (!user_id || !qid) {
    return res.status(400).json({ message: 'Missing user ID or question ID' });
  }

  try {
    // 1. Check if view already exists
    const [existing] = await connection.execute(
      'SELECT 1 FROM question_views WHERE user_id = ? AND question_id = ?',
      [user_id, qid]
    );

    // 2. Only insert if it doesn't exist
    if (existing.length === 0) {
      await connection.execute(
        'INSERT INTO question_views (user_id, question_id) VALUES (?, ?)',
        [user_id, qid]
      );

      await connection.execute(
        'UPDATE questions SET views = views + 1 WHERE question_id = ?',
        [qid]
      );
    }

    res.status(200).json({ message: 'View recorded (or already existed)' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update view', error: err.message });
  }
}

