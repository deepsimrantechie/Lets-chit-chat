import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import NoChatSlected from "../components/NoChatSlected";
import ChatContainer from "../components/ChatContainer";

const Homepage = () => {
  // Define the selectedUser state variable
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen  bg-base-200">
      <div className="flex items-center justify-center p-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {/* Check if selectedUser is available */}
            {!selectedUser ? <NoChatSlected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
