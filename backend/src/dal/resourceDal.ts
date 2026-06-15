import prisma from "./prisma";

export const createResource = async (data: { name: string; description: string }) => {
  return await prisma.resource.create({
    data,
  });
};

export const getAllResourcesList = async () => {
  return await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });
};
