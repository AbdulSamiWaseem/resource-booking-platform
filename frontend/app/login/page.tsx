"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardContent, TextField, Button, Stack } from "@mui/material";
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
      <Card variant="outlined" className="w-full max-w-md bg-white">
        <CardHeader
          title="Resource Booking Platform"
        />
        <CardContent>
          <form onSubmit={handleSubmit(handleOnSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Name"
                type="text"
                placeholder="Enter your name"
                fullWidth
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                label="Email"
                type="email"
                placeholder="Enter your email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loginMutation.isPending}
                sx={{ py: 1, textTransform: "none" }}
              >
                {loginMutation.isPending ? "Submitting..." : "Submit"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
      <DevTool control={control} />
    </div>
  );
}
