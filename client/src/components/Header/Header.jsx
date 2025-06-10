import React, { useContext } from 'react'
import css from './Header.module.css'
import evangadi_logo from '../../assets/evangadi-logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../Context'
import { FaUserCircle } from 'react-icons/fa'
import { Type } from '../../../utils/action.type'
function Header() {
 const [{user}, dispatch]= useContext(Context)
 const navigate = useNavigate()
   async function signout() {
     try {
         await dispatch({
             type : Type.SET_USER,
             user : null
         })
         localStorage.removeItem('token')        
         localStorage.removeItem('username')        
         localStorage.removeItem('user_id')
         navigate('/auth')        
     } catch (error) {
         console.log(error)
     }
   }
  return (
    <header>
      <div className={css.left}>
        <Link to="/">
           <img src={evangadi_logo} alt="Evangadi Logo" />
         </Link>
      </div>
      <div className={css.right}>
        <Link to="/">
           <p>Home</p>
        </Link>
        <Link to={'/how'}><p>How it works?</p></Link>
        {
          window.innerWidth <= 600 ? (
            <Link to={'/how'}><button>How it works?</button></Link>
          ) : user ? (
            <button onClick={signout}>Sign Out</button>
          ) : (
            <Link to={'/auth'}><button>Sign in</button></Link>
          )
        }
        <div className={css.user}>
          <Link to={'/profile'}>
          <FaUserCircle size={32} />
          <p className={`${css.icon} ${user ? css.green : css.red}`}>{" "}</p>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
