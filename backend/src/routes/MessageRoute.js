import express from "express";
import { protectRoute } from "../middlewar/auth.js";
import {
  getMessages,
  getUserForSidebar,
  sendMessage,
} from "../Controller/MessageCotroller.js";

const MessageRoutes = express.Router();

MessageRoutes.get("/users", protectRoute, getUserForSidebar); // Changed to /users for consistency
MessageRoutes.get("/:id", protectRoute, getMessages);
MessageRoutes.post("/send/:id", protectRoute, sendMessage);

export default MessageRoutes;
