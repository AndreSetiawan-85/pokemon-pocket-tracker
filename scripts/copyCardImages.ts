import fs from "fs";
import path from "path";

import cards from "pokemon-tcg-pocket-database/dist/cards.json";



const SOURCE_FOLDER =
  path.join(
    process.cwd(),
    "node_modules/pokemon-tcg-pocket-database/dist/images"
  );


const TARGET_FOLDER =
  path.join(
    process.cwd(),
    "public/cards"
  );



function main(){


  if(!fs.existsSync(TARGET_FOLDER)){

    fs.mkdirSync(
      TARGET_FOLDER,
      {
        recursive:true
      }
    );

  }



  let copied = 0;
  let failed = 0;



  for(const card of cards){


    if(!card.image){

      continue;

    }



    const source =
      path.join(
        SOURCE_FOLDER,
        card.image
      );


    const target =
      path.join(
        TARGET_FOLDER,
        card.image
      );



    if(fs.existsSync(source)){


      fs.copyFileSync(
        source,
        target
      );


      copied++;


    } else {


      console.log(
        "Missing:",
        card.image
      );


      failed++;


    }


  }



  console.log("================");

  console.log(
    "Copied:",
    copied
  );


  console.log(
    "Missing:",
    failed
  );


}



main();