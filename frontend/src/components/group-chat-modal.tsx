import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "./ui/button";
import {Plus} from "lucide-react";
import {useState} from "react";
import GroupChatForm from "./group-chat-form";

const GroupChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-5 w-5" /> New Group Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Group Chat</DialogTitle>
          <DialogDescription>
            Create a group by adding a name and selecting members.
          </DialogDescription>
        </DialogHeader>
        <GroupChatForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default GroupChatModal;
