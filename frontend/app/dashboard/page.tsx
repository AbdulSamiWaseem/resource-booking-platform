"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResources } from "../services/queries";
import { deleteResource, editResource, ResourceInputs } from "../services/mutation";

interface Resource {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});
export default function Dashboard() {
  const router = useRouter();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const { register, handleSubmit, formState, reset, setValue } = useForm<ResourceInputs>({
    resolver: zodResolver(schema)
  });
  const { errors } = formState;

  const { data, isLoading: loading, error } = useResources();

  const resources: Resource[] = data?.resources || [];

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to load resources.");
    }
  }, [error]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Successfully logged out.");
    router.replace("/login");
  };

  const deleteMutation = deleteResource();

  const editMutation = editResource();

  const handleDeleteResource = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }
    deleteMutation.mutate(id);
  };

  const handleEditSubmit = async (data: ResourceInputs) => {
    if (!editingResourceId) return;
    editMutation.mutate({
      id: editingResourceId,
      payload: {
        name: data.name,
        description: data.description,
      },
    }, {
      onSuccess: () => {
        setIsEditModalVisible(false);
        setEditingResourceId(null);
        reset();
      },
    });
  };

  const filteredResources = resources.filter((resource) =>
    resource.name.toLowerCase().includes(searchValue.toLowerCase())
  );
  const handleEditResource = (resource: Resource) => {
    setEditingResourceId(resource.id);
    setValue("name", resource.name);
    setValue("description", resource.description);
    setIsEditModalVisible(true);
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
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Resources</h2>
        <input className="px-4 py-2 border border-gray-300 rounded text-sm outline-none min-w-72" type="text" placeholder="Search resources..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading resources...</p>
      ) : filteredResources.length === 0 ? (
        <p className="text-sm text-gray-500">No resources available.</p>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
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
                    handleEditResource(resource);
                  }}
                  className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded cursor-pointer"
                >
                  Edit
                </button>
                <button
                  disabled={deleteMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResource(resource.id);
                  }}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2.5 py-1.5 rounded cursor-pointer disabled:opacity-50"
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
            <form onSubmit={handleSubmit(handleEditSubmit)} noValidate className="space-y-4">
              <div>
                <div className="text-sm font-semibold">Name</div>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <div className="text-sm font-semibold">Description</div>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border border-gray-300 rounded h-32"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalVisible(false);
                    setEditingResourceId(null);
                    reset();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editMutation.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm cursor-pointer disabled:opacity-50"
                >
                  {editMutation.isPending ? "Updating..." : "Update Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
