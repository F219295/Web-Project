const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 5000;
const app = express();
const MONGB_UR = "mongodb://localhost:27017/ytLogin";

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(MONGB_UR, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("Mongodb connection error", err);
});
db.once("open", () => {
  console.log("Mongodb is connected");
});

// Define user schema and model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password, // Storing password as plain text (not recommended)
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error during registration ", error);
    res.status(500).json({ error: "internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches (not recommended for production)
    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
