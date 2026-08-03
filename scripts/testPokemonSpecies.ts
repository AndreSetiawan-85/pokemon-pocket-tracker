import "dotenv/config";


async function main() {


  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/291"
  );


  const species =
    await response.json();



  console.log("====================");


  console.log(
    "Name:",
    species.name
  );


  console.log(
    "Generation:",
    species.generation.name
  );


  console.log(
    "Category:"
  );


  console.log(
    species.genera.find(
      (g:any) =>
        g.language.name === "en"
    )?.genus
  );



  console.log(
    "Flavor Text:"
  );


  console.log(
    species.flavor_text_entries.find(
      (f:any) =>
        f.language.name === "en"
    )?.flavor_text
  );



  console.log(
    "Evolution Chain:"
  );


  console.log(
    species.evolution_chain.url
  );



  console.log("====================");

}


main();