import { createBooking, checkOverlap, getBookingsList, findBookingById, deleteBookingById } from "../dal/bookingDal";
import { findUserById } from "../dal/userDal";
import { findResourceById } from "../dal/resourceDal";

export const addBooking = async (
  body: { resourceId: number; userId: number; startTime: string; endTime: string },
  resp: any
) => {
  try {
    const { resourceId, userId, startTime, endTime } = body;

    const start = new Date(startTime);
    const end = new Date(endTime);

    const isSameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate();

    if (!isSameDay) {
      return {
        error: true,
        error_message: "Booking start time and end time must be on the same day",
      };
    }

    if (start < new Date()) {
      return {
        error: true,
        error_message: "Booking cannot be created in the past",
      };
    }

    const user = await findUserById(userId);
    if (!user) {
      return {
        error: true,
        error_message: "User not found",
      };
    }

    const resource = await findResourceById(resourceId);
    if (!resource) {
      return {
        error: true,
        error_message: "Resource not found",
      };
    }

    const overlap = await checkOverlap(resourceId, start, end);
    if (overlap) {
      return {
        error: true,
        error_message: "Booking already exist for this resource in this timeslot",
      };
    }

    const newBooking = await createBooking({
      resourceId,
      userId,
      startTime: start,
      endTime: end,
    });

    return {
      ...resp,
      success_message: "Booking created successfully",
      data: {
        booking: newBooking,
      },
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      error: true,
      error_message: error.message || "Failed to create booking",
    };
  }
};

export const getBookings = async (resp: any) => {
  try {
    const bookings = await getBookingsList();

    return {
      ...resp,
      success_message: "Bookings retrieved successfully",
      data: {
        bookings,
      },
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      error: true,
      error_message: error.message || "Failed to get bookings",
    };
  }
};

export const removeBookingById = async (id: number, userId: number, resp: any) => {
  try {
    if (!userId) {
      return {
        error: true,
        error_message: "User ID is required",
      };
    }
    const booking = await findBookingById(id);
    if (!booking) {
      return {
        error: true,
        error_message: "Booking not found",
      };
    }
    if (booking.userId !== userId) {
      return {
        error: true,
        error_message: "You cannot cancel this booking",
      };
    }
    await deleteBookingById(id);
    return {
      ...resp,
      success_message: "Booking cancelled successfully",
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      error: true,
      error_message: error.message || "Failed to cancel booking",
    };
  }
};



