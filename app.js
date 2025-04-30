const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("./models/user");
const Postmodel = require("./models/post");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/profile", isloggedIn, async (req, res) => {
  try {
    // Fetch the user and populate the 'post' field
    const user = await UserModel.findOne({ username: req.user.username }).populate({
      path: 'post',
      populate: { path: 'user', select: 'username' } // Populate the 'user' field in each post
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



app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  if (UserModel.findOne({ email })) {
    console.log("User already exists");
  }

  bycrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).send("Error hashing password");
    }

    const newUser = await new UserModel({
      username,
      email,
      password: hash,
    });

    console.log(newUser);
    await newUser.save();
  });

  let token = jwt.sign({ email, password }, "Arikalp");
  res.cookie("token", token);
  res.send("User registered successfully!");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).send("Invalid username or password");
  }

  const isPasswordValid = await bycrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send("Invalid username or password");
  }

  console.log("Login successful!");
  let token = jwt.sign({ username: user.username, email: user.email }, "Arikalp");
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
      createdAt: new Date()
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
