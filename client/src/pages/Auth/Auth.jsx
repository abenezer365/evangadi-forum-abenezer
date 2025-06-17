import React, { useContext, useRef, useState } from 'react';
import css from './Auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../utils/axios'
import {Context} from '../../components/Context'
import { Type } from '../../../utils/action.type';
import audio from '../../assets/audio.opus'

function Auth() {
  const navigate = useNavigate()

  const [error , setError] = useState(null)
  const [{user}, dispatch] = useContext(Context)
  //Sign Up
  const emailRef =useRef(null)
  const passwordRef = useRef(null)
  const first_nameRef= useRef(null)
  const last_nameRef = useRef(null)
  const usernameRef = useRef(null)
  //Login
  const emailLoginRef = useRef(null)
  const passwordLoginRef = useRef(null)
  const [showPassword, setShowPassword] = useState(false);
  const[islogin,setIsLogin] = useState(true)
  //Sign Up Function
async function signup(e) {
  e.preventDefault()
  try {
    setError(null)
    const result = await axios.post('/user/signup', {
      email : emailRef.current.value,
      password : passwordRef.current.value,
      fname : first_nameRef.current.value,
      lname : last_nameRef.current.value,
      username : usernameRef.current.value
    })
    setIsLogin(true)
    } catch (error) {
    setError(error?.response?.data?.error)
    console.log(error)
  }
}
//Log in Function
async function login(e) {
  e.preventDefault()
  try {
    setError(null)
    const result = await axios.post('/user/login', {
      email : emailLoginRef.current.value,
      password : passwordLoginRef.current.value })

    const token = result?.data?.token
    const username = result?.data?.user.username
    const user_id = result.data.user.user_id
    localStorage.setItem("token", token)
    localStorage.setItem("username", username )
    localStorage.setItem("user_id", user_id )

    const response = await axios.get('/user/check', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const userInfo = response?.data?.user
        dispatch({
          type : Type.SET_USER,
          user : userInfo
        })
        navigate('/')
  } catch (error) {
    console.log(error)
    //  setError(error.response.data.message)
  }
}
function handleShowPassword() {
    setShowPassword((prev)=> !prev)
    if(!showPassword){
      const sound = new Audio(audio);
      sound.currentTime = 0.5;
      sound.play();
    }
  }
 function toggler(e){
  e.preventDefault()
  setIsLogin((prev) => !prev)
 }
  return (
    <div className={css.login}>
      {
        islogin ?  <div className={css.formCard}>
        <h3>Login to your account</h3>
        <p className={css.registerText}>
          Don’t have an account? <a href="#" onClick={toggler}>Create a new account</a>
        </p>
        <form onSubmit={login}>
          <input ref={emailLoginRef} type="email" placeholder="Your Email" required/>
          <input className={css.password} ref={passwordLoginRef}  type={showPassword ? 'text' : 'password'} placeholder="Your Password" required/>
          <p className={css.eye} onClick={handleShowPassword}>{showPassword ? `👀` : '👁️‍🗨️'}</p>
          {
              error && <p className={css.error}>{error}!!!</p>
           }
          <button type="submit">Submit</button>
        </form>
        <Link className={css.createAccount} href="#" onClick={toggler}>Create an account?</Link>
       
      </div> : 
       <div className={css.formCard}>        
        <h3>Create account</h3>
        <p className={css.registerText}>
          Already have an account? <Link href="#" onClick={toggler}>Sign in </Link>
        </p>
        <form onSubmit={signup}>
          <input ref={emailRef} type="email" placeholder="Your Email" />
          <div className={css.nameContainer}>
            <input ref={first_nameRef} type="name" placeholder="First Name" />
            <input ref={last_nameRef} type="name" placeholder="Last Name" />
          </div>
            <input ref={usernameRef} type="text" placeholder="Username" />
          <input ref={passwordRef} type="password" placeholder="Your Password" />
          {
              error && <p className={css.error}>{error}!!!</p>
           }
          <button type="submit">Submit</button>

        </form>
         
      </div>
      }
     

      <div className={css.sideinfo}>
        <p className={css.aboutTag}>About</p>
        <h1>Evangadi Networks Q&A</h1>
        <p>
          No matter what stage of life you are in, whether you’re just starting elementary school or being promoted to CEO of a Fortune 500 company, you have much to offer to those who are trying to follow in your footsteps.
        </p>
        <p>
         Whether you are willing to share your knowledge or you are just looking to meet mentors of your own, please start by joining the network here.
        </p>
        <Link to="/how">
            <button className={css.howBtn}>HOW IT WORKS</button>
        </Link>
      </div>
    </div>
  );
}

export default Auth;
