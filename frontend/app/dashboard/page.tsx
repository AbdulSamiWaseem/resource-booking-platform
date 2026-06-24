"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
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
  Box,
  Typography,
} from "@mui/material";
import { authClient } from "../services/auth-client";
import { useAuth } from "../services/useAuth";
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
  const { signOut } = useAuth();

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

  const handleLogout = async () => {
    await signOut();
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
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Dashboard</Typography>
        <Box className="flex gap-2">
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
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Resources</Typography>
        <TextField variant="outlined" size="small" type="text" placeholder="Search resources..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </Box>
      {loading ? (
        <Typography variant="body2" >Loading resources...</Typography>
      ) : filteredResources.length === 0 ? (
        <Typography variant="body2" >No resources available.</Typography>
      ) : (
        <Box className="flex flex-col gap-4">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              variant="outlined"
              className="flex justify-between items-center hover:scale-[1.01] cursor-pointer transition"
              onClick={() => router.push(`/dashboard/resource/${resource.id}`)}
            >
              <Box>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {resource.name}
                  </Typography>
                  <Typography variant="body2">
                    {resource.description}
                  </Typography>
                </CardContent>
              </Box>
              <Box className="flex gap-2 p-4">
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
              </Box>
            </Card>
          ))}
        </Box>
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
    </Box>
  );
}
