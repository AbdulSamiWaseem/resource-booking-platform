import { Router } from "express";
import { createBooking, listBookings, deleteBooking } from "../controllers/bookingController";

const router = Router();

router.post("/", createBooking);
router.get("/", listBookings);
router.delete("/:id", deleteBooking);

export default router;
