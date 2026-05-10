import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
type User = {
  id: number;
  email: string;
  role: "owner" | "employee" | "client";
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 🔥 Load session on refresh
  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Invalid user data in storage");
      localStorage.removeItem("user");
    }
  }, []);

  // 🔥 LOGIN
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 🔥 LOGOUT (ALL ROLES)
  const logout = async () => {
    try {
      // 👉 Optional backend logout
      await fetch("http://localhost/crm-api/logout.php", {
        method: "POST",
      });
    } catch (err) {
      console.warn("Logout API failed (optional)", err);
    }

    // 🔥 Clear session
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔥 SAFE HOOK
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}