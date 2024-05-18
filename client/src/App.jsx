import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from "./Component/Signup";
import "./App.css";
import Login from "./Component/Login";
import Reset from "./Component/Reset";
import Home from "./Component/home";
import Profile from "./Component/Profile";
import New from "./Component/New";
import Hero from "./Component/Hero";
import Update from "./Component/Update";
import Admin from "./Component/Admin";
import AdminUpdate from "./Component/AdminUpdate";
export default function App() {
  return (
    <>
    <Router>
      

       
      <Routes>
     <Route path="/" element={<Hero />}/>
     <Route path="/Signup" element={<Signup />}/>
     <Route path="/Login" element={<Login />}/>
     <Route path="/Home" element={<Home />}/>
     <Route path="/Profile" element={<Profile />}/>
     <Route path="/New" element={<New />}/>
     <Route path="/Reset" element={<Reset />}/>
     <Route path="/Hero" element={<Hero />}/>
     <Route path="/Update" element={<Update />}/>
     <Route path="/Admin" element={<Admin />}/>
     <Route path="/AdminUpdate" element={<AdminUpdate />}/>
     </Routes>
     </Router>

    </>
  );
}
