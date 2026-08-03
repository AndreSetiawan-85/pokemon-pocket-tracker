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

  console.log("Deleting old Pokemon...");

  await prisma.card.deleteMany();
  await prisma.pokemon.deleteMany();


  console.log("Fetching Pokemon...");


  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=1025"
  );


  const data = await response.json();


  let count = 0;


  for (const item of data.results) {

    const detailResponse = await fetch(
      item.url
    );


    const detail = await detailResponse.json();


    await prisma.pokemon.create({

      data: {

        id: detail.id,

        name:
          detail.name
            .charAt(0)
            .toUpperCase() +
          detail.name.slice(1),

        image:
          detail.sprites.other[
            "official-artwork"
          ].front_default,

      },

    });


    count++;


    if (count % 100 === 0) {

      console.log(
        "Imported",
        count,
        "Pokemon"
      );

    }

  }


  console.log("================");
  console.log("Pokemon imported:", count);

}


main()

.then(async () => {

  await prisma.$disconnect();

})

.catch(async (error) => {

  console.error(error);

  await prisma.$disconnect();

  process.exit(1);

});
