
// import connectDB and mongoose to connect user to database, schema to database, and mongoose to make queries
import { connectDB, mongoose } from "./schema-connection.js";

// import Shoe from Shoe.js to initalize schema
import Shoe from './models/Shoe.js';

import seedDatabase from "./seed.js";

async function run() {

  // run connectDb, connecting to database, and connecting schema to database
  await connectDB();

  // All other functions run here, can use imported client to do queries  

  // Method to seed the database with default data.
  console.log("Seeding...");
  await seedDatabase();
  
  // close mongoose safely
  await mongoose.connection.close();
}

run().catch(console.dir);