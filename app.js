const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("./models/user");
const Postmodel = require("./models/post");

const PORT = process.env.PORT || 3000;

// MongoDB Connection
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Only start server after MongoDB is connected
    startServer();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server function
const startServer = () => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Server accessible at: http://localhost:${PORT}`);
  });
};

// Connect to MongoDB
connectDB();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running", 
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/profile", isloggedIn, async (req, res) => {
  try {
    // Fetch the user and populate the 'post' field
    const user = await UserModel.findOne({
      username: req.user.username,
    }).populate({
      path: "post",
      populate: { path: "user", select: "username" }, // Populate the 'user' field in each post
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Pass the user and posts to the template
    res.render("profile", { title: "Profile", user, posts: user.post });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists (by email or username)
    const existingUser = await UserModel.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).send("User already exists");
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new UserModel({
      username,
      email,
      password: hash,
    });

    await newUser.save();
    console.log("User registered successfully!");

    // Generate token and set cookie
    let token = jwt.sign({ email, username }, "Arikalp");
    res.cookie("token", token);
    res.redirect("/profile");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Error during registration");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send("Invalid username or password");
  }

  console.log("Login successful!");
  let token = jwt.sign(
    { username: user.username, email: user.email },
    "Arikalp"
  );
  res.cookie("token", token, { httpOnly: true });
  console.log("User logged in successfully!");
  res.redirect("/profile");
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  console.log("User logged out successfully!");
  res.redirect("/");
});

app.post("/create-post", isloggedIn, async (req, res) => {
  try {
    const { content } = req.body;

    // Create a new post with the logged-in user's ID
    const newPost = new Postmodel({
      content,
      user: req.user._id, // Use the user's ID from req.user
      createdAt: new Date(),
    });

    await newPost.save();

    // Update the user's posts array
    await UserModel.findOneAndUpdate(
      { username: req.user.username },
      { $push: { post: newPost._id } }
    );

    res.redirect("/profile");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
});

app.get("/delete-post/:id", isloggedIn, async (req, res) => {
  try {
    let postId = req.params.id;
    let post = await Postmodel.findOneAndDelete({ _id: postId });
    if (!post) {
      return res.status(404).send("Post not found");
    } else {
      console.log("Post deleted successfully!");
      res.redirect("/profile");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
});

app.get("/like/:id", isloggedIn , async (req,res) => {
  try{
    let postId=req.params.id;
    let post=await Postmodel.findOne({_id:postId});

    if(!post){
      return res.status(404).send("Post not found");
    }
    let userId=req.user._id;
    
    if(post.likes.includes(userId)){
      post.likes.pull(userId);
      console.log("Post unliked successfully!");
    }
    else{
      post.likes.push(userId);
      console.log("Post liked successfully!");  
    }
    await post.save();
    res.redirect("/profile");
  }
  catch(error){
    console.error("Error liking/unliking post:", error);
    res.status(500).send("Error liking/unliking post");
  }
  
  })

function isloggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const data = jwt.verify(token, "Arikalp");
    req.user = data;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    res.clearCookie("token");
    return res.redirect("/login");
  }
}



