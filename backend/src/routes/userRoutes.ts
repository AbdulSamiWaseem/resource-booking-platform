import { Router } from "express";
import { findOrCreateUser } from "../controllers/userController";

const router = Router();

router.post("/", findOrCreateUser);

export default router;
