import connection from '../config/database.js'
import bcrypt from 'bcrypt'
import {StatusCodes} from 'http-status-codes'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()
// Sign-Up Controller
export async function signup(req,res){
    const {username,password,email,fname,lname} = req.body
    if (!username || !password || !email || !fname || !lname) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please fill in all required fields." });
    }
    if (password.trim().length < 8) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must be at least 8 characters long." });
    }
    const insertQuery = `
    INSERT INTO users (email, username, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)`;
    
    const selectExistingQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
    
    try {
        const [existingUsers] = await connection.execute(selectExistingQuery, [username, email]);
        
        if (existingUsers.length > 0) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Username or email already exists." })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const [result] = await connection.execute(insertQuery, [email, username, hashedPassword, fname, lname])
        res.status(StatusCodes.CREATED).json({ message: "User succesfully registered!" })
    } catch (error) {
        console.error(" Error inserting to DB:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "❌ Server error", error: `Error inserting to DB: ${error.message}` });
    }
} 

// Log-In Controller
export async function login(req,res){
    const {password,email} = req.body
    if(!password || !email){
         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please fill in all required fields." });
        }
        try {
            const [user] = await connection.execute('SELECT * FROM users where email = ?',[email])
            const isMatched = await bcrypt.compare(password,user[0].password)
            if(!isMatched){
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Credentials'});
            }
            const username = user[0].username
            const user_id = user[0].user_id
            const token = jwt.sign({username,user_id},process.env.JWT_SECRET,{expiresIn : '1d'})     
            res.status(StatusCodes.OK).json({ message: 'Successfully Logged in', token : token, user : {username : username, user_id: user_id} });
        } catch (error) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Credentials', error : error.message});
        }
    } 
    
    //User authorization controller
    export async function check(req,res){
        const {username, user_id} = req.user
    const queryUser = 'SELECT * FROM users where user_id = ?'
    try {
        const [rows] = await connection.execute(queryUser,[user_id])
        if (rows.length === 0) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
                const user = rows[0];
        res.status(StatusCodes.OK).json({
            message: 'Authorized user',
            user: {
                user_id: user.user_id,
                username: username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "❌ Server error",
            error: `Error retrieving user info: ${error.message}`
        });
    }
}