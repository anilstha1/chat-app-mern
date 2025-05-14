import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn, formatDate} from "@/lib/utils";
import useAuthStore from "@/stores/authStore";
import useChatStore from "@/stores/chatStore";
import {type User} from "@/types";

export default function ChatsList() {
  const {user} = useAuthStore();
  const {chats, selectedChat, setSelectedChat} = useChatStore();

  const getSender = (users: User[]) => {
    return users[0]._id === user?._id ? users[1] : users[0];
  };

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-1 p-2">
        {chats.map((chat) => (
          <button
            key={chat._id}
            className={cn(
              "flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/50",
              selectedChat?._id === chat._id && "bg-muted/50"
            )}
            onClick={() => setSelectedChat(chat)}
          >
            <div className="relative">
              {chat.isGroupChat ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={chat.chatName || "/placeholder.svg"}
                    alt={chat.chatName}
                  />
                  <AvatarFallback>{chat.chatName.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={getSender(chat.users).image || "/placeholder.svg"}
                    alt={getSender(chat.users).name}
                  />
                  <AvatarFallback>
                    {getSender(chat.users).name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {chat.isGroupChat
                    ? chat.chatName
                    : getSender(chat.users).name}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {chat.latestMessage &&
                    formatDate(chat.latestMessage.createdAt)}
                </span>
              </div>
              {chat.latestMessage && (
                <div className="flex">
                  <p className="text-sm text-muted-foreground mr-2">
                    {chat.latestMessage.sender._id === user?._id
                      ? "You: "
                      : `${chat.latestMessage.sender.name}: `}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {chat.latestMessage?.content || "No messages yet"}
                  </p>
                </div>
              )}
            </div>
            {/* {conversation.unread > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {conversation.unread}
              </div>
            )} */}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
