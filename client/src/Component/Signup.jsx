import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import the Signup.css file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faImage } from '@fortawesome/free-solid-svg-icons';

export default function Signup() {
  const [value, setValue] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    profilePicture: null, // Add profilePicture field
  });

  const [errors, setErrors] = useState({
    usernameError: "",
    emailError: "",
    errorMessage: "",
  });

  const handleChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
    // Clear previous errors when user starts typing
    setErrors({
      usernameError: "",
      emailError: "",
      errorMessage: "",
    });
  };

  const handleFileChange = (e) => {
    setValue({
      ...value,
      profilePicture: e.target.files[0], // Set the selected file as profilePicture
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(); // Create FormData object
      formData.append("username", value.username);
      formData.append("name", value.name);
      formData.append("email", value.email);
      formData.append("password", value.password);
      formData.append("profilePicture", value.profilePicture); // Append profilePicture to FormData

      const register = await axios.post("http://localhost:5000/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
        },
      });
      console.log(register.data);
      setValue({
        username: "",
        name: "",
        email: "",
        password: "",
        profilePicture: null, // Reset profilePicture after successful registration
      });
  
    } catch (error) {
      console.error("Error during registration:", error.response.data.error);
      if (error.response.data.error.includes("username")) {
        setErrors({ ...errors, usernameError: "* Username already exists" });
      } else if (error.response.data.error.includes("email")) {
        setErrors({ ...errors, emailError: "* Email already exists" });
      } else {
        setErrors({ ...errors, errorMessage: error.response.data.error });
      }
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
              placeholder="Username"
              name="username"
              value={value.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error" style={{ color: "red" }}>{errors.usernameError}</div>
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
            <i><FontAwesomeIcon icon={faEnvelope} /></i>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={value.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="error" style={{ color: "red" }}>{errors.emailError}</div>
          <div className="row">
            <i><FontAwesomeIcon icon={faLock} /></i>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={value.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <i><FontAwesomeIcon icon={faImage} /></i>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="row button">
            <input type="submit" value="Sign Up" />
          </div>
          <div className="error" style={{ color: "red" }}>{errors.errorMessage}</div>
          <div className="row signup-link">
            Already have an account? <a href="#">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
