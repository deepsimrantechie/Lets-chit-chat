import express from "express";
import Message from "../models/messagemodal.js";
import cloudinary from "../config/Cloudinary.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const LoggedInUserId = req.user._id;
    const filteredUser = await UserActivation.find({
      _id: { $ne: LoggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.error("Error  in getUserForSidebar:", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

import mongoose from "mongoose"; // Import mongoose

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Check if senderId and userToChatId are valid ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(userToChatId)
    ) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Ensure both senderId and receiverId are ObjectIds
    const messages = await Message.find({
      $or: [
        {
          senderId: mongoose.Types.ObjectId(senderId),
          receiverId: mongoose.Types.ObjectId(userToChatId),
        },
        {
          senderId: mongoose.Types.ObjectId(userToChatId),
          receiverId: mongoose.Types.ObjectId(senderId),
        },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //todo:real time functionality goes here socket.io
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(500).json({ error: "internal server error " });
  }
};
