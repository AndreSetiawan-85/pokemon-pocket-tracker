import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});


const prisma = new PrismaClient({
  adapter,
});


async function main() {

  const cards =
    await prisma.card.count();


  console.log(
    "Cards count:",
    cards
  );


  await prisma.$disconnect();

}


main();