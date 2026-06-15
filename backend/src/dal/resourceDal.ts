import prisma from "./prisma";

export const createResource = async (data: { name: string; description: string }) => {
  return await prisma.resource.create({
    data,
  });
};
