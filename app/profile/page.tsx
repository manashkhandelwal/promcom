"use client";

import { useEffect, useRef, useState } from "react";
import { msalInstance, initializeMsal } from "@/lib/msal";
import { useRouter } from "next/navigation";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  hobbies: string;
  photo: File | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const handledRef = useRef(false);

  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const run = async () => {
      try {
        await initializeMsal();

        const result = await msalInstance.handleRedirectPromise();
        const account = result?.account ?? msalInstance.getAllAccounts()[0];

        if (!account) {
          router.replace("/login");
          return;
        }

        // ✅ MSAL is initialized here
        setForm({
          fullName: account.name || "User",
          email: account.username,
          phone: "",
          bio: "",
          hobbies: "",
          photo: null,
        });
      } catch (err) {
        console.error("Auth init failed", err);
        router.replace("/login");
      }
    };

    run();
  }, [router]);

  if (!form) {
    return <p className="text-center mt-10">Loading profile…</p>;
  }

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => prev && { ...prev, [name]: value });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm((prev) => prev && { ...prev, photo: e.target.files![0] });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let photoUrl: string | undefined;

    if (form.photo) {
      const base64 = await toBase64(form.photo);
      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: JSON.stringify({ base64 }),
      });
      const data = await res.json();
      photoUrl = data.photoUrl;
    }

    await fetch("/api/create-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
        hobbies: form.hobbies
          .split(",")
          .map((h) => h.trim())
          .filter(Boolean),
        photoUrl,
      }),
    });

    setLoading(false);
    alert("Profile saved");
    router.replace("/home");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Complete your profile
          </h1>
          <p className="text-gray-600">Fill in your details to get started</p>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
              required
              disabled
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              required
              placeholder="+910000000000"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={onChange}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
              required
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="hobbies"
              className="block text-sm font-medium text-gray-700"
            >
              Hobbies
            </label>
            <input
              id="hobbies"
              name="hobbies"
              value={form.hobbies}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              required
              placeholder="Reading, Traveling, Photography..."
            />
            <p className="text-xs text-gray-500">
              Separate multiple hobbies with commas
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile-picture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
