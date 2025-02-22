import express from "express";
import cloudinary from "../config/Cloudinary.js";
import mongoose from "mongoose";
import User from "../models/usermodel.js";
import Message from "../models/messagemodal.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const LoggedInUserId = req.user._id;
    console.log("Logged in user ID:", LoggedInUserId); // Debugging log

    const filteredUser = await User.find({
      _id: { $ne: LoggedInUserId },
    }).select("-password");

    console.log("Filtered users for sidebar:", filteredUser); // Debugging log

    res.status(200).json(filteredUser);
  } catch (error) {
    console.error("Error in getUserForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching messages for userId:", id); // Debugging log

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid user ID format:", id); // Debugging log
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const messages = await Message.find({
      $or: [{ senderId: id }, { receiverId: id }],
    }).populate("senderId receiverId");

    console.log("Messages found:", messages); // Debugging log

    if (!messages || messages.length === 0) {
      console.log("No messages found for user:", id); // Debugging log
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error); // Log the complete error
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log("Sender ID:", senderId); // Debugging log
    console.log("Receiver ID:", receiverId); // Debugging log
    console.log("Message text:", text); // Debugging log
    console.log("Message image:", image); // Debugging log

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
        console.log("Image uploaded:", imageUrl); // Debugging log
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error.message);
        return res.status(500).json({ error: "Error uploading image" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    console.log("New message saved:", newMessage); // Debugging log
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
