import prisma from "@/lib/prisma";


export default async function PokemonDetailPage({

  params,

}: {

  params: Promise<{
    name: string
  }>

}) {


  const { name } = await params;


  const pokemon =
    await prisma.pokemon.findFirst({

      where: {

        name: {

          equals: name,

          mode: "insensitive"

        }

      },

      include: {

        cards: true

      }

    });



  if (!pokemon) {

    return (

      <main className="p-10">

        <h1 className="text-3xl font-bold">
          Pokémon not found
        </h1>

      </main>

    );

  }



  return (

    <main className="p-10">


      <div className="flex items-center gap-6">


        {
          pokemon.image &&

          <img

            src={pokemon.image}

            alt={pokemon.name}

            className="
              w-40
              h-40
              object-contain
            "

          />

        }



        <div>

          <h1 className="text-4xl font-bold capitalize">

            {pokemon.name}

          </h1>


          <p className="mt-2">

  Cards Available:
  {" "}
  {pokemon.cards.length}

</p>


<div className="mt-6 grid grid-cols-2 gap-4 text-sm">


  <div>
    <b>Type:</b>
    {" "}
    {pokemon.types.join(", ")}
  </div>


  <div>
    <b>Region:</b>
    {" "}
    {pokemon.region}
  </div>


  <div>
    <b>Generation:</b>
    {" "}
    {pokemon.generation}
  </div>


  <div>
    <b>Category:</b>
    {" "}
    {pokemon.category}
  </div>


  <div>
    <b>Height:</b>
    {" "}
    {pokemon.height}
  </div>


  <div>
    <b>Weight:</b>
    {" "}
    {pokemon.weight}
  </div>


  <div>
    <b>Ability:</b>
    {" "}
    {pokemon.ability}
  </div>


</div>


<p className="mt-6 text-gray-700">

  {pokemon.description}

</p>
        </div>


      </div>




      <h2 className="text-3xl font-bold mt-10">

        Pokémon TCG Pocket Cards

      </h2>




      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">


        {
          pokemon.cards.map((card)=>(


            <div

              key={card.id}

              className="
                border
                rounded-lg
                p-4
              "

            >


              <img

                src={`/cards/${card.setName}/${card.number}.webp`}

                alt={card.name}

                className="
                  w-full
                  rounded-lg
                "

              />


              <h3 className="font-bold mt-3">

                {card.name}

              </h3>


              <p>

                Series:
                {" "}
                {card.setName}

              </p>


              <p>

                Booster:
                {" "}
                {card.packName ?? "-"}

              </p>


              <p>

                Rarity:
                {" "}
                {card.rarity}

              </p>


            </div>


          ))

        }


      </div>


    </main>

  );

}