import React, { useState } from "react";
import axios from "axios";
import "./Login.css"; // Import the login.css file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1 - Enter Email, 2 - Enter OTP, 3 - Reset Password

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      // Send email to server to generate and send OTP
      await axios.post("http://localhost:5000/forgot-password", { email });
      setStep(2);
    } catch (error) {
      console.error("Error sending OTP:", error.response.data.error);
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    try {
      // Verify OTP
      await axios.post("http://localhost:5000/verify-otp", { email, otp });
      setStep(3);
    } catch (error) {
      console.error("Error verifying OTP:", error.response.data.error);
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      // Reset password
      await axios.post("http://localhost:5000/reset-password", { email, newPassword });
      alert("Password reset successful");
      // Redirect user to login page or another appropriate page
    } catch (error) {
      console.error("Error resetting password:", error.response.data.error);
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title"><span>Reset Password</span></div>
        
        {step === 1 && (
          <form onSubmit={handleSubmitEmail}>
            <div className="row">
              <i> <FontAwesomeIcon icon={faEnvelope} /></i>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="row button">
              <button type="submit" className="button">Submit</button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleSubmitOTP}>
            <div className="row">
              <i> <FontAwesomeIcon icon={faLock} /></i>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="row button">
              <button type="submit" className="button">Submit</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleSubmitNewPassword}>
            <div className="row">
              <i> <FontAwesomeIcon icon={faLock} /></i>
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
          </form>
        )}
      </div>
    </div>
  );
}
