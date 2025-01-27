import express from "express";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/utils.js";
import usermodel from "../models/usermodel.js";
import cloudinary from "../config/Cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // Ensure all fields are provided
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure password length is valid
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be greater than 6 characters" });
    }

    // Check if email is already in use
    const user = await usermodel.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new usermodel({
      fullName,
      email,
      password: hashedPassword,
      profilePic: "", // Default profilePic if not provided
    });

    // Save new user and generate token
    await newUser.save();
    generateToken(newUser._id, res); // Generate token after saving the user

    // Respond with user data (excluding password)
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token and respond with user details
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", { httpOnly: true, secure: true, maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id; // Safely access userId from req.user

    // Validate user ID
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Validate profilePic
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Upload profilePic to Cloudinary
    let uploadResponse;
    try {
      uploadResponse = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pics",
        resource_type: "image",
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error.message);
      return res
        .status(500)
        .json({ message: "Failed to upload profile picture" });
    }

    // Validate Cloudinary upload response
    if (!uploadResponse || !uploadResponse.secure_url) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    // Update user's profilePic in the database
    const updatedUser = await usermodel
      .findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      )
      .select("-password"); // Exclude password from the response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error is checkAuth controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
