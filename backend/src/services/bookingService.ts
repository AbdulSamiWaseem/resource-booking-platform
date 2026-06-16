import { createBooking, checkOverlap, getBookingsList, findBookingById, deleteBookingById } from "../dal/bookingDal";
import { findUserById } from "../dal/userDal";
import { findResourceById } from "../dal/resourceDal";

export const addBooking = async (
  body: { resourceId: number; userId: number; startTime: string; endTime: string },
  resp: any
) => {
  const { resourceId, userId, startTime, endTime } = body;

  const start = new Date(startTime);
  const end = new Date(endTime);

  const isSameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (!isSameDay) {
    resp.error = true;
    resp.error_message = "Booking start time and end time must be on the same day";
    return resp;
  }

  if (start < new Date()) {
    resp.error = true;
    resp.error_message = "Booking cannot be created in the past";
    return resp;
  }

  const user = await findUserById(userId);
  if (!user) {
    resp.error = true;
    resp.error_message = "User not found";
    return resp;
  }

  const resource = await findResourceById(resourceId);
  if (!resource) {
    resp.error = true;
    resp.error_message = "Resource not found";
    return resp;
  }

  const overlap = await checkOverlap(resourceId, start, end);
  if (overlap) {
    resp.error = true;
    resp.error_message = "Booking already exist for this resource in this timeslot";
    return resp;
  }

  const newBooking = await createBooking({
    resourceId,
    userId,
    startTime: start,
    endTime: end,
  });

  resp.success_message = "Booking created successfully";
  resp.data = {
    booking: newBooking,
  };

  return resp;
};

export const getBookings = async (resp: any) => {
  const bookings = await getBookingsList();

  resp.success_message = "Bookings retrieved successfully";
  resp.data = {
    bookings,
  };

  return resp;
};

export const removeBookingById = async (id: number, userId: number, resp: any) => {
  if (!userId) {
    resp.error = true;
    resp.error_message = "User ID is required";
    return resp;
  }
  const booking = await findBookingById(id);
  if (!booking) {
    resp.error = true;
    resp.error_message = "Booking not found";
    return resp;
  }
  if (booking.userId !== userId) {
    resp.error = true;
    resp.error_message = "You cannot cancel this booking";
    return resp;
  }
  await deleteBookingById(id);
  resp.success_message = "Booking cancelled successfully";
  return resp;
};



