import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";


export async function GET(
  request: Request
) {


  const { searchParams } =
    new URL(request.url);


  const name =
    searchParams.get("name");



  if (!name) {

    return NextResponse.json(
      {
        error: "Name is required"
      },
      {
        status: 400
      }
    );

  }



  const pokemon =
    await prisma.pokemon.findFirst({

      where: {

        name: name.toLowerCase()

      },

      include: {

        cards: true

      }

    });



  if (!pokemon) {

    return NextResponse.json(

      {
        error: "Pokemon not found"
      },

      {
        status: 404
      }

    );

  }



  const groupedSets =
    pokemon.cards.reduce(

      (result:any, card) => {


        const existingSet =
          result.find(
            (item:any) =>
              item.setName === card.setName
          );


        if (existingSet) {


          if (
            card.packName &&
            !existingSet.packs.includes(card.packName)
          ) {

            existingSet.packs.push(
              card.packName
            );

          }



          if (
            !existingSet.cards.includes(card.name)
          ) {

            existingSet.cards.push(
              card.name
            );

          }


        } else {


          result.push({

            setName: card.setName,

            packs:
              card.packName
                ? [card.packName]
                : [],

            cards: [
              card.name
            ]

          });


        }


        return result;


      },

      []

    );



  return NextResponse.json({

    id: pokemon.id,

    name: pokemon.name,

    hasCard:
      pokemon.cards.length > 0,


    totalCards:
      pokemon.cards.length,


    sets: groupedSets


  });


}