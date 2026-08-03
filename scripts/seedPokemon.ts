import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});


const prisma = new PrismaClient({
  adapter,
});



function capitalize(text:string) {

  return text
    .split("-")
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

}



function getRegion(generation:string) {

  const regions:Record<string,string> = {

    "generation-i":
      "Kanto",

    "generation-ii":
      "Johto",

    "generation-iii":
      "Hoenn",

    "generation-iv":
      "Sinnoh",

    "generation-v":
      "Unova",

    "generation-vi":
      "Kalos",

    "generation-vii":
      "Alola",

    "generation-viii":
      "Galar",

    "generation-ix":
      "Paldea",

  };


  return (
    regions[generation]
    ?? null
  );

}



async function getEvolutionChain(url:string) {


  const response =
    await fetch(url);


  const data =
    await response.json();



  const names:string[] = [];



  function walk(node:any) {


    if(node?.species?.name) {

      names.push(
        capitalize(
          node.species.name
        )
      );

    }


    for(
      const next of node.evolves_to
    ) {

      walk(next);

    }

  }



  walk(data.chain);



  return names.join(
    " → "
  );

}



async function main() {


  console.log(
    "Deleting old Pokemon..."
  );


  await prisma.pokemon.deleteMany();



  console.log(
    "Fetching Pokemon list..."
  );



  const response =
    await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1025"
    );



  const data =
    await response.json();



  let count = 0;



  for(
    const item of data.results
  ) {


    const detailResponse =
      await fetch(
        item.url
      );


    const detail =
      await detailResponse.json();



    const speciesResponse =
      await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${detail.id}`
      );


    const species =
      await speciesResponse.json();



    const evolution =
      await getEvolutionChain(
        species.evolution_chain.url
      );



    const types =
      detail.types.map(
        (t:any) =>
          capitalize(
            t.type.name
          )
      );



    const abilities =
      detail.abilities.map(
        (a:any) =>
          capitalize(
            a.ability.name
          )
      );



    const category =
      species.genera.find(
        (g:any) =>
          g.language.name === "en"
      )?.genus
      ?? null;



    const description =
      species.flavor_text_entries.find(
        (f:any) =>
          f.language.name === "en"
      )
      ?.flavor_text
      ?.replace(/\n/g," ")
      ?.replace(/\f/g," ")
      ??
      null;



    await prisma.pokemon.create({

      data: {

        id:
          detail.id,


        name:
          capitalize(
            detail.name
          ),


        image:
          detail
            .sprites
            .other[
              "official-artwork"
            ]
            .front_default,



        types,


        region:
          getRegion(
            species.generation.name
          ),



        generation:
          capitalize(
            species.generation.name
          ),



        category,


        evolution,


        height:
          `${detail.height / 10} m`,



        weight:
          `${detail.weight / 10} kg`,



        ability:
          abilities.join(
            ", "
          ),



        description,


      }

    });



    count++;



    if(
      count % 50 === 0
    ) {

      console.log(
        "Imported",
        count,
        "Pokemon"
      );

    }


  }



  console.log("================");
  console.log(
    "Pokemon imported:",
    count
  );


}



main()

.then(
  async () => {

    await prisma.$disconnect();

  }
)

.catch(
  async(error)=>{

    console.error(error);

    await prisma.$disconnect();

    process.exit(1);

  }
);
