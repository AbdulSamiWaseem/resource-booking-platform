"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Stack, Box, Typography } from "@mui/material";
import { createResource, ResourceInputs } from "../../services/mutation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export default function CreateResource() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<ResourceInputs>({
    resolver: zodResolver(schema)
  });
  const { errors } = formState;

  const createMutation = createResource();

  const handleOnSubmit = (data: ResourceInputs) => {
    createMutation.mutate(data);
  };

  return (
    <Box className="p-6">
      <Box className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>Create Resource</Typography>
        <Button
          onClick={() => router.push("/dashboard")}
          variant="outlined"
          sx={{ textTransform: "none" }}
        >
          Back to Dashboard
        </Button>
      </Box>

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

          <Box className="flex gap-4 pt-2">
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
          </Box>
        </Stack>
      </form>
    </Box>
  );
}
