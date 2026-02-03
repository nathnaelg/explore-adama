import { setLogoutCallback } from "@/src/core/api/client";
import { profileService } from "@/src/features/profile/services/profile.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authService } from "../services/auth.service";
import { AuthResponse, LoginDto, RegisterDto } from "../types";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<AuthResponse>;
  register: (userData: RegisterDto) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (user: any) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    initializeAuth();

    // Register global logout callback for API client
    setLogoutCallback(() => {
      console.log("[AuthContext] Global logout triggered from API Client");
      setUser(null);
      setAccessToken(null);
      // Optionally navigate to login key if needed, but state change should trigger Router
    });
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const { token, user: storedUser } = await authService.initializeAuth();
      if (token && storedUser) {
        setUser(storedUser);
        setAccessToken(token);
      }
    } catch (err) {
      console.error("Auth initialization error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const login = async (credentials: LoginDto): Promise<AuthResponse> => {
    try {
      clearError();
      setIsLoading(true);
      const response = await authService.login(credentials);
      console.log(
        "[AuthContext] Login response:",
        JSON.stringify(response, null, 2),
      );
      setUser(response.user);
      setAccessToken(response.accessToken);
      return response;
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterDto): Promise<AuthResponse> => {
    try {
      clearError();
      setIsLoading(true);
      const response = await authService.register(userData);
      console.log(
        "[AuthContext] Register response:",
        JSON.stringify(response, null, 2),
      );
      setUser(response.user);
      setAccessToken(response.accessToken);
      return response;
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };



  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setAccessToken(null);
      setAccessToken(null);
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updatedData: any): Promise<void> => {
    try {
      let updatedUser;
      if (updatedData && updatedData.id && updatedData.email) {
        // If we passed the full user object (from profileService or direct)
        updatedUser = updatedData;
      } else {
        // Legacy fallback: call service with partial data
        updatedUser = await profileService.updateProfile(updatedData);
      }
      setUser(updatedUser);
      await AsyncStorage.setItem("@auth_user", JSON.stringify(updatedUser));
    } catch (err: any) {
      setError(err.message || "Update failed");
      throw err;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      return await authService.isAuthenticated();
    } catch (err) {
      console.error("Check auth error:", err);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isReady: !isLoading, // Use !isLoading to indicate readiness after initial check
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
