"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { putApi, getApi, deleteApi } from "../services/apiCalls";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface Resource {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

interface ResourceInputs {
  name: string;
  description: string;
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});
export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const { register, handleSubmit, formState, reset, setValue } = useForm<ResourceInputs>({
    resolver: zodResolver(schema)
  });
  const { errors } = formState;

  const { data, isLoading: loading, error } = useQuery({
    queryKey: ["resources"],
    queryFn: () => getApi("resources"),
  });

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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteApi(`resources/${id}`),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Resource deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete resource.");
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ResourceInputs }) =>
      putApi(`resources/${id}`, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Resource updated successfully!");
      setIsEditModalVisible(false);
      setEditingResourceId(null);
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update resource.");
    },
  });

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
          <Button
            onClick={() => router.push("/dashboard/create-resource")}
            variant="contained"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Create Resource
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Resources</h2>
        <TextField variant="outlined" size="small" type="text" placeholder="Search resources..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>
      {loading ? (
        <p className="text-sm text-gray-500">Loading resources...</p>
      ) : filteredResources.length === 0 ? (
        <p className="text-sm text-gray-500">No resources available.</p>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              variant="outlined"
              className="flex justify-between items-center hover:scale-[1.01] cursor-pointer transition"
              onClick={() => router.push(`/dashboard/resource/${resource.id}`)}
            >
              <div>
                <CardHeader
                  sx={{ pb: 1 }}
                />
                <h2 className="text-lg font-semibold pl-4">{resource.name}</h2>
                <CardContent sx={{ pt: 0 }}>
                  <p className="text-sm text-gray-500">{resource.description}</p>
                </CardContent>
              </div>
              <div className="flex gap-2 p-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditResource(resource);
                  }}
                  variant="contained"
                  size="small"
                  sx={{ textTransform: "none" }}

                >
                  Edit
                </Button>
                <Button
                  disabled={deleteMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteResource(resource.id);
                  }}
                  variant="contained"
                  size="small"
                  color="error"
                  sx={{ textTransform: "none" }}

                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingResourceId(null);
          reset();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Resource</DialogTitle>
        <DialogContent dividers>
          <form id="edit-resource-form" onSubmit={handleSubmit(handleEditSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Name"
                fullWidth
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                {...register("description")}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsEditModalVisible(false);
              setEditingResourceId(null);
              reset();
            }}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-resource-form"
            variant="contained"
            disabled={editMutation.isPending}
            sx={{ textTransform: "none" }}

          >
            {editMutation.isPending ? "Updating..." : "Update Resource"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
