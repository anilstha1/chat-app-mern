import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {type Message} from "@/types";
import useChatStore from "@/stores/chatStore";
import {ScrollArea} from "@/components/ui/scroll-area";
import useAuthStore from "@/stores/authStore";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Message[];
}

export default function NotificationModal({
  isOpen,
  onClose,
}: NotificationModalProps) {
  const {notification, setNotification, setSelectedChat} = useChatStore();
  const {user} = useAuthStore();

  const handleNotificationClick = (notif: Message) => {
    setSelectedChat(notif.chat);
    setNotification(notification.filter((n) => n._id !== notif._id));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {notification.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No new messages
              </p>
            ) : (
              notification.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className="flex items-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {notif.chat.isGroupChat
                        ? notif.chat.chatName
                        : notif.chat.users.find((u) => u._id !== user?._id)
                            ?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {notif.sender.name}: {notif.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
