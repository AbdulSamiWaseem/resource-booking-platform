"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

      <form onSubmit={handleSubmit(handleOnSubmit)} noValidate className="space-y-4">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold">Resource Name</div>
          <input
            type="text"
            {...register("name")}
            placeholder="e.g. Meeting Room"
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-sm font-semibold">Description</div>
          <textarea
            {...register("description")}
            placeholder="Describe the resource..."
            rows={3}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
          >
            {createMutation.isPending ? "Saving..." : "Save Resource"}
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
