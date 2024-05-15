import React from "react";
import Signup from "./Component/Signup";
import "./App.css";
import Login from "./Component/Login";
import Reset from "./Component/Reset";
import Home from "./Component/home";
import Profile from "./Component/Profile";
import New from "./Component/New";
import Hero from "./Component/Hero";

export default function App() {
  return (
    <>
  <Signup></Signup>
      <Login></Login>
      <Reset></Reset>
      <Home></Home>
   
      <Profile></Profile>
    <New></New>
    <Hero></Hero>
    </>
  );
}
