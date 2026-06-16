import { Router } from "express";
import { createResource, listResources } from "../controllers/resourceController";

const router = Router();

router.post("/", createResource);
router.get("/", listResources);

export default router;
