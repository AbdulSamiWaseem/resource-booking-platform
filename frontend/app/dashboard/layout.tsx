"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

export default function DashboardLayout({ children }: { children: ReactNode; }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (!storedUser) {
  //     router.replace("/login");
  //   } else {
  //     setCheckingAuth(false);
  //   }
  // }, [router]);

  // if (checkingAuth) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         height: "100vh",
  //       }}
  //     >
  //       <Typography>Loading...</Typography>
  //     </Box>
  //   );
  // }

  return <>{children}</>;
}
