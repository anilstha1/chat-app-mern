import {useEffect, useState} from "react";
import ChatsList from "./chat/chats-list";
import UsersList from "./chat/users-list";
import {Input} from "./ui/input";
import GroupChatModal from "./group-chat-modal";
import axiosInstance from "../lib/axios";
import useChatStore from "@/stores/chatStore";
import {type User} from "@/types";

const Sidebar = () => {
  const {getChats} = useChatStore();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getChats().catch((error) => {
      console.error("Error fetching chats:", error);
    });
  }, [getChats]);

  const searchUsers = async (query: string) => {
    try {
      const res = await axiosInstance.get(`/users?search=${query}`);
      setSearchResults(res.data.data);
      setIsSearching(true);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (search.trim()) {
        searchUsers(search);
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (!value.trim()) {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  return (
    <div className={`flex h-full w-full flex-col border-r md:w-2/3 lg:w-1/3`}>
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="font-semibold">Chats</h2>
        <GroupChatModal />
      </div>
      <div className="p-3">
        <Input
          placeholder="Search users..."
          className="w-full"
          value={search}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isSearching ? (
        <UsersList
          users={searchResults}
          setIsSearching={setIsSearching}
          setSearch={setSearch}
        />
      ) : (
        <ChatsList />
      )}
    </div>
  );
};

export default Sidebar;
