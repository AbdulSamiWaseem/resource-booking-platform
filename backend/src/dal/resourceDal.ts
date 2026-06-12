import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createResource = async (data: { name: string; description: string }) => {
  return await prisma.resource.create({
    data,
  });
};
