import {create} from "zustand";
import axiosInstance from "../lib/axios";
import {type User} from "../types";
import toast from "react-hot-toast";

interface AuthStore {
  user: User | null;
  token: string | null;
  isFetchingUser: boolean;
  isLoginLoading: boolean;
  isSignupLoading: boolean;
  getUser: () => Promise<void>;
  signup: (userData: FormData) => Promise<void>;
  login: (credentials: {email: string; password: string}) => Promise<void>;
  logout: () => void;
}

interface ApiResponse {
  statusCode: number;
  data: User & {token: string};
  message: string;
  success: boolean;
}

const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  token: localStorage.getItem("authToken") || null,
  isFetchingUser: false,
  isLoginLoading: false,
  isSignupLoading: false,

  getUser: async () => {
    try {
      set({isFetchingUser: true});
      const {data} = await axiosInstance.get<ApiResponse>(
        "/users/current-user"
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch user");
      }

      const userData = data.data;
      set({
        user: userData,
        isFetchingUser: false,
      });
    } catch (error) {
      console.error("Get user error", error);
      localStorage.removeItem("authToken");
      set({
        user: null,
        token: null,
        isFetchingUser: false,
      });
    }
  },
  signup: async (formData) => {
    try {
      set({isSignupLoading: true});
      const {data} = await axiosInstance.post<ApiResponse>(
        "/users/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(data);
      if (!data.success) {
        throw new Error(data.message || "Signup failed");
      }
      set({
        isSignupLoading: false,
      });

      toast.success("Signup successful");
    } catch (error) {
      set({
        isSignupLoading: false,
      });
      toast.error("Signup failed");
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log(credentials);
      set({isLoginLoading: true});
      const {data} = await axiosInstance.post<ApiResponse>(
        "/users/login",
        credentials
      );

      console.log(data);
      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      const {token, ...userWithoutToken} = data.data;
      localStorage.setItem("authToken", token);
      set({
        user: userWithoutToken,
        token: token,
        isLoginLoading: false,
      });
      toast.success("Login successful");
    } catch (error) {
      console.error("Login error", error);
      set({
        isLoginLoading: false,
      });
      toast.error("Login failed");
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({user: null, token: null});
  },
}));

export default useAuthStore;
