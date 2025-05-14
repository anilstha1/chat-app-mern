import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ScrollArea} from "@/components/ui/scroll-area";
import {type User} from "@/types";
import useChatStore from "@/stores/chatStore";
import axiosInstance from "@/lib/axios";

interface UsersListProps {
  users: User[];
  setSearch: (search: string) => void;
  setIsSearching: (isSearching: boolean) => void;
}

export default function UsersList({
  users,
  setSearch,
  setIsSearching,
}: UsersListProps) {
  const {setSelectedChat, getChats} = useChatStore();

  const handleUserClick = async (userId: string) => {
    try {
      const res = await axiosInstance.post("/chats", {userId});
      await getChats();
      setSelectedChat(res.data.data);
      setSearch("");
      setIsSearching(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-2 p-3">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => handleUserClick(user._id)}
            className="flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50"
          >
            <Avatar>
              <AvatarImage
                src={user.image || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
