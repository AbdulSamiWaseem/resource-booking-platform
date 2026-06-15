import prisma from "./prisma";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: { name: string; email: string }) => {
  return await prisma.user.create({
    data,
  });
};
