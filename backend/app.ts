import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes";
import resourceRoutes from "./src/routes/resourceRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/resources", resourceRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Resource management backend is running",
  });
});

export default app;
