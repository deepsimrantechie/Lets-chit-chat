import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isSigningUp: false, // Added a loading state for signup
  error: null, // Added an error state

  checkAuth: async () => {
    set({ isCheckingAuth: true }); // Ensure we show loading state
    try {
      const response = await axiosInstance.post("/api/auth/signup", data);
      set({ authUser: response.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true, error: null }); // Set loading state and reset error
    try {
      const response = await axiosInstance.post("/auth/signup", data);
      toast.success("Account is created successfully");
      set({ authUser: response.data }); // Assuming successful signup gives user data
    } catch (error) {
      set({ error: error.response?.data?.message || "Signup failed!" });
      toast.error(error.response.data.message); // Set error message
    } finally {
      set({ isSigningUp: false }); // Reset loading state after signup attempt
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in succesfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Logout failed!";
      toast.error(errorMessage);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
