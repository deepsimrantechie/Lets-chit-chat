import React, { useEffect } from "react";
import { useChtStore } from "../store/UseChatstore";
import MessageInput from "./MessageInput";
import ChatHeader from "./chatHeader";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChtStore(); // Fixed variable names

  console.log(getMessages); // Check if this logs a function

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    ); // Fixed variable name

  return (
    <div className="flex-1 flex-col flex overflow-auto">
      <ChatHeader />
      <p>message ....</p>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
