"use client";

import { useEffect, useState } from "react";
import HomepageClientComponent from "../components/Home";
import { getUsersWithNoConnection } from "../neo4j.action";
import { Neo4JUser } from "@/types";
import { useRequireAuth } from "../context/UserContext";

export default function Home() {
  const { isLoading, currentUser } = useRequireAuth();
  const [users, setUsers] = useState<Neo4JUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser?.applicationId) return;

      try {
        const others = await getUsersWithNoConnection(
          currentUser.applicationId,
        );
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
