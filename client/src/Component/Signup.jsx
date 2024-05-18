import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import the Signup.css file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faImage } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

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

  const [successMessage, setSuccessMessage] = useState(""); // Add successMessage state

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

      if (register && register.data) {
        const user = register.data; // Ensure user is correctly extracted from register.data
        console.log(user);
        setValue({
          username: "",
          name: "",
          email: "",
          password: "",
          profilePicture: null, // Reset profilePicture after successful registration
        });
        sessionStorage.setItem("userId", user._id); // Store userId in session storage
        setSuccessMessage("Registration successful"); // Set success message
        console.log("Stored userId:", sessionStorage.getItem("userId")); // Log stored userId
        window.location.href = '/Home';
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error during registration:", error.response ? error.response.data.error : error.message);
      if (error.response && error.response.data.error) {
        if (error.response.data.error.includes("username")) {
          setErrors({ ...errors, usernameError: "* Username already exists" });
        } else if (error.response.data.error.includes("email")) {
          setErrors({ ...errors, emailError: "* Email already exists" });
        } else {
          setErrors({ ...errors, errorMessage: error.response.data.error });
        }
      } else {
        setErrors({ ...errors, errorMessage: "Internal server error" });
      }
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title"><span className="font">Sign Up</span></div>
        <form onSubmit={handleSubmit}>
        
          <div className="error" style={{ color: "red" }}>{errors.usernameError}</div>
          <div className="row">
            <i><FontAwesomeIcon icon={faUser} /></i>
            <input
              type="text"
              placeholder="FullName"
              name="name"
              value={value.name}
              onChange={handleChange}
              required
            />
          </div>
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
              style={{
                paddingTop:'10px',
                backgroundColor: '#16a085',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            />
          </div>

          <div className="row button">
            <input type="submit" value="Sign Up" />
          </div>
          <div className="error" style={{ color: "red" }}>{errors.errorMessage}</div>
          <div className="success" style={{ color: "green" }}>{successMessage}</div>
          <div className="row signup-link">
            Already have an account? <Link to='/Login'>Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
