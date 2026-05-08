const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const tasks = await prisma.tasks.findMany();

  console.log(tasks);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });