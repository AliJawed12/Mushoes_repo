/* db-connection.js */

/* creates client allowing for CRUD operations. However, since schema exists now, had to use mongoose instead. This is still usbale, in index,js just need to import this at the top 
//import { connectDB, client } from "./db-connection.js";
and inside the run function need to run this first thing 
// await connectDB();
// */


import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version (customize client)
const client = new MongoClient(uri,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

async function connectDB() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // connectDB method awaits in index.js, return client for use there
    return client;
  } finally {
    console.log("Client exported to index.js to safely use for queries")
  }
}

export {client, connectDB};