import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChtStore = create((set, get) => ({
  messages: [], // Fixed typo: was "message"
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users.");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      console.log("Fetching messages for userId:", userId);
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log("Fetched messages:", res.data);
      set({ messages: res.data });
    } catch (error) {
      console.error(
        "Error fetching messages:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get(); // Use messages instead of message
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      ); // Fixed the syntax
      set({ messages: [...messages, res.data] }); // Fixed messages instead of message
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }), // Fixed function
}));
