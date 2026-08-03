import prisma from "@/lib/prisma";
import PokemonTabs from "@/components/PokemonTabs";

export default async function PokemonPage() {

  const pokemon =
    await prisma.pokemon.findMany({

      include: {

        _count: {

          select: {

            cards: true,

          },

        },

      },

      orderBy: {

        id: "asc",

      },

    });

  const data =
  pokemon.map((item) => ({

      id: item.id,

      name: item.name,

      image: item.image,

      types: item.types,

      region: item.region,

      generation: item.generation,

      category: item.category,

      evolution: item.evolution,

      height: item.height,

      weight: item.weight,

      ability: item.ability,

      description: item.description,

      cardCount: item._count.cards,

  }));

  return (

    <main className="p-10">

      <h1 className="text-4xl font-bold">

        Pokémon TCG Pocket Tracker

      </h1>

      <p className="mt-3 text-gray-600">

        Compare Pokémon with available Pokémon TCG Pocket cards and missing cards.

      </p>

      <PokemonTabs
        pokemon={data}
      />

    </main>

  );

}