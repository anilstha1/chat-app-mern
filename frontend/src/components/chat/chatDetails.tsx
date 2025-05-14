import {useState} from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";
import {X, Plus, LogOut, Trash2, Pencil} from "lucide-react";
import {type User, type Chat} from "@/types";
import AddMembersDialog from "./addMembersDialog";
import EditGroupNameDialog from "./editGroupNameDialog";
import axiosInstance from "@/lib/axios";
import useChatStore from "@/stores/chatStore";

interface ChatDetailsProps {
  chat: Chat;
  onClose: () => void;
  currentUser: User | null;
  getSender: (users: User[], user: User | null) => User;
}

const ChatDetails = ({
  chat,
  onClose,
  currentUser,
  getSender,
}: ChatDetailsProps) => {
  const [showEditName, setShowEditName] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const {setSelectedChat, getChats} = useChatStore();

  console.log(chat, currentUser);
  const handleUpdateGroupName = async (newName: string) => {
    try {
      const res = await axiosInstance.put("/chats/group/rename", {
        chatId: chat._id,
        chatName: newName,
      });
      await getChats();
      setSelectedChat(res.data.data);
    } catch (error) {
      console.error("Error renaming group:", error);
    }
  };
  const handleLeaveGroup = async () => {
    if (!currentUser) return;
    try {
      await axiosInstance.put("/chats/group/leave", {
        chatId: chat._id,
      });
      await getChats();
      setSelectedChat(null);
      onClose();
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };
  const handleRemoveMember = async (userId: string) => {
    try {
      const res = await axiosInstance.put("/chats/group/remove", {
        chatId: chat._id,
        userId,
      });
      setSelectedChat(res.data.data);
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };
  const handleDeleteGroup = async () => {
    try {
      await axiosInstance.delete(`/chats/group/${chat._id}`);
      await getChats();
      setSelectedChat(null);
      onClose();
    } catch (err) {
      console.error("Error deleting group:", err);
    }
  };

  return (
    <>
      <div className="flex h-full w-80 flex-col border-l bg-background">
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="font-semibold">Chat Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-6">
            {/* Chat/Group Info */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    chat.isGroupChat
                      ? chat.chatName || "/placeholder.svg"
                      : getSender(chat.users, currentUser).image ||
                        "/placeholder.svg"
                  }
                  alt={
                    chat.isGroupChat
                      ? chat.chatName
                      : getSender(chat.users, currentUser).name
                  }
                />
                <AvatarFallback>
                  {chat.isGroupChat
                    ? chat.chatName.charAt(0)
                    : getSender(chat.users, currentUser).name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center">
                  <h3 className="font-semibold">
                    {chat.isGroupChat
                      ? chat.chatName
                      : getSender(chat.users, currentUser).name}
                  </h3>
                </div>
                {!chat.isGroupChat ? (
                  <p className="text-sm text-muted-foreground">
                    {getSender(chat.users, currentUser).email}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {chat.users.length} members
                  </p>
                )}
              </div>
            </div>

            {/* Group Actions */}
            {chat.isGroupChat &&
              chat.isGroupChat &&
              chat.groupAdmin === currentUser?._id && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowEditName(true)}
                  >
                    <Pencil size={24} className="" /> Change Group Name
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowAddMembers(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Members
                  </Button>
                </div>
              )}

            {/* Members List */}
            {chat.isGroupChat && (
              <div className="flex flex-col gap-2">
                <h4 className="font-medium">Members</h4>
                <div className="flex flex-col gap-2">
                  {chat.users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 rounded-lg p-2"
                    >
                      <Avatar>
                        <AvatarImage
                          src={user.image || "/placeholder.svg"}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {user._id === chat.groupAdmin ? "Admin" : "Member"}
                        </span>
                      </div>
                      {currentUser?._id === chat.groupAdmin &&
                        user._id !== currentUser?._id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleRemoveMember(user._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {chat.isGroupChat && (
              <div className="space-y-2">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={handleLeaveGroup}
                >
                  <LogOut className="h-4 w-4" />
                  Leave Group
                </Button>

                {chat.groupAdmin === currentUser?._id && (
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteGroup}
                  >
                    <LogOut className="h-4 w-4" />
                    Delete Group
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <EditGroupNameDialog
        isOpen={showEditName}
        onClose={() => setShowEditName(false)}
        chatId={chat._id}
        currentName={chat.chatName}
        onGroupNameUpdated={handleUpdateGroupName}
      />

      <AddMembersDialog
        isOpen={showAddMembers}
        onClose={() => setShowAddMembers(false)}
        chatId={chat._id}
        existingMembers={chat.users.map((user) => user._id)}
        setSelectedChat={setSelectedChat}
      />
    </>
  );
};

export default ChatDetails;
