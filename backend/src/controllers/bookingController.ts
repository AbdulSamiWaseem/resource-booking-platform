import { Request, Response } from "express";
import { addBooking } from "../services/bookingService";
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
