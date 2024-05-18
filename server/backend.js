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
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save the new user
      const newUser = new User({
        username,
        name,
        email,
        password: hashedPassword,
        profilePicture: req.file.filename,
      });
      const savedUser = await newUser.save();
  
      res.status(201).json(savedUser);
    } catch (error) {
      console.error("Error during registration ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  // POST endpoint for user login
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
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }else if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      res.status(200).json({ message: "Login successful", user });
    }
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });