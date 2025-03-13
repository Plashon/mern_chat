import { create } from "zustand";
import api from "../services/api";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isRegistering: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in check auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  register: async (data) => {
    set({ isRegistering: true });
    try {
      const res = await api.post("/auth/register", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!!");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    } finally {
      set({ isRegistering: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully!!");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully!!");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await api.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully!!");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
