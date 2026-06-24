import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes";
import resourceRoutes from "./src/routes/resourceRoutes";
import bookingRoutes from "./src/routes/bookingRoutes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/utils/auth";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.all("/api/auth/*", toNodeHandler(auth));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Resource management backend is running",
  });
});

export default app;
