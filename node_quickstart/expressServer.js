// expressServer.js
import express from 'express';
const app = express();
const port = 5000;

// host frontend in backend server by grabbing all static files from public_frontend folder
app.use(express.static('public_frontend'));
app.use(express.json());

// import connectDB to connect to mongoDB, importing mongoose as well, but shouldn't be used since 
// won't be closing mongoose connection like I did in index.js when conencting with node.js
import { connectDB, mongoose } from "./schema-connection.js";

// import Shoe to be able to add listings to schema
import Shoe from "./models/Shoe.js";

// import multer to be able to use for image file processing
import multer from "multer";


// code to process image files from "/admin/dashboard/upload_listing" endpoint allowing for image publishing on cloudinary
const storage = multer.diskStorage({
  destination: "temp_image_uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// route allowing admin to publish a listing from admin-dashboard-munhak.html file to database
app.post("/admin/dashboard/upload_listing", upload.array("images"), async (req, res) => {
  try {
    // Parse JSON from FormData
    const listing = JSON.parse(req.body.listing);
    console.log("I think server received:", listing);

    // Add paths to listing.images
    listing.images = req.files.map(file => file.path);

    // Save to database
    const shoe = new Shoe(listing);
    await shoe.save();

    res.status(201).json({ message: "Listing uploaded successfully!", shoe });
  } catch (err) {
    console.error("Error while uploading listing:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


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