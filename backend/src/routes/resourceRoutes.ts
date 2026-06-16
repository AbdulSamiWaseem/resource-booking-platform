import { Router } from "express";
import { createResource, listResources, getResourceById } from "../controllers/resourceController";

const router = Router();

router.post("/", createResource);
router.get("/", listResources);
router.get("/:id", getResourceById);

export default router;
