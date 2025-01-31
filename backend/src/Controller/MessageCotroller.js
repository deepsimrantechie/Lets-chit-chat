import express from "express";
import cloudinary from "../config/Cloudinary.js";
import mongoose from "mongoose"; // Import mongoose
import User from "../models/usermodel.js";
import Message from "../models/messagemodal.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const LoggedInUserId = req.user._id;
    const filteredUser = await User.find({
      _id: { $ne: LoggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.error("Error in getUserForSidebar:", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Fetching messages for userId:", id);

    // Validate the id format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const messages = await Message.find({
      $or: [{ senderId: id }, { receiverId: id }],
    }).populate("senderId receiverId");

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
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
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
      console.log("Image uploaded:", imageUrl); // Debugging log
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
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "internal server error " });
  }
};
