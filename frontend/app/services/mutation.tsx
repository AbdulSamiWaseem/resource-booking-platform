import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { postApi, deleteApi, putApi } from "./apiCalls";

export interface ResourceInputs {
  name: string;
  description: string;
}

export const createResource = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

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

  return createMutation;
};

export interface LoginInput {
  name: string;
  email: string;
}

export const login = (reset: () => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => postApi("users", data),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Successful!");
      if (res?.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      reset();
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "An error occurred.");
    },
  });
};

export const deleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteApi(`resources/${id}`),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Resource deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete resource.");
    },
  });
};

export const editResource = (reset: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ResourceInputs }) =>
      putApi(`resources/${id}`, payload),
    onSuccess: (res: any) => {
      toast.success(res?.message || "Resource updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      reset();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update resource.");
    },
  });
};
