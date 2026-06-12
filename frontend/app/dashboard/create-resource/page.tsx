"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { postRequest } from "../../services/apiCalls";

export default function CreateResource() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter a resource name.");
      return;
    }

    if (!description) {
      toast.error("Please enter a description.");
      return;
    }

    const onSuccess = (res: any) => {
      toast.success(res?.message || "Resource created successfully!");
      router.push("/dashboard");
    };

    const onError = (err: any) => {
      toast.error(err?.message || "An error occurred.");
    };

    await postRequest({ name, description }, "resources/create-resource", onSuccess, onError);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Create Resource</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm bg-gray-200 px-3 py-1.5 rounded cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold">Resource Name</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Meeting Room"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold">Description</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the resource..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Save Resource
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="bg-gray-200 px-4 py-2 rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
