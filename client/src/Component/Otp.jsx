import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import the CSS file for styling

export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send OTP and new password to server for verification and password reset
      const response = await axios.post("http://localhost:5000/reset-password", { otp, newPassword });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error resetting password:", error.response.data.error);
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title"><span>Reset Password</span></div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="row button">
            <button type="submit" className="button">Reset Password</button>
          </div>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
}
