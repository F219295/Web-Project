const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();
const PORT = 5000;
const MONGODB_URI = "mongodb://localhost:27017/login";

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("Mongodb connection error", err);
});
db.once("open", () => {
  console.log("Mongodb is connected");
});

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// Schema for Post
const postSchema = new mongoose.Schema({
  caption: String,
  image: { data: Buffer, contentType: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Post = mongoose.model("Post", postSchema);

// Handle POST requests to /post endpoint
app.post("/post", async (req, res) => {
  try {
    // Extract data from the request body
    const { caption, userId } = req.body;

    // Check if caption and userId are present
    if (!caption || !userId) {
      return res.status(400).json({ error: "Caption and userId are required" });
    }

    // Create a new post document
    const newPost = new Post({
      caption,
      user: userId
    });

    // Save the new post document to the database
    await newPost.save();

    // Send a success response
    res.status(201).json({ message: "Post stored successfully", post: newPost });
  } catch (error) {
    console.error("Error storing post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Define user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true }, // Adding unique constraint for username field
  name: String,
  email: { type: String, unique: true }, // Adding unique constraint for email field
  password: String,
  otp: String // Adding OTP field to user schema
});
const User = mongoose.model("User", userSchema);

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'f219295@cfd.nu.edu.pk',
    pass: 'ahmed.9292',
  }
});


// Register endpoint
app.post("/register", async (req, res) => {
  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username: req.body.username });
    if (existingUsername) {
      return res.status(400).json({ error: "* Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ error: "* Email already exists" });
    }

    // If neither username nor email exists, proceed with registration
    const newUser = new User({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error during registration ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || password !== user.password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Password reset - Send OTP endpoint
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Generate a random OTP (One-Time Password)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the OTP to the user's database record
    await User.findOneAndUpdate({ email }, { $set: { otp } });

    // Configure the email content
    const mailOptions = {
      from: 'f219295@cfd.nu.edu.pk',
      to: email,
      subject: 'Connectify Password Reset',
      text: `Your OTP for password reset is: ${otp}`,
    };

    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to send OTP" });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: "OTP sent successfully", otp });
      }
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Password reset - Reset Password endpoint
app.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Password reset - Verify OTP endpoint
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email and verify OTP
    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check if email exists endpoint
app.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;

    // Check if email exists in the database
    const user = await User.findOne({ email });

    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
