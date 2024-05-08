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
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      // Check if the email is registered
      const response = await axios.get(`http://localhost:5000/check-email?email=${email}`);
      if (response.data.exists) {
        // Send email to server to generate and send OTP
        await axios.post("http://localhost:5000/forgot-password", { email });
        setStep(2);
        setEmailError("");
        setOtpError("");
        setSuccessMessage("OTP sent successfully. Please check your email for the OTP.");
      } else {
        setEmailError("* Email not registered");
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailError("* Internal server error");
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    try {
      // Verify OTP
      await axios.post("http://localhost:5000/verify-otp", { email, otp });
      setStep(3);
      setOtpError("");
      setSuccessMessage("OTP verified successfully");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("* Invalid OTP");
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      // Reset password
      await axios.post("http://localhost:5000/reset-password", { email, newPassword });
      setSuccessMessage("Password reset successful");
      // Redirect user to login page or another appropriate page
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="title">
          <span>
            {step === 1 && "Enter Email"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Reset Password"}
          </span>
        </div>
        
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
            <div className="error" style={{ color: "red", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>{emailError}</div>
            <div className="success" style={{ color: "green", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>{successMessage}</div>
            <div className="row button" style={{ textAlign: "center" }}>
              <button type="submit" style={{ backgroundColor: "#16a085", color: "white", padding: "10px", borderRadius: "5px", border: "none", marginTop: "10px" }}>Submit</button>
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
            <div className="error" style={{ color: "red", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>{otpError}</div>
            <div className="success" style={{ color: "green", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>{successMessage}</div>
            <div className="row button" style={{ textAlign: "center" }}>
              <button type="submit" style={{ backgroundColor: "#16a085", color: "white", padding: "10px", borderRadius: "5px", border: "none", marginTop: "10px" }}>Submit OTP</button>
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
            <div className="success" style={{ color: "green", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}>{successMessage}</div>
            <div className="row button" style={{ textAlign: "center" }}>
              <button type="submit" style={{ backgroundColor: "#16a085", color: "white", padding: "10px", borderRadius: "5px", border: "none", marginTop: "10px" }}>Reset Password</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
