import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  emailId: string;
  blockchainId?: string;
}

interface AuthContextType {
  isSignedIn: boolean;
  user: User | null;
  signIn: (user?: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check for existing auth on mount and on window focus
  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsSignedIn(true);
      } catch {
        // Clear invalid data
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setIsSignedIn(false);
        setUser(null);
      }
    } else {
      setIsSignedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Check auth when window gains focus (user returns to tab)
    const handleFocus = () => {
      checkAuth();
    };

    // Check auth periodically (every 5 minutes)
    const interval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000); // 5 minutes

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  const signIn = (userData?: User) => {
    setIsSignedIn(true);
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const signOut = () => {
    setIsSignedIn(false);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
