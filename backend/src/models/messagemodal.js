import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Consistent ref
      required: true, // Correct boolean
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Consistent ref
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
