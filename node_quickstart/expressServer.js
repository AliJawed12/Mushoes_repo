import express from 'express';
const app = express();
const port = 5000;

app.use(express.static('public_frontend'));
app.use(express.json());

import { connectDB, mongoose } from "./schema-connection.js";
import { seedDatabaseExpress } from './seed.js';

app.post('/admin/dashboard/upload_listing', async (req, res) => {
  try {
    const listing = req.body.listing; // frontend sends { listing: {...} }
    console.log("I think server received:", listing);

    await seedDatabaseExpress(listing); // ensure MongoDB operation finishes

    res.status(200).json({ message: "Listing uploaded successfully!" });
  } catch (err) {
    console.error("Error while uploading listing:", err);
    res.status(500).json({ message: "Server error", error: err });
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