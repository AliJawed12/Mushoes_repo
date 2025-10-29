/* Seed.js */

/* A file that is supposed to run once populating database with all shoe listings */

import Shoe from "./models/Shoe.js";

/*
Format to enter a shoe listing

{name: "", brand: "", size: , gender: "", color: [], condition: "", price: , stock: , description: ``, images: []},

- for any variables that don't have "", they are numebrs
- for price enter price in pennies
*/

const dataToSeed = [
  {name: "Bondi 8", brand: "Hoka", size: 10, gender: "M", color: ["Beige"], condition: "New", price: 12999, stock: 1, description: `A comfortable street wear style shoe desigined to give the wearer relievement from Plantar Fascitis pain while maintiaing the street wear look.`, images: []},

  {name: "Bondi 9", brand: "Hoka", size: 9, gender: "F", color: ["Violet", "White"], condition: "Like New", price: 14999, stock: 1, description: `An imrovement in every facet on the Hoka Bondi 8`, images: []},

  {name: "LeBron 20", brand: "Nike", size: 10, gender: "M", color: ["Black", "Gold"], condition: "Used", price: 18999, stock: 5, description: `The 20th anniversry of the "Chosen One's" signature shoe`, images: ["../images/mushoes-logo.png"]}
];


async function seedDatabase() {

  for (const listing of dataToSeed) {
    const tempShoe = new Shoe(listing);
    const existsInDB = await Shoe.findOne({mushoes_custom_id: tempShoe.mushoes_custom_id});

    if (existsInDB) {
      // can remove this comment once published
      console.log(`mushoes_custom_id: ${tempShoe.mushoes_custom_id} Already Exists...`);
    }
    else {
      await tempShoe.save();
      // can remove this comment once published
      console.log(`mushoes_custom_id: ${tempShoe.mushoes_custom_id} inserted into database!`);
    }
  }

  console.log("Seeding Complete...");

}

// function for express routes to add a listing
async function seedDatabaseExpress(newAdminListing) {


  const tempShoe = new Shoe(newAdminListing);
  const existsInDB = await Shoe.findOne({mushoes_custom_id: tempShoe.mushoes_custom_id});

  if (existsInDB) {
    // can remove this comment once published
    console.log(`mushoes_custom_id: ${tempShoe.mushoes_custom_id} Already Exists...`);
  }
  else {
    await tempShoe.save();
    // can remove this comment once published
    console.log(`mushoes_custom_id: ${tempShoe.mushoes_custom_id} inserted into database!`);
  }


  console.log("Seeding Complete...");

}

// this used to be express default seedDatabase, changed to what it is now, likely cause of errors
export {seedDatabase, seedDatabaseExpress};