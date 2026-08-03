import "dotenv/config";


async function main() {


  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/291"
  );


  const detail = await response.json();



  console.log("====================");

  console.log(
    "ID:",
    detail.id
  );


  console.log(
    "Name:",
    detail.name
  );


  console.log(
    "Types:"
  );


  console.log(
    detail.types.map(
      (t:any) => t.type.name
    )
  );



  console.log(
    "Height:",
    detail.height / 10,
    "m"
  );


  console.log(
    "Weight:",
    detail.weight / 10,
    "kg"
  );



  console.log(
    "Abilities:"
  );


  console.log(
    detail.abilities.map(
      (a:any) =>
        a.ability.name
    )
  );


  console.log("====================");


}


main();