import {useEffect, useState, useRef} from "react";
import useChatStore from "@/stores/chatStore";
import axiosInstance from "@/lib/axios";
import {type User, type Message as IMessage} from "@/types";
import useAuthStore from "@/stores/authStore";
import ChatHeader from "./chatHeader";
import ChatInput from "./chatInput";
import ChatDetails from "./chatDetails";
import {io} from "socket.io-client";
import {type Socket} from "socket.io-client";
import Messages from "./messages";

export default function Chatbox() {
  const {user} = useAuthStore();
  const {selectedChat, getChats, notification, setNotification} =
    useChatStore();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Socket connection setup
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL);

    socketRef.current.on("connect", () =>
      console.log("Connected to socket server")
    );
    socketRef.current.emit("setup", user);
    socketRef.current.on("connected", () => console.log("Socket connected"));

    socketRef.current.on("typing", (chatId: string) => {
      if (selectedChat?._id === chatId) setIsTyping(true);
    });

    socketRef.current.on("stop typing", (chatId: string) => {
      if (selectedChat?._id === chatId) setIsTyping(false);
    });

    return () => {
      setIsTyping(false);
      socketRef.current?.disconnect();
      console.log("Socket disconnected");
    };
  }, [user, selectedChat?._id]);

  const getSender = (users: User[], user: User | null) => {
    return users[0]._id === user?._id ? users[1] : users[0];
  };

  // Initial message load when chat changes
  useEffect(() => {
    if (!selectedChat) return;
    const fetchAllMessages = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/messages/${selectedChat._id}`);

        setMessages(res.data.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllMessages();
    socketRef.current?.emit("join chat", selectedChat._id);
  }, [selectedChat]);

  // Handle incoming messages
  useEffect(() => {
    const handleNewMessage = (newMessage: IMessage) => {
      console.log("New message received:", newMessage);

      if (!selectedChat || selectedChat._id !== newMessage.chat._id) {
        if (!notification.includes(newMessage)) {
          setNotification([...notification, newMessage]);
        }
        return;
      }

      setMessages((prev) => [...prev, newMessage]);
    };

    socketRef.current?.on("message received", handleNewMessage);

    return () => {
      socketRef.current?.off("message received");
    };
  }, [selectedChat, notification, setNotification]);

  // Handle typing state change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (!typing) {
      setTyping(true);
      socketRef.current?.emit("typing", selectedChat?._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop typing", selectedChat?._id);
      setTyping(false);
    }, 3000);
  };

  const sendMessage = async () => {
    const res = await axiosInstance.post("/messages", {
      content: messageInput,
      chatId: selectedChat?._id,
    });

    return res.data;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !user || !selectedChat) return;

    if (typing) {
      setTyping(false);
      socketRef.current?.emit("stop typing", selectedChat._id);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }

    const tempMessage: IMessage = {
      _id: Date.now().toString(),
      content: messageInput,
      sender: user,
      chat: selectedChat,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageInput("");

    sendMessage()
      .then(async (data) => {
        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempMessage._id ? data.data : msg))
        );
        await getChats();
        socketRef.current?.emit("new message", data.data);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== tempMessage._id)
        );
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.trim()) {
        handleSendMessage(e);
      }
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <div className="flex h-full w-full overflow-hidden">
        <div className="flex h-full w-full flex-col">
          <ChatHeader
            user={user}
            selectedChat={selectedChat}
            getSender={getSender}
            onShowDetails={() => setShowDetails(!showDetails)}
          />

          <Messages
            isLoading={isLoading}
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />

          <ChatInput
            message={messageInput}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handleSendMessage={handleSendMessage}
          />
        </div>

        {showDetails && (
          <ChatDetails
            chat={selectedChat}
            currentUser={user}
            getSender={getSender}
            onClose={() => setShowDetails(false)}
          />
        )}
      </div>
    </div>
  );
}
