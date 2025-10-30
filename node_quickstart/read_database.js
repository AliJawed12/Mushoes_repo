/* read_database.js */

/*  */

import Shoe from "./models/Shoe.js";

async function readAllListings() {

  try {
    const allListings = await Shoe.find({});
    
    return allListings;
  } catch (err) {
    console.error("Error reading all listings from MongoDB: (read_database.js)", err);
  }  

  return [];
}

export default readAllListings;