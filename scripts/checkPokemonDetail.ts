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

  const pokemon =
    await prisma.pokemon.findUnique({
      where: {
        id: 291
      }
    });


  console.log(pokemon);


  await prisma.$disconnect();

}


main();