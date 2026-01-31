"use client";

import { useEffect, useRef, useState } from "react";
import { msalInstance, initializeMsal } from "@/lib/msal";
import { useRouter } from "next/navigation";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  bio: string;
  hobbies: string;
  photo: File | null;
  photoUrl?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const handledRef = useRef(false);

  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

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

        // 🔍 Check if profile exists
        const res = await fetch(`/api/get-profile?email=${account.username}`);

        if (res.ok) {
          const data = await res.json();

          setIsExistingUser(true);

          setForm({
            fullName: data.fullName,
            email: data.email,
            age: data.age,
            phone: data.phone,
            bio: data.bio,
            hobbies: data.hobbies.join(", "),
            photo: null,
            photoUrl: data.photoUrl,
          });
        } else {
          // 🆕 New user
          setForm({
            fullName: account.name || "User",
            email: account.username,
            phone: "",
            bio: "",
            hobbies: "",
            age: 0,
            photo: null,
          });
        }
      } catch (err) {
        console.error(err);
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

    setForm(
      (prev) =>
        prev && {
          ...prev,
          [name]: name === "age" ? Number(value) : value,
        },
    );
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm((prev) => prev && { ...prev, photo: e.target.files![0] });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let photoUrl = form.photoUrl;

    if (form.photo) {
      const base64 = await toBase64(form.photo);
      const res = await fetch("/api/upload-photo", {
        method: "POST",
        body: JSON.stringify({ base64 }),
      });

      const data = await res.json();
      photoUrl = data.photoUrl;
    }

    const payload = {
      fullName: form.fullName,
      email: form.email,
      age: form.age,
      phone: form.phone,
      bio: form.bio,
      hobbies: form.hobbies
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean),
      photoUrl,
    };

    const endpoint = isExistingUser
      ? "/api/update-profile"
      : "/api/create-profile";

    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    alert(isExistingUser ? "Profile updated" : "Profile created");
    router.replace("/home");
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-6">
          {isExistingUser ? "Edit Profile" : "Complete your profile"}
        </h1>

        {/* Full name (always locked) */}
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
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <p className="text-xs text-gray-500">
              valid age is between 18 and 24
            </p>

            {/* Age (locked after creation) */}
            <input
              id="age"
              name="age"
              type="number"
              value={form.age}
              disabled={isExistingUser}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              min={18}
              max={24}
              required
              placeholder="Enter your age"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            {/* Email locked */}
            <input
              name="email"
              value={form.email}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
              id="email"
              required
            />
          </div>

          {/* Editable fields */}
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
              placeholder="+910000000000"
              required
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
              name="bio"
              value={form.bio}
              onChange={onChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              id="bio"
              required
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="hobbies"
              className="block text-sm font-medium text-gray-700"
            >
              Hobbies (comma separated)
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
          </div>
          <div className="space-y-2">
            <label
              htmlFor="profile-picture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Photo
            </label>
            <p className="text-xs text-gray-500">
              File size should not be larger than 9MB
            </p>
            {/* Existing photo preview */}
            {form.photoUrl && (
              <img
                src={form.photoUrl}
                className="w-32 h-32 rounded-full object-cover mb-2"
              />
            )}

            <input
              id="profile-picture"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-black file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
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
