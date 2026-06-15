import { createBooking, checkOverlap } from "../dal/bookingDal";

export const addBooking = async (
  body: { resourceId: number; userId: number; startTime: string; endTime: string },
  resp: any
) => {
  const { resourceId, userId, startTime, endTime } = body;

  const start = new Date(startTime);
  const end = new Date(endTime);

  const overlap = await checkOverlap(resourceId, start, end);
  if (overlap) {
    resp.error = true;
    resp.error_message = "Booking already exist for this resource";
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
