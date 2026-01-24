"use client";

import { useEffect, useState } from "react";
import { initializeMsal, msalInstance } from "@/lib/msal";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initializeMsal();
        const accounts = msalInstance.getAllAccounts();

        if (accounts.length > 0) {
          // Redirect authenticated users to dashboard
          router.replace("/dashboard");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
          <span className="text-4xl">👋</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome to IfTheyDo
        </h1>
        <p className="text-gray-600">
          Please sign in to start matching and connecting with others.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition w-full font-medium"
        >
          Go to Login
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
