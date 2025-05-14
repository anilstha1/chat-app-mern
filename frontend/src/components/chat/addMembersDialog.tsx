import {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {type User, type Chat} from "@/types";
import axiosInstance from "@/lib/axios";

interface AddMembersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  existingMembers: string[];
  setSelectedChat: (chat: Chat) => void;
}

export default function AddMembersDialog({
  isOpen,
  onClose,
  chatId,
  existingMembers,
  setSelectedChat,
}: AddMembersDialogProps) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axiosInstance.get(`/users?search=${query}`);
      // Filter out existing members
      const filteredUsers = res.data.data.filter(
        (user: User) => !existingMembers.includes(user._id)
      );
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (!selectedUsers.length) return;
    setIsLoading(true);

    try {
      const res = await axiosInstance.put("/chats/group/add", {
        chatId,
        userIds: selectedUsers,
      });

      setSelectedChat(res.data.data);
      setSearch("");
      setSelectedUsers([]);
      setSearchResults([]);
      onClose();
    } catch (error) {
      console.error("Error adding members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col gap-2">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => toggleUser(user._id)}
                  className={`flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50 ${
                    selectedUsers.includes(user._id) ? "bg-muted" : ""
                  }`}
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
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMembers}
              disabled={!selectedUsers.length || isLoading}
            >
              Add Members
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
