const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Verify database connection
prisma.$connect()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const createUser = async (data) => {
  return await prisma.user.create({
    data,
  });
};

module.exports = {
  findUserByEmail,
  createUser,
};
