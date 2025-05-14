import Chatbox from "@/components/chat/chatbox";
import Sidebar from "@/components/sidebar";

const HomePage = () => {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)]">
      <Sidebar />
      <Chatbox />
    </div>
  );
};

export default HomePage;
