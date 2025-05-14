import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import authAxios from "@/lib/axios";
import {type User} from "@/types";
import axiosInstance from "@/lib/axios";
import useChatStore from "@/stores/chatStore";
import toast from "react-hot-toast";

interface GroupChatFormProps {
  setIsOpen: (isOpen: boolean) => void;
}

const GroupChatForm = ({setIsOpen}: GroupChatFormProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {setSelectedChat, getChats} = useChatStore();

  useEffect(() => {
    const getUsers = async () => {
      const res = await authAxios.get("/users");
      console.log("Users:", res.data);
      return res.data;
    };
    getUsers().then((data) => {
      setUsers(data.data);
    });
  }, []);

  const createGroupChat = async () => {
    const res = await axiosInstance.post("/chats/group", {
      name: groupName,
      users: JSON.stringify(selectedUsers),
    });
    console.log("Group chat created:", res.data);
    return res.data;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName || selectedUsers.length < 2) return;

    createGroupChat()
      .then(async (data) => {
        console.log("Group chat created successfully:", data);
        toast.success("Group chat created successfully");
        setGroupName("");
        setSelectedUsers([]);
        await getChats();
        setSelectedChat(data.data);
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Error creating group chat:", error);
        toast.error("Failed to create group chat");
      });
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="groupName">Group Name</Label>
        <Input
          id="groupName"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label>Select Members</Label>
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <ScrollArea className="h-[200px]">
          <div className="flex flex-col gap-2">
            {filteredUsers.map((user) => (
              <button
                key={user._id}
                type="button"
                onClick={() => toggleUser(user._id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50",
                  selectedUsers.includes(user._id) && "bg-muted"
                )}
              >
                <Avatar>
                  <AvatarImage src={user.image} alt={user.name} />
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
      </div>

      <Button
        type="submit"
        disabled={!groupName || selectedUsers.length < 2}
        className="w-full"
      >
        Create Group Chat
      </Button>
    </form>
  );
};

export default GroupChatForm;
