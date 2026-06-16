import { Router } from "express";
import { createResource, listResources, getResourceById, removeResource, editResource } from "../controllers/resourceController";

const router = Router();

router.post("/", createResource);
router.get("/", listResources);
router.get("/:id", getResourceById);
router.delete("/:id", removeResource);
router.put("/:id", editResource);

export default router;
