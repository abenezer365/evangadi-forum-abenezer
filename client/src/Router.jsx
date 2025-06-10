import React, { useEffect, useContext, useState } from "react"
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Auth from './pages/Auth/Auth'
import {Routes, Route, useNavigate} from 'react-router-dom'
import How from "./pages/How/How"
import Ask from './pages/Ask/Ask'
import axios from '../utils/axios'
import Profile from "./pages/Profile/Profile"
import { Context } from "./components/Context"
import { Type } from "../utils/action.type"
import ProtectedRoute from "./ProtectedRoute"
import SingleQuestion from "./pages/SingleQuestion/SingleQuestion"
import { ClockLoader	 } from "react-spinners";
function Router() {
  
  const [loading, setLoading] = useState(true);
  const [{ user }, dispatch] = useContext(Context);
  const navigate = useNavigate()
  useEffect(()=>{
     (async () => {
    await checkUser();
    setLoading(false);
     })()
  },[])

async function checkUser() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const user_id = localStorage.getItem("user_id");
  if (!token || !username || !user_id) {
    dispatch({ type: Type.SET_USER, user: null });
    navigate("/auth");
    return;
  }
  try {
    const res = await axios.get("/user/check", {
      headers: { Authorization: `Bearer ${token}` },
    })
    dispatch({
      type: Type.SET_USER,
      user: res?.data?.user || null,
    })
  } catch (error) {
    console.error(error?.response?.data || error.message);
    dispatch({ type: Type.SET_USER, user: null });
    navigate("/auth");
    setLoading(false)
  }
}


    if (loading) return <div className='loadercontainer'><ClockLoader	 size={40} className="loader"/></div>;
  return (
    <>
      <Header />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
          <Route path="/auth" element={<Auth />}/>  
          <Route path="/how" element={<How />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/ask" element={<ProtectedRoute><Ask /></ProtectedRoute>} />
          <Route path="/question/:qid" element={<ProtectedRoute><SingleQuestion /></ProtectedRoute>}/>
        </Routes>
      <Footer />
       
      
    </>
  )
}

export default Router
