export async function getPokemonList() {

  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151"
  );

  const data = await response.json();


  const pokemonDetail = await Promise.all(

    data.results.map(async (pokemon:any)=>{

      const detailResponse = await fetch(
        pokemon.url
      );

      const detail = await detailResponse.json();


      return {
        id: detail.id,
        name: detail.name,
        image:
          detail.sprites.other["official-artwork"].front_default,

        types:
          detail.types.map(
            (type:any)=>type.type.name
          )
      };

    })

  );


  return pokemonDetail;

}