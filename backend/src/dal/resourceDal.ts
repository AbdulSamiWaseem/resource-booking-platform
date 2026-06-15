import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createResource = async (data: { name: string; description: string }) => {
  return await prisma.resource.create({
    data,
  });
};

export const findResourceById = async (id: number) => {
  return await prisma.resource.findUnique({
    where: { id },
  });
};

export const getAllResourcesList = async () => {
  return await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });
};
