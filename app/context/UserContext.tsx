"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { msalInstance, initializeMsal } from "@/lib/msal";
import { getUserByID } from "../neo4j.action";
import { Neo4JUser } from "@/types";

interface UserContextType {
  currentUser: Neo4JUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  email: string | null;
  refetchUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Neo4JUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      await initializeMsal();

      const result = await msalInstance.handleRedirectPromise();
      const account = result?.account ?? msalInstance.getAllAccounts()[0];

      if (!account) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setEmail(account.username);
      setIsAuthenticated(true);

      // Fetch user from Neo4j
      const user = await getUserByID(account.username);
      setCurrentUser(user);
    } catch (err) {
      console.error("Auth/User fetch failed:", err);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUser = async () => {
    if (!email) return;
    try {
      const user = await getUserByID(email);
      setCurrentUser(user);
    } catch (err) {
      console.error("Refetch user failed:", err);
    }
  };

  const logout = () => {
    msalInstance.logoutRedirect();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        isAuthenticated,
        email,
        refetchUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Hook that redirects to login if not authenticated
export function useRequireAuth() {
  const router = useRouter();
  const { isLoading, isAuthenticated, currentUser, email } = useUser();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  return { isLoading, isAuthenticated, currentUser, email };
}
