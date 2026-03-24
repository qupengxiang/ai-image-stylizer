import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", JSON.stringify(users, null, 2));
  
  const generations = await prisma.generation.findMany();
  console.log("Generations:", JSON.stringify(generations, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
