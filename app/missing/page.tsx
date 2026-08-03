import { getPokemonList } from "@/lib/pokemon";
import { tcgPocketCards } from "@/data/tcgPocket";


export default async function MissingPage(){

  const pokemon = await getPokemonList();


  const missingPokemon = pokemon.filter(
    (item:any)=>
      !tcgPocketCards.some(
        card =>
          card.pokemon.toLowerCase()
          === item.name.toLowerCase()
      )
  );


  return (

    <main className="p-10">

      <h1 className="text-4xl font-bold">
        Pokémon Tanpa Kartu TCG Pocket
      </h1>


      <div className="mt-8">

      {
        missingPokemon.map(
          (item:any)=>(

          <div
            key={item.id}
            className="border p-4 mb-3 rounded"
          >

            #{item.id} {item.name}

          </div>

        ))
      }

      </div>

    </main>

  )

}