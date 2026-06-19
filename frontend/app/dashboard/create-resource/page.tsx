"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { postApi } from "../../services/apiCalls";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Stack } from "@mui/material";

interface ResourceInputs {
  name: string;
  description: string;
}
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export default function CreateResource() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState } = useForm<ResourceInputs>({
    resolver: zodResolver(schema)
  });
  const { errors } = formState;

  const createMutation = useMutation({
    mutationFn: (payload: ResourceInputs) => postApi("resources", payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Resource created successfully!");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "An error occurred.");
    },
  });

  const handleOnSubmit = (data: ResourceInputs) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Create Resource</h1>
        <Button
          onClick={() => router.push("/dashboard")}
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Back to Dashboard
        </Button>
      </div>

      <form onSubmit={handleSubmit(handleOnSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Resource Name"
            placeholder="e.g. Meeting Room"
            fullWidth
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Description"
            placeholder="Describe the resource..."
            multiline
            rows={4}
            fullWidth
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending}
              sx={{ textTransform: "none" }}
            >
              {createMutation.isPending ? "Saving..." : "Save Resource"}
            </Button>
            <Button
              type="button"
              onClick={() => router.push("/dashboard")}
              variant="contained"
              color="error"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
          </div>
        </Stack>
      </form>
    </div>
  );
}
