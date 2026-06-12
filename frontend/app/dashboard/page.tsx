"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Resource {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: "Available" | "Booked";
  description: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Successfully logged out.");
    router.replace("/login");
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard/create-resource")}
            className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded cursor-pointer"
          >
            Create Resource
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-500 text-white px-3 py-1.5 rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
