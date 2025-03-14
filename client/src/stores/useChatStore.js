import { create } from "zustand";
import api from "../services/api";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const res = await api.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "something went wrong while fetching user"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await api.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "something went wrong while getting message"
      );
    } finally {
      set({ isMessageLoading: false });
    }
  },
  setMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await api.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "something went wrong while sending message"
      );
    }
  },
  subscribeToMessage: async () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = await useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSenderFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSenderFromSelectedUser) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeFromMessage: async () => {
    const socket = await useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
