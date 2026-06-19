"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, LoginInput } from "../services/mutation";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
});
export default function Login() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();
  const form = useForm<LoginInput>({
    resolver: zodResolver(schema),
  });
  const { register, control, handleSubmit, formState, reset } = form;
  const { errors } = formState;


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      router.replace("/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const loginMutation = login();

  const handleOnSubmit = (data: LoginInput) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-white text-black">
      <h1 className="text-2xl font-bold mb-6">Resource Booking Platform</h1>
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(handleOnSubmit)} noValidate className="space-y-4">
          <div className="flex flex-col gap-1">
            <div>
              Name
            </div>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your name"
              className="w-full p-2 border border-gray-300 rounded text-black bg-white"
            />
            <p className="text-red-500 text-xs">{errors.name?.message}</p>
          </div>

          <div className="flex flex-col gap-1">
            <div>
              Email
            </div>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded text-black bg-white"
            />
            <p className="text-red-500 text-xs">{errors.email?.message}</p>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-500 text-white p-2 rounded cursor-pointer disabled:opacity-50"
          >
            {loginMutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <DevTool control={control} />
    </div>
  );
}
