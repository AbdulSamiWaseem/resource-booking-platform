import { Router } from "express";
import { createBooking, listBookings } from "../controllers/bookingController";

const router = Router();

router.post("/", createBooking);
router.get("/", listBookings);

export default router;
