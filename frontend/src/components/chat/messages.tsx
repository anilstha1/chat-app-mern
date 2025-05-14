import {ScrollArea} from "../ui/scroll-area";
import {Skeleton} from "../ui/skeleton";
import Message from "./message";
import {type Message as IMessage} from "@/types";

interface MessagesProps {
  isLoading: boolean;
  messages: IMessage[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const Messages = ({
  isLoading,
  messages,
  isTyping,
  messagesEndRef,
}: MessagesProps) => {
  return (
    <div className="flex-1 min-h-[50px]">
      <ScrollArea className="h-full p-4">
        {isLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          {messages?.map((message) => (
            <Message key={message._id} message={message} />
          ))}
        </div>

        {isTyping && (
          <div className="flex items-center w-fit gap-2 p-2 bg-muted/50 rounded-lg ml-8">
            <div className="h-2 w-2 rounded-full bg-gray-600 animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-gray-600 animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-gray-600 animate-bounce" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </ScrollArea>
    </div>
  );
};

export default Messages;
