import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
