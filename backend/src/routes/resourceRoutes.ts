import { Router } from "express";
import { createResource } from "../controllers/resourceController";

const router = Router();

router.post("/", createResource);

export default router;
