const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createResource = async (data) => {
  return await prisma.resource.create({
    data,
  });
};

module.exports = {
  createResource,
};
