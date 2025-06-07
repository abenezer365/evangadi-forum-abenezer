import connection from '../config/database.js'
import bcrypt from 'bcrypt'
import {StatusCodes} from 'http-status-codes'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()
export async function signup(req,res){
    const {username,password,email,fname,lname} = req.body
    if (!username || !password || !email || !fname || !lname) {
         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please fill in all required fields." });
    }
    if (password.length < 8) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password must be at least 8 characters long." });
    }
    const insertQuery = `
    INSERT INTO users (email, username, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)`;
    
    const selectExistingQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
    
    try {
        const [existingUsers] = await connection.query(selectExistingQuery, [username, email]);
        
        if (existingUsers.length > 0) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Username or email already exists." })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
    const [result] = await connection.query(insertQuery, [email, username, hashedPassword, fname, lname]);

          

    } catch (error) {
        console.error(" Error inserting to DB:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "❌ Server error" });
    }
} 

export async function login(req,res){
    const {password,email} = req.body
    if(!password || !email){
         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please fill in all required fields." });
    }
    try {
        const [user] = await connection.query('SELECT * FROM users where email = ?',[email])
        const isMatched = await bcrypt.compare(password,user[0].password)
        if(!isMatched){
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Credentials'});
        }
        const uname = user[0].username
        const uid = user[0].user_id
        const token = jwt.sign({uname,uid},process?.env?.SECRET,{expiresIn : '1d'})     
        res.status(StatusCodes.OK).json({ message: 'Successfully Logged in', token : token });
        
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Credentials', Error : error.message});
        
    }
} 
export async function check(req,res){
    const username = req.user.data.uname
    const userid = req.user.data.uid
    res.status(StatusCodes.OK).json({ message: 'Authorized user', id : userid ,username : username });
} 