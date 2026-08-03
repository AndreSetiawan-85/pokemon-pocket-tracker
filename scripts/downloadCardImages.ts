import "dotenv/config";

import fs from "fs";
import path from "path";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({

  connectionString:
    process.env.DATABASE_URL,

});


const prisma = new PrismaClient({

  adapter,

});



const IMAGE_FOLDER =
  path.join(
    process.cwd(),
    "public/cards"
  );



async function main(){


  if(!fs.existsSync(IMAGE_FOLDER)){

    fs.mkdirSync(
      IMAGE_FOLDER,
      {
        recursive:true
      }
    );

  }



  const cards =
    await prisma.card.findMany({

      where:{

        image:{
          not:null
        }

      }

    });



  console.log(
    "Total images:",
    cards.length
  );



  for(const card of cards){


    if(!card.image)
      continue;



    const filePath =
      path.join(
        IMAGE_FOLDER,
        card.image
      );



    if(fs.existsSync(filePath)){

      continue;

    }



    const url =
      `https://raw.githubusercontent.com/${card.image}`;



    try{


      const response =
        await fetch(url);



      if(!response.ok){

        console.log(
          "Failed:",
          card.image
        );

        continue;

      }



      const buffer =
        await response.arrayBuffer();



      fs.writeFileSync(

        filePath,

        Buffer.from(buffer)

      );



      console.log(
        "Downloaded:",
        card.image
      );


    }

    catch(error){


      console.log(
        "Error:",
        card.image
      );


    }


  }



}



main()

.then(()=>{

  console.log(
    "DONE"
  );

  process.exit();

});