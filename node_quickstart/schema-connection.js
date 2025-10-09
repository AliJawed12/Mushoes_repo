/* schema-connection.js */

/* Very similar to db-connection.js. However, since using schema now, no need for client in db-connection.js, thus no need for db-connection.js file. This file just connects to database and and creates mongoose allowing for queries.*/

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri, {
      dbName: "mushoes_inventory", // connects to specific database
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongoose connected to MongoDB!");
  } catch (err) {
    console.error("Mongoose connection error:", err);
    process.exit(1); // exit the script with error code
  }
}

export { connectDB, mongoose };