import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post("http://localhost:5000/login", credentials);
      console.log("Response:", response); // Log the response to check its structure
      if (response.status === 200) {
        const { user } = response.data;
        if (onLogin) {
          onLogin(user);
        }
        sessionStorage.setItem("userId", user._id); // Store userId in session storage
        setSuccessMessage("Login successful");
        console.log("Stored userId:", sessionStorage.getItem("userId")); // Log stored userId
        window.location.href = '/Home'; 
      }
       else {
        setErrorMessage("Failed to login");
      }
    } catch (error) {
      console.error("Error during login:", error); // Log the entire error object
      setErrorMessage("* Wrong Email or Password");
    }
  };
  
  return (
    <div className="container">
      <div className="wrapper">
        <div className="title"><span className="font">Login</span></div>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <i> <FontAwesomeIcon icon={faEnvelope} /></i>
            <input
              type="text"
              placeholder="Email or Phone"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <i> <FontAwesomeIcon icon={faLock} /></i>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error-message" style={{ color: "red", fontWeight: "bold", marginTop: "5px" }}>{errorMessage}</div>
          <div className="success-message" style={{ color: "green", fontWeight: "bold", marginTop: "5px" }}>{successMessage}</div>
          <div className="pass"><Link to='/reset'> Forgot password?</Link></div>
        
          <div className="row button">
         <input type="submit" value="Login" />
          </div>
         
          <div className="signup-link">Not a member? <Link to='/Signup'>Signup now</Link></div>
        </form>
      </div>
    </div>
  );
}

export default Login;
