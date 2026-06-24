"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { authClient } from "../services/auth-client";

export default function DashboardLayout({ children }: { children: ReactNode; }) {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      redirect("/login");
    }
  }, [isPending, session]);

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
