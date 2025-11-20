/* mongo_db_express_queries */

/* File containing helper functions/scripts which Express uses to run queries/operations on the MonogDB database */

import Shoe from "./models/Shoe.js";

// Helper function for "/admin/dashboard/view_deletable_listings" route. When called displays all listings from MongoDB
async function readAllListings() {

  try {
    const allListings = await Shoe.find({});
    
    return allListings;
  } catch (err) {
    console.error("Error reading all listings from MongoDB: (read_database.js)", err);
  }  

  return [];
}


// Helper function for "/admin/dashboard/delete_listing", called in route to delete a listing from MongoDB
async function deleteAListing(listingMongoID) {
  try {
    const deleteListing = await Shoe.deleteOne({ _id: listingMongoID });
    console.log(deleteListing);
  }
  catch (err) {
    console.error("Error while deleting a listing from MongoDB: (read_database.js)", err);
  }
}


// Helper function for customer query to grab data for a listing
// called by product.html page to showcase a shoe's details
async function findAListing(listingMongoID) {

  try {
    const findListing = await Shoe.findOne({_id: listingMongoID});
    console.log(findListing);
    return findListing;
  } 
  catch (err) {
    console.error("Error whileing a listing from MongoDB: (mongo_db_express_queries.js)");
  }
  
}

export { readAllListings, deleteAListing, findAListing };