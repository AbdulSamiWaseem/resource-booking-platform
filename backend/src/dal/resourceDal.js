const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createResource = async (data) => {
  return await prisma.resource.create({
    data,
  });
};

const getAllResourcesList = async () => {
  return await prisma.resource.findMany({
    orderBy: { createdAt: "desc" },
  });
};

module.exports = {
  createResource,
  getAllResourcesList,
};
