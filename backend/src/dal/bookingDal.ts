import prisma from "./prisma";

export const createBooking = async (data: {
  resourceId: number;
  userId: number;
  startTime: Date;
  endTime: Date;
}) => {
  return await prisma.booking.create({
    data,
    include: {
      resource: true,
      user: true,
    },
  });
};

export const checkOverlap = async (
  resourceId: number,
  startTime: Date,
  endTime: Date
) => {
  return await prisma.booking.findFirst({
    where: {
      resourceId,
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
  });
};

export const getBookingsList = async () => {
  return await prisma.booking.findMany({
    include: {
      resource: true,
      user: true,
    },
    orderBy: { startTime: "asc" },
  });
};

export const findBookingById = async (id: number) => {
  return await prisma.booking.findUnique({
    where: { id },
  });
};

export const deleteBookingById = async (id: number) => {
  return await prisma.booking.delete({
    where: { id },
  });
};



