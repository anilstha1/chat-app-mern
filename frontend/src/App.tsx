import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import HomePage from "./pages/home";
import Navbar from "./components/navbar";
import useAuthStore from "./stores/authStore";
import {useEffect} from "react";
import {Loader2} from "lucide-react";
import {Toaster} from "react-hot-toast";

function App() {
  const {user, isFetchingUser, getUser} = useAuthStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (isFetchingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="text-blue-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>

      <Toaster />
    </div>
  );
}

export default App;
