import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Verify database connection
prisma.$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (data: { name: string; email: string }) => {
  return await prisma.user.create({
    data,
  });
};
