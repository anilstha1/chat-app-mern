import {Bell} from "lucide-react";
import {Button} from "@/components/ui/button";
import UserProfileDropdown from "./user-profile-dropdown";
import useAuthStore from "@/stores/authStore";
import {useNavigate} from "react-router-dom";
import useChatStore from "@/stores/chatStore";
import {useState} from "react";
import NotificationModal from "./chat/notificationModal";

export default function Navbar() {
  const {user, logout} = useAuthStore();
  const {notification} = useChatStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notification}
      />
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">ChatApp</h1>
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full cursor-pointer"
                onClick={() => setShowNotifications(true)}
              >
                <Bell size={30} />
                {notification.length > 0 && (
                  <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-600 text-white flex items-center justify-center">
                    {notification.length}
                  </span>
                )}
              </Button>
            </div>
            <UserProfileDropdown user={user} onLogout={logout} />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="rounded-lg"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              variant="default"
              className="rounded-lg"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        )}
      </header>
    </>
  );
}
