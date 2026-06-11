"use client";

import { useState } from "react";
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
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex gap-2">
          <button
            className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded cursor-pointer"
          >
            Create Resource
          </button>
        </div>
      </div>
    </div>
  );
}
