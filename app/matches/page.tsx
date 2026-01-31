"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeaderPfp from "../components/HeaderPfp";
import { Neo4JUser } from "@/types";
import { useRequireAuth } from "../context/UserContext";

export default function MatchPage() {
  const { isLoading, currentUser, email } = useRequireAuth();
  const [matches, setMatches] = useState<Neo4JUser[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!email) return;

      try {
        const res = await fetch(`/api/get-matches?email=${email}`);
        const data = await res.json();
        setMatches(data.matches || []);
      } catch (err) {
        console.error("Failed to load matches:", err);
      } finally {
        setLoadingMatches(false);
      }
    };

    if (email) {
      fetchMatches();
    }
  }, [email]);

  if (isLoading || loadingMatches) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-black rounded-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm bg-gradient-to-br from-pink-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <HeaderPfp />
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Your Matches
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {matches.length} match{matches.length !== 1 ? "es" : ""}
          </p>
        </header>

        {matches.length === 0 ? (
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">💕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No matches yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start swiping to find your perfect match!
            </p>
            <Link
              href="/home"
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold py-3 px-6 rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200"
            >
              Start Swiping
            </Link>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="grid gap-4">
              {matches.map((match, key) => (
                <div
                  key={key}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={match.photoUrl}
                        alt={match.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {match.fullName}, {match.age}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {match.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
