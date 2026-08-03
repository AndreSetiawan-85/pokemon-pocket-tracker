async function main() {

  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/291"
  );


  const species =
    await response.json();


  console.log(
    "Generation:",
    species.generation.name
  );


  console.log(
    "Region URL:",
    species.generation.url
  );

}


main();