import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChtStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      console.log("Fetched users:", res.data); // Log users fetched
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error); // Log error fetching users
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      console.log("Fetching messages for userId:", userId); // Log userId
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log("Messages fetched:", res.data); // Log the response data

      set({ messages: res.data }); // Store the messages in state
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      ); // Log detailed error
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      console.log("Message sent:", res.data); // Log the sent message
      set({ messages: [...messages, res.data] }); // Add new message to state
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      ); // Log error while sending message
      toast.error(error.response?.data?.message);
    }
  },

  setSelectedUser: (selectedUser) => {
    console.log("Setting selected user:", selectedUser); // Log the selected user
    set({ selectedUser });
  },
}));
