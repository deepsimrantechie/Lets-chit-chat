import React, { useEffect } from "react";
import { useChtStore } from "../store/UseChatstore";

import MessageInput from "./MessageInput";

const ChatContainer = () => {
  const { message, getMessage, isMessageLoading, selectedUser } = useChtStore();

  useEffect(() => {
    getMessage(selectedUser._id);
  }, [selectedUser._id, getMessage]);

  if (isMessageLoading) return <div>Loading ....</div>;

  return (
    <div className="flex-1 flex-col flex overflow-auto">
      <p>message ....</p>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
