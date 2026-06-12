import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Resource management backend is running",
  });
});

export default app;
