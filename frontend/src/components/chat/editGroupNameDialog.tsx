import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";

interface EditGroupNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  currentName: string;
  onGroupNameUpdated: (newName: string) => void;
}

export default function EditGroupNameDialog({
  isOpen,
  onClose,
  currentName,
  onGroupNameUpdated,
}: EditGroupNameDialogProps) {
  const [groupName, setGroupName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || groupName === currentName) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      onGroupNameUpdated(groupName);
      onClose();
    } catch (error) {
      console.error("Error updating group name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Group Name</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
