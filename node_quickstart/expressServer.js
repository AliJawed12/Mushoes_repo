import express from 'express';
const app = express();
const port = 5000;

// cloudinary
import multer from "multer";
import Shoe from "./models/Shoe.js";

const storage = multer.diskStorage({
  destination: "temp_image_uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.use(express.static('public_frontend'));
app.use(express.json());

import { connectDB, mongoose } from "./schema-connection.js";
import { seedDatabaseExpress } from './seed.js';

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


/*
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
})
*/

// connect to mongodb first, then start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    })
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();