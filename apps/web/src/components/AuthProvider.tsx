"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { apiFetch, apiLoginForm, setToken, clearToken } from "@/lib/api";
import type { User, Token, UserCreate } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const u = await apiFetch<User>("/api/v1/auth/me");
      setUser(u);
    } catch {
      setUser(null);
      clearToken();
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const data: Token = await apiLoginForm(email, password);
    setToken(data.access_token);
    await refreshUser();
  };

  const register = async (payload: UserCreate) => {
    await apiFetch<User>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    // Auto-login after registration
    await login(payload.email, payload.password);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
