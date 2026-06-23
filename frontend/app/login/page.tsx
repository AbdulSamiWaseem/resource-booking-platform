"use client";

import { useState, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, TextField, Button, Stack, Box, Typography, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authClient } from "../services/auth-client";
import { toast } from "react-hot-toast";
import Link from "next/link";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export default function Login() {
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(schema),
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session) {
      redirect("/dashboard");
    }
  }, [session]);

  const handleOnSubmit = async (data: any) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
    }, {
      onRequest: () => {
        setSubmitting(true);
      },
      onSuccess: () => {
        toast.success("Successfully logged in");
        reset();
        router.push("/dashboard");
      },
      onError: (ctx) => {
        toast.error(ctx.error.message || "Sign in failed");
        setSubmitting(false);
      }
    });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5">Resource Booking Platform</Typography>
      <Card variant="outlined" className="w-full max-w-md">
        <CardContent>
          <form onSubmit={handleSubmit(handleOnSubmit)} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                placeholder="Enter your email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message as string}
              />

              <TextField
                label="Password"
                type="password"
                placeholder="Enter your password"
                fullWidth
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={submitting}
                sx={{ py: 1, textTransform: "none" }}
              >
                {submitting ? "Signing In..." : "Sign In"}
              </Button>

              <Link href="/signup">
                <Button fullWidth sx={{ textTransform: "none" }}>
                  Don't have an account? Sign Up
                </Button>
              </Link>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
