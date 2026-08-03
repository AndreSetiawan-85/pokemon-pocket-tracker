import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import cards from "pokemon-tcg-pocket-database/dist/cards.json";


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});


const prisma = new PrismaClient({
  adapter,
});


function normalize(name: string) {

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/♀/g, "-f")
    .replace(/♂/g, "-m")
    .replace(/ ex$/i, "")
    .replace(/['’.]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();

}


/*
  HANYA mapping nama kartu -> Pokemon ID
  yang memang berbeda nama.

  Jangan masukkan:
  ninjask -> greninja
  volcanion -> volcarona
  dragapult -> dragalge
  eternatus -> natu

  karena itu Pokemon berbeda.
*/


const missingOnlyMapping: Record<string, number> = {

  // ID 386
  "deoxys": 386,

  // ID 413
  "wormadam": 413,

  // ID 487
  "giratina": 487,

  // ID 492
  "shaymin": 492,

  // ID 550
  "basculin": 550,

  // ID 555
  "darmanitan": 555,

  // ID 592
  "frillish": 592,

  // ID 593
  "jellicent": 593,

  // ID 641
  "tornadus": 641,

  // ID 642
  "thundurus": 642,

  // ID 645
  "landorus": 645,

  // ID 647
  "keldeo": 647,

  // ID 648
  "meloetta": 648,

  // ID 668
  "pyroar": 668,

  // ID 678
  "meowstic": 678,

  // ID 681
  "aegislash": 681,

  // ID 710
  "pumpkaboo": 710,

  // ID 711
  "gourgeist": 711,

  // ID 718
  "zygarde": 718,

  // ID 721
  "volcanion": 721,

  // ID 741
  "oricorio": 741,

  // ID 745
  "lycanroc": 745,

  // ID 746
  "wishiwashi": 746,

  // ID 774
  "minior": 774,

  // ID 778
  "mimikyu": 778,

  // ID 849
  "toxtricity": 849,

  // ID 862
  "galarian-obstagoon": 862,

  // ID 863
  "galarian-perrserker": 863,

  // ID 864
  "galarian-cursola": 864,

  // ID 865
  "sirfetchd": 865,

  // ID 866
  "galarian-mr-rime": 866,

  // ID 875
  "eiscue": 875,

  // ID 876
  "indeedee": 876,

  // ID 877
  "morpeko": 877,

  // ID 892
  "single-strike-urshifu": 892,

  // ID 902
  "basculegion": 902,

  // ID 905
  "enamorus": 905,

  // ID 916
  "oinkologne": 916,

  // ID 925
  "maushold": 925,

  // ID 931
  "squawkabilly": 931,

  // ID 964
  "palafin": 964,

  // ID 978
  "tatsugiri": 978,

  // ID 980
  "paldean-clodsire": 980,

  // ID 982
  "dudunsparce": 982,

  // ID 1017
  "teal-mask-ogerpon": 1017,
  "hearthflame-mask-ogerpon": 1017,
  "wellspring-mask-ogerpon": 1017,
  "cornerstone-mask-ogerpon": 1017,

};



async function main() {


  console.log("Loading Pokemon...");


  const pokemon =
    await prisma.pokemon.findMany();



  console.log(
    `Pokemon loaded: ${pokemon.length}`
  );



  const pokemonMap =
    new Map<string, number>();



  for (const p of pokemon) {

    pokemonMap.set(
      normalize(p.name),
      p.id
    );

  }



  console.log(
    "Deleting old cards..."
  );


  await prisma.card.deleteMany();



  console.log(
    `Importing ${cards.length} cards...`
  );



  let imported = 0;

  let skipped = 0;


  const skippedNames:string[] = [];



  for (const card of cards) {


    const cardKey =
      normalize(card.name);



    /*
      PRIORITAS 1:
      EXACT MATCH

      Contoh:
      Venusaur ex
      -> venusaur

      Flabébé
      -> flabebe untuk lookup
    */


    let pokemonId =
      pokemonMap.get(cardKey);



    /*
      PRIORITAS 2:
      mapping khusus
    */


    if (!pokemonId) {

      pokemonId =
        missingOnlyMapping[cardKey];

    }



    if (!pokemonId) {

      skipped++;


      if (skippedNames.length < 100) {

        skippedNames.push(
          card.name
        );

      }


      continue;

    }



    await prisma.card.create({

      data: {

        name:
          card.name,

        rarity:
          card.rarity,

        image:
          card.image,

        setName:
          card.set,

        number:
          card.number,

        packName:
          card.packs?.[0] ?? null,

        pokemonId,

      }

    });



    imported++;



    if (imported % 100 === 0) {

      console.log(
        `Imported ${imported} cards`
      );

    }

  }



  console.log("================");

  console.log(
    "Imported:",
    imported
  );


  console.log(
    "Skipped:",
    skipped
  );


  console.log(
    "Skipped examples:"
  );


  console.log(
    skippedNames
  );


  console.log("Done");


}



main()

.then(async () => {

  await prisma.$disconnect();

})

.catch(async (err) => {

  console.error(err);

  await prisma.$disconnect();

  process.exit(1);

});