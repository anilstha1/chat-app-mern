import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {type User, type Chat} from "@/types";
import {Button} from "../ui/button";

interface ChatHeaderProps {
  user: User | null;
  selectedChat: Chat;
  getSender: (users: User[], user: User | null) => User;
  onShowDetails: () => void;
}

const ChatHeader = ({
  user,
  selectedChat,
  getSender,
  onShowDetails,
}: ChatHeaderProps) => {
  return (
    <div className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        {selectedChat.isGroupChat ? (
          <Avatar>
            <AvatarImage
              src={selectedChat.chatName || "/placeholder.svg"}
              alt={selectedChat.chatName}
            />
            <AvatarFallback>{selectedChat.chatName.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar>
            <AvatarImage
              src={
                getSender(selectedChat.users, user).image || "/placeholder.svg"
              }
              alt={getSender(selectedChat.users, selectedChat.users[0]).name}
            />
            <AvatarFallback>
              {getSender(selectedChat.users, selectedChat.users[0]).name.charAt(
                0
              )}
            </AvatarFallback>
          </Avatar>
        )}
        <div>
          <h2 className="font-medium">
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : getSender(selectedChat.users, user).name}
          </h2>
          {/* <p className="text-xs text-muted-foreground">
                  {selectedChat.online ? "Online" : "Offline"}
                </p> */}
        </div>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" onClick={onShowDetails}>
          Show Details
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
