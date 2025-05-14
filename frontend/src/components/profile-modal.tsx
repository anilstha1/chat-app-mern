import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Label} from "@/components/ui/label";
import {type User as IUser} from "../types";

interface ProfileModalProps {
  user: IUser;
  isOpen: boolean;
  onChange: (open: boolean) => void;
}

const ProfileModal = ({user, isOpen, onChange}: ProfileModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col space-y-4 items-start w-full">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <div className="px-3 py-2 text-sm">{user.name}</div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="px-3 py-2 text-sm">{user.email}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
