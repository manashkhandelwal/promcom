"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";

export default function HeaderPfp() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="h-8 w-8"
            alt="App Logo"
          />
          <span className="font-semibold text-lg">IfTheyDo</span>
        </Link>

        {/* Profile Menu */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border"
            />
          </MenuButton>

          <MenuItems
            anchor="bottom end"
            className="mt-2 w-48 origin-top-right rounded-xl bg-white border shadow-lg p-1
                       transition data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              <Link
                href="/profile/edit"
                className="block rounded-lg px-4 py-2 text-sm data-active:bg-gray-100"
              >
                Edit Profile
              </Link>
            </MenuItem>

            <MenuItem>
              <Link
                href="/matches"
                className="block rounded-lg px-4 py-2 text-sm data-active:bg-gray-100"
              >
                Matched Profiles
              </Link>
            </MenuItem>

            <MenuItem>
              <button className="w-full rounded-lg text-left px-4 py-2 text-sm text-red-600 data-active:bg-gray-100">
                Logout
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </nav>
    </header>
  );
}
