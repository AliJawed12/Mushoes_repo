/* index.js */

import { connectDB, client } from "./db-connection.js";

async function run() {
  // run connectDB
  await connectDB();
  // All other functions run here, can use imported client to do queries

  
  
  // close client
  await client.close();
}

run().catch(console.dir);