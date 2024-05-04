import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import the login.css file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

export default function Signup() {
  const [value, setValue] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const register = await axios.post("http://localhost:5000/register", value);
      console.log(register.data);
      setValue({
        name: "",
        email: "",
        password: "",
      });
      alert("Account created");
    } catch (error) {
      console.error("Error during registration:", error.response.data.error);
      alert("Registration failed. Please check your details and try again.");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title"><span>Sign Up</span></div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <i><FontAwesomeIcon icon={faUser} /></i>
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={value.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <i> <FontAwesomeIcon icon={faEnvelope} /></i>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={value.email}
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
              value={value.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row button">
            <input type="submit" value="Sign Up" />
          </div>
          <div className="row signup-link">
            Already have an account? <a href="#">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
