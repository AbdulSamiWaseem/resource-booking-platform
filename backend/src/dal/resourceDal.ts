import prisma from "./prisma";

export const createResource = async (data: { name: string; description: string }) => {
  return await prisma.resource.create({
    data,
  });
};

export const findResourceById = async (id: number) => {
  return await prisma.resource.findUnique({
    where: { id },
    include: {
      bookings: {
        include: {
          user: true,
        },
        orderBy: { startTime: "asc" },
      },
    },
  });
};


export const getAllResourcesList = async () => {
  return await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });
};
