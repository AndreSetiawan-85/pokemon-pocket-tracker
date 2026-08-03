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
    await prisma.pokemon.findMany({

      orderBy:{
        id:"asc"
      },

      include:{
        cards:true
      }

    });



  const missing =
    pokemon.filter(
      p => p.cards.length === 0
    );



  console.log(
    "TOTAL REAL MISSING:",
    missing.length
  );


  console.log("====================");


  for(const p of missing){

    console.log(
      `${p.id}\t${p.name}`
    );

  }


}



main()

.then(async()=>{

  await prisma.$disconnect();

})

.catch(async(err)=>{

  console.error(err);

  await prisma.$disconnect();

  process.exit(1);

});