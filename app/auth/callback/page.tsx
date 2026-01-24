"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { msalInstance, initializeMsal } from "@/lib/msal";

export default function AuthCallback() {
  const router = useRouter();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const run = async () => {
      await initializeMsal();

      try {
        const result = await msalInstance.handleRedirectPromise();
        const account = result?.account ?? msalInstance.getAllAccounts()[0];
        if (account) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Auth callback failed", err);
        router.replace("/login");
      }
    };

    run();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}
