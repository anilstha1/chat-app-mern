import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatDate} from "@/lib/utils";
import useAuthStore from "@/stores/authStore";
import {type Message} from "@/types";

interface ChatMessageProps {
  message: Message;
}

export default function Message({message}: ChatMessageProps) {
  const {user} = useAuthStore();
  const isSelf = message.sender._id === user?._id;

  return (
    <div
      className={`w-full flex gap-3 ${
        isSelf ? "flex-row-reverse self-end" : "flex-row self-start"
      }`}
    >
      {!isSelf && (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={message.sender.image || "/placeholder.svg"}
            alt={message.sender.name}
          />
          <AvatarFallback>{message.sender.name?.[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex max-w-[80%] flex-col gap-1">
        <div
          className={`rounded-lg px-3 py-2 ${
            isSelf
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-black"
          }`}
        >
          <p>{message.content}</p>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDate(message.createdAt)}
        </span>
      </div>
    </div>
  );
}
