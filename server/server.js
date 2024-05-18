const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;
const MONGODB_URI = "mongodb://localhost:27017/login";
app.use('/assets', express.static(path.join(__dirname, 'client', 'src', 'assets')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const upload = multer({ dest: 'uploads/' });
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("Mongodb connection error", err);
});
db.once("open", () => {
  console.log("Mongodb is connected");
});

// Schema for Post
const postSchema = new mongoose.Schema({
  caption: String,
  imagePath: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Post = mongoose.model("Post", postSchema);

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePicture: String,
  otp: String , // Add profilePicture field
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
  
});
const User = mongoose.model("User", userSchema);




module.exports = User;
// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'f219295@cfd.nu.edu.pk',
    pass: 'ahmed.9292',
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Directory where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Generate unique file name
  }
});

const uploadImage = multer({ storage: storage });

app.post('/profile', uploadImage.single('image'), async (req, res) => {
  try {
    // Check if user data exists
    if (!req.body.userId) {
      return res.status(400).json({ error: 'User data not found' });
    }

    // Check if image and caption are present
    if (!req.file || !req.body.caption) {
      return res.status(400).json({ error: 'Image or caption is missing' });
    }

    // Save the image path and caption to the database
    const imagePath = req.file.filename; // Use the filename provided by multer
    const newPost = new Post({
      caption: req.body.caption,
      imagePath,
      user: req.body.userId
    });
    await newPost.save();

    return res.status(201).json({ message: 'Post stored successfully' });
  } catch (error) {
    console.error('Error posting:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.get("/posts/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find posts associated with the specified user ID
    const posts = await Post.find({ user: userId });
    posts.forEach(post => {
      console.log(`Image path: server/uploads/${post.imagePath}`);
    });
    // Update image paths to include the base URL
    const updatedPosts = posts.map(post => ({
      ...post.toObject(),
      imagePath: `${path.basename(post.imagePath)}`
    }));

    res.status(200).json(updatedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/users/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract user data
    const userData = {
      username: user.username,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
    };

    // Find users who are not in the current user's friend list
    const users = await User.find({ _id: { $nin: user.friends, $ne: userId } }).select('-password');

    res.json({ user: userData, suggestions: users });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/friends/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user by ID
    const user = await User.findById(userId).populate('friends', 'name profilePicture');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return only friend IDs, names, and profile pictures
    const friendList = user.friends.map(friend => ({
      _id: friend._id,
      name: friend.name,
      profilePicture: friend.profilePicture
    }));

    res.json(friendList);
  } catch (error) {
    console.error('Error fetching friend list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    // Delete the associated image file
    const imagePath = path.join(__dirname, 'uploads', post.imagePath);
    fs.unlinkSync(imagePath);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/posts/:postId', uploadImage.single('image'), async (req, res) => {
  try {
    const postId = req.params.postId;
    const { caption } = req.body;

    console.log('Received postId:', postId);
    console.log('Received caption:', caption);

    if (req.file) {
      console.log('Received image:', req.file.originalname);
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (caption) {
      post.caption = caption;
    }

    if (req.file) {
      // Remove old image file if it exists
      if (post.imagePath) {
        const oldImagePath = path.join(__dirname, 'uploads', post.imagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.imagePath = req.file.filename;
    }

    await post.save();

    res.status(200).json({ message: 'Post updated successfully', updatedPost: post });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/add-friend", async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    console.log("Received userId:", userId);
    console.log("Received friendId:", friendId);

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the friendId exists in the user's friend list
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ error: "User is already a friend" });
    }

    // Add the friendId to the user's friend list
    user.friends.push(friendId);

    console.log("Updated user with new friends:", user);

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Friend added successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select('-password'); // Exclude password field from the response
    res.json(users.map(user => ({ ...user.toObject(), id: user._id }))); // Add id field to each user object
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.post("/register", uploadImage.single('profilePicture'), async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    // Check if username or email already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "* Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "* Email already exists" });
    }

    // Save the new user without hashing the password
    const newUser = new User({
      username,
      name,
      email,
      password, // Password is not hashed
      profilePicture: req.file.filename,
    });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error during registration ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === 'admin@gmail.com' && password === 'admin') {
      // Redirect to the admin panel
      res.redirect('/Admin');
    } else {
      // Find user by email
      const user = await User.findOne({ email });

      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      res.status(200).json({ message: "Login successful", user });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.delete("/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    // Find the user by ID and delete it
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/users/:userId", upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedUserData = req.body; // Parse the user data from the request body
    const profilePicture = req.file.filename; // Get the file name of the uploaded profile picture

    // Update the user data in the database
    // You can use updatedUserData and profilePicture to update the user's data accordingly
    // Example:
    // const updatedUser = await User.findByIdAndUpdate(userId, { ...updatedUserData, profilePicture }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
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
    transporter.sendMail(mailOptions, function (error, info) {
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
app.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset: ", error);
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
