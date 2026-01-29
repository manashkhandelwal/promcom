"use client";

import { msalInstance, initializeMsal } from "@/lib/msal";
import { Mail, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserByEmail } from "../neo4j.action";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const checkLogin = async () => {
      await initializeMsal();
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        const account = accounts[0];
        const user = await getUserByEmail(account.username);
        if (user) {
          router.replace("/home");
        } else {
          router.replace("/profile");
        }
      }
    };

    checkLogin();
  }, [router]);

  const handleLogin = async (): Promise<void> => {
    await initializeMsal();
    await msalInstance.loginRedirect({
      scopes: ["openid", "profile", "email"],
      prompt: "select_account",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">IT</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IfTheyDo</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-500 text-sm">
                Use your Microsoft account to sign in securely
              </p>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5" />
              <span>Login with Microsoft Email OTP</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Secure authentication
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800 text-center">
                🔒 Your data is protected with enterprise-grade security
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  );
}
