"use client";

import { useEffect, useState } from "react";
import { initializeMsal, msalInstance } from "@/lib/msal";
import { ArrowRight, Loader2 } from "lucide-react";
import { Lock, GraduationCap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import { getUserByEmail } from "./neo4j.action";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await initializeMsal();
        const accounts = msalInstance.getAllAccounts();

        if (accounts.length > 0) {
          const account = accounts[0];
          const user = await getUserByEmail(account.username);
          if (user) {
            router.replace("/home");
          } else {
            router.replace("/login");
          }
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
    <main
      className="min-h-screen
    bg-gray-50
    bg-[url('/mobile2.jpg')]
    sm:bg-[url('/bg1.png')]
    bg-cover
    bg-center
    shadow-lg
    flex
    flex-col"
    >
      <Header />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-semibold tracking-tight drop-shadow-lg text-red-700 sm:text-7xl">
            WANNA BE MY PROM PARTNER ?
          </h1>

          <p className="mt-8 text-lg font-medium text-rose-900 sm:text-xl">
            Join us in making prom night unforgettable! Log In now to find your
            perfect prom date and create memories that will last a lifetime.
          </p>

          {/* 🔐 Trust & Security Section */}
          <div className="mt-16 sm:mt-12 grid gap-4 sm:grid-cols-3 text-sm text-red-950 sm:text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Your data is encrypted & secure</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Exclusive to Bennett University students</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified sign-in using official university email</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
