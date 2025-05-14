import {Send} from "lucide-react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";

interface ChatInputProps {
  message: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const ChatInput = ({
  message,
  handleChange,
  handleKeyDown,
  handleSendMessage,
}: ChatInputProps) => {
  return (
    <div className="border-t p-4">
      <form onSubmit={handleSendMessage} className="w-full flex gap-2">
        <Input
          placeholder="Type a message..."
          autoFocus
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
