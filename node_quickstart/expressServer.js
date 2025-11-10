// expressServer.js
/* Contains all routes, endpoints needed to have connectivity between frontend and backend as well as routes needed to perform opeartions between frontend and backend, and backend and frontend */

// Express Imports here
import express from 'express';
const app = express();
const port = 5000;

//--------------------------------
// Admin Frontend Authentication
//--------------------------------

// Get ADMIN_USER and ADMIN_PASS from .env: This is authentication for admin-dashboard frontend page access
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

// import basic authentication to protect admin-dashboard frontend pages
import basicAuth from 'express-basic-auth';

// add authentication to any route which has /admin
app.use('/admin', basicAuth({
  users: { [ADMIN_USER]: ADMIN_PASS },
  challenge: true // triggers the browsers login prompt
}));

// host frontend in backend server by grabbing all static files from public_frontend folder
app.use(express.static('public_frontend'));
app.use(express.json());

//----------
// Imports
//----------

// import connectDB to connect to mongoDB, importing mongoose as well, but shouldn't be used since 
// won't be closing mongoose connection like I did in index.js when conencting with node.js
import { connectDB, mongoose } from "./schema-connection.js";

// import Shoe to be able to add listings to schema
import Shoe from "./models/Shoe.js";

// import read_database to read all data from MongoDB
import { readAllListings, deleteAListing } from './mongo_db_express_queries.js';

//----------------------------------
// Image Processing Functionality
//----------------------------------

// Need this for "/admin/dashboard/upload_listing", when adding images from computer storage to allow for hosting to cloud 

// import multer to be able to use for image file processing for "/admin/dashboard/upload_listing"
import multer from "multer";
// code to process image files from "/admin/dashboard/upload_listing" endpoint allowing for image publishing on cloudinary
const storage = multer.diskStorage({
  destination: "temp_image_uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


//---------
// Routes
//---------

// route allowing admin to publish a listing from admin-dashboard-munhak.html file to database
app.post("/admin/dashboard/upload_listing", upload.array("images"), async (req, res) => {
  try {
    // Parse JSON from FormData
    const listing = JSON.parse(req.body.listing);
    console.log("Server received:", listing);

    // Add paths to listing.images
    listing.images = req.files.map(file => file.path);

    // Save to database
    const shoe = new Shoe(listing);
    await shoe.save();

    res.status(201).json({ message: "Listing uploaded successfully!", shoe });
  } catch (err) {
    console.error("Error while uploading listing:", err);
    res.status(500).json({ message: "Server error while uploading listing", error: err.message });
  }
});

// route to allow admin to view all listings currently within the MongoDB database, used for deleting
app.get("/admin/dashboard/view_deletable_listings", async (req, res) => {

  try {

    const allListings = await readAllListings();
    res.status(200).json({message: "Listings read succesfully from MongoDB!", listings: allListings});
  }
  catch (err) {
    console.error("Error while reading listings in ExpressServer.js", err);
    res.status(500).json({message: "Server Error while reading all listings", error: err.message});
  }
}); 

// Helper route to "/admin/dashboard/delete_listing", once a listing is clicked,
// and deletion is confirmed, this route is called to send the MongoDB to delete
app.post("/admin/dashboard/delete_listing", async (req, res) => {
  try {
    const listingMongoID = req.body.mongoID;
    console.log(`Deleting ${listingMongoID} `);
    const deletionConfirmation = await deleteAListing(listingMongoID);
    res.status(200).json({message: "Listing Deleted Succesfully!", listing: listingMongoID});
  }
  catch (err) {
    console.error("Error while deleting listing in ExpressServer.js", err);
    res.status(500).json({message: "Server Error while deleting a listing", error: err.message});
  }
});

// route to allow admin to view all listings currently within the MongoDB database
app.get("/admin/dashboard/view_all_listings", async (req, res) => {

  try {

    const allListings = await readAllListings();
    res.status(200).json({message: "Listings read succesfully from MongoDB!", listings: allListings});
  }
  catch (err) {
    console.error("Error while reading listings in ExpressServer.js", err);
    res.status(500).json({message: "Server Error while reading all listings", error: err.message});
  }
}); 


//---------------------
// Running the Server
//---------------------

// connect to mongodb first, then start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();