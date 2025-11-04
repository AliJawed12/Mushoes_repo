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

async function deleteAListing(listingMongoID) {
  try {
    const deleteListing = await Shoe.deleteOne({ _id: listingMongoID });
    console.log(deleteListing);
  }
  catch (err) {
    console.error("Error while deleting a listing from MongoDB: (read_database.js)", err);
  }
}

export { readAllListings, deleteAListing };