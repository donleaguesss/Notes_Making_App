import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = generateToken(user._id);
    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Logout a user
router.post("/logout", (req, res) => {
  // Since JWTs are stateless, logout can be handled on the client side by deleting the token.
  res.json({ message: "Logout successful" });
});

//Me
router.get("/me", async (req, res) => {
  res.status(200).json(req.user);
});

//Generate JWT

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default router;
