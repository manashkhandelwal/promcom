"use client";

import { useEffect, useState } from "react";
import HomepageClientComponent from "../components/Home";
import { Neo4JUser } from "@/types";
import { useRequireAuth } from "../context/UserContext";

export default function Home() {
  const { isLoading, currentUser } = useRequireAuth();
  const [users, setUsers] = useState<Neo4JUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser?.applicationId) {
        setLoadingUsers(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/get-suggestions?applicationId=${currentUser.applicationId}`
        );
        const others = await res.json();
        setUsers(others);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

  if (isLoading || loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-black rounded-full" />
        <p>Loading...</p>
        <p>if it take more than 30 seconds, refresh the page</p>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <main>
      <HomepageClientComponent currentUser={currentUser} users={users} />
    </main>
  );
}
