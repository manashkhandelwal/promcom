"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import { useUser } from "../context/UserContext";

export default function HeaderPfp() {
  const { currentUser, logout } = useUser();

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="./logo.jpeg" className="h-8 w-8" alt="App Logo" />
          <span className="font-semibold text-lg">IfTheyDo</span>
        </Link>

        {/* Profile Menu */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <img
              src={currentUser?.photoUrl || "https://i.pravatar.cc/150?img=1"}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 hover:border-indigo-400 transition-colors"
            />
          </MenuButton>

          <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white border border-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
            <div className="p-1">
              <MenuItem>
                {({ active }) => (
                  <Link
                    href="/profile"
                    className={`${
                      active ? "bg-indigo-50 text-indigo-600" : "text-gray-700"
                    } group flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors`}
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Edit Profile
                  </Link>
                )}
              </MenuItem>

              <MenuItem>
                {({ active }) => (
                  <Link
                    href="/matches"
                    className={`${
                      active ? "bg-indigo-50 text-indigo-600" : "text-gray-700"
                    } group flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors`}
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    Matched Profiles
                  </Link>
                )}
              </MenuItem>
            </div>

            <div className="p-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    className={`${
                      active ? "bg-red-50 text-red-600" : "text-red-600"
                    } group flex w-full items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors`}
                    onClick={logout}
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </nav>
    </header>
  );
}
