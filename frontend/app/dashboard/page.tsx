"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { getRequest, deleteRequest, putRequest } from "../services/apiCalls";

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

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [updating, setUpdating] = useState(false);

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

  const handleDeleteResource = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }
    const onSuccess = (res: any) => {
      toast.success("Resource deleted successfully!");
      fetchResources();
    };
    const onError = (err: any) => {
      toast.error(err?.message || "Failed to delete resource.");
    };
    await deleteRequest(`resources/${id}`, onSuccess, onError);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResourceId) return;
    setUpdating(true);

    const payload = {
      name: editName,
      description: editDescription,
    };

    const onSuccess = (res: any) => {
      toast.success("Resource updated successfully!");
      setIsEditModalVisible(false);
      setEditingResourceId(null);
      fetchResources();
      setUpdating(false);
    };

    const onError = (err: any) => {
      toast.error(err?.message || "Failed to update resource.");
      setUpdating(false);
    };

    await putRequest(payload, `resources/${editingResourceId}`, onSuccess, onError);
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
              className="p-4 border border-gray-300 rounded flex justify-between items-center hover:scale-[1.01] cursor-pointer transition"
              onClick={() => router.push(`/dashboard/resource/${resource.id}`)}
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-bold">{resource.name}</h3>
                <p className="text-sm text-gray-500">{resource.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingResourceId(resource.id);
                    setEditName(resource.name);
                    setEditDescription(resource.description);
                    setIsEditModalVisible(true);
                  }}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResource(resource.id);
                  }}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isEditModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Edit Resource</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <div className="text-sm font-semibold">Name</div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <div className="text-sm font-semibold">Description</div>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded h-32"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalVisible(false);
                    setEditingResourceId(null);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm cursor-pointer"
                >
                  {"Update Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
