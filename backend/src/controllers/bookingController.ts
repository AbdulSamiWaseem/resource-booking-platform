import { Request, Response } from "express";
import { addBooking, getBookings, removeBookingById } from "../services/bookingService";
import { handleResponse } from "../utils/responseHandler";
import { validateBooking } from "../validation/booking";

export const createBooking = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: addBooking,
      validationFn: validateBooking,
      handlerParams: [req.body],
      successMessage: "Booking created successfully!",
    },
    req,
    res
  );
};

export const listBookings = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getBookings,
      handlerParams: [],
      successMessage: "Bookings retrieved successfully!",
    },
    req,
    res
  );
};

export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  await handleResponse(
    {
      handler: removeBookingById,
      handlerParams: [Number(id)],
      successMessage: "Booking cancelled successfully!",
    },
    req,
    res
  );
};



