import {create} from "zustand";
import {type Chat, type Message} from "../types";
import axiosInstance from "../lib/axios";

interface ChatStore {
  selectedChat: Chat | null;
  chats: Chat[];
  setSelectedChat: (chat: Chat | null) => void;
  setChats: (chats: Chat[]) => void;
  getChats: () => Promise<Chat[]>;
  notification: Message[];
  setNotification: (notification: Message[]) => void;
}

const useChatStore = create<ChatStore>()((set, get) => ({
  selectedChat: null,
  chats: [],
  setSelectedChat: (chat) => set({selectedChat: chat}),
  setChats: (chats) => set({chats}),
  getChats: async () => {
    try {
      const response = await axiosInstance.get("/chats");
      const chats = response.data.data;
      set({chats});
      return chats;
    } catch (error) {
      console.error("Error fetching chats:", error);
      return get().chats;
    }
  },
  notification: [],
  setNotification: (notification) => set({notification}),
}));

export default useChatStore;
