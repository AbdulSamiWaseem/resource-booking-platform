"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { authClient } from "../services/auth-client";

export default function DashboardLayout({ children }: { children: ReactNode; }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

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
