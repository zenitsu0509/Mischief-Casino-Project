import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthService } from "@/services/AuthService";

// Define user interface to represent our user data
interface User {
  username: string;
  money: number;
}

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User | null>;
  signup: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  updateMoney: (amount: number) => void;
  refreshUserState: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh the user state from storage
  const refreshUserState = () => {
    const loggedInUser = AuthService.getLoggedInUser();
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // Load users from JSON file and localStorage
      await AuthService.loadUsers();
      AuthService.checkLocalStorage();
      
      // Check if user is already logged in
      refreshUserState();
      
      setLoading(false);
    };
    
    initializeAuth();
    
    // Set up event listener for storage events (for multi-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'loggedInUser') {
        refreshUserState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const signup = async (username: string, password: string): Promise<User | null> => {
    const user = await AuthService.signup(username, password);
    if (user) {
      // Set the current user without the password
      const userData = { username: user.username, money: user.money };
      setCurrentUser(userData);
      return userData;
    }
    return null;
  };

  const login = async (username: string, password: string): Promise<User | null> => {
    const user = await AuthService.login(username, password);
    if (user) {
      // Set the current user without the password
      const userData = { username: user.username, money: user.money };
      setCurrentUser(userData);
      return userData;
    }
    return null;
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };
  
  const updateMoney = (amount: number) => {
    if (currentUser) {
      AuthService.updateMoney(currentUser.username, amount);
      setCurrentUser({
        ...currentUser,
        money: amount
      });
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    updateMoney,
    refreshUserState
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
