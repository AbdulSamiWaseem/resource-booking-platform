"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { getRequest } from "../services/apiCalls";

interface Resource {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    const onSuccess = (res: any) => {
      setResources(res?.data?.resources || []);
      setLoading(false);
    };
    const onError = (err: any) => {
      toast.error(err?.message || "Failed to load resources.");
      setLoading(false);
    };
    await getRequest("resources", onSuccess, onError);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Successfully logged out.");
    router.replace("/login");
  };


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

      <h2 className="text-lg font-semibold mb-4">Resources</h2>
      {loading ? (
        <p className="text-sm text-gray-500">Loading resources...</p>
      ) : resources.length === 0 ? (
        <p className="text-sm text-gray-500">No resources available.</p>
      ) : (
        <div className="space-y-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="p-4 border border-gray-300 rounded flex flex-col gap-1 hover:scale-101 cursor-pointer transition"
              onClick={() => router.push(`/dashboard/resource/${resource.id}`)}
            >
              <h3 className="font-bold">{resource.name}</h3>
              <p className="text-sm text-gray-500">{resource.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
