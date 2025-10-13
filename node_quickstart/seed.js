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
  {name: "LeBron 20", brand: "Nike", size: 10, gender: "M", color: ["Black", "Gold"], condition: "Used", price: 18999, stock: 5, description: `The 20th anniversry of the "Chosen One's" signature shoe`, images: []},
];


async function seedDatabase() {
  // create an empty set
  const uniqueEntries = new Set();

  for (const listing of dataToSeed) {
    console.log("Storing unique ID:")
    let mushoesUniqueId = "";

    // create brandPart of uniqueID
    let mushoesIDBrand = listing.brand.toLowerCase().replace(/\s+/g, '');

    // create name part of unique id
    let mushoesIDName = "";
    if (listing.name.length >= 5) {
      mushoesIDName = listing.name.substring(0, 5).toLowerCase().replace(/\s+/g, '');
    }
    else {
      mushoesIDName = listing.name.toLowerCase().replace(/\s+/g, '');
    }

    let mushoesIDSize = listing.size;

    let mushoesIDColors = "";
    if (listing.color && listing.color.length > 0) {
      // Sort colors for consistency, then join with hyphen or comma
      mushoesIDColors = listing.color.map(c => c.toLowerCase().replace(/\s+/g, '')).sort().join("-");
    }

    let mushoesIDCondition = listing.condition.trim().toLowerCase().replace(/\s+/g, '');
    let mushoesIDGender = listing.gender.toLowerCase().replace(/\s+/g, '');

    mushoesUniqueId = `${mushoesIDBrand}-${mushoesIDName}-${mushoesIDCondition}-${mushoesIDColors}-${mushoesIDSize}-${mushoesIDGender}`;

    
    

    console.log(`${mushoesUniqueId}`);
    if (uniqueEntries.has(mushoesUniqueId)) {
      console.log("Listing already exists");
    }
    else {
      uniqueEntries.add(mushoesUniqueId);
      await Shoe.insertOne(listing);
    }
  }


}

export default seedDatabase;