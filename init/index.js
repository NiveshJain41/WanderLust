const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    // Clear existing listings
    await Listing.deleteMany({});
    console.log("Existing listings cleared");

    // Find an existing user or create a default one
    let defaultUser = await User.findOne();
    
    if (!defaultUser) {
      // Create a default user if none exists
      defaultUser = new User({
        username: "defaultUser",
        email: "default@example.com",
        // Add any other required fields based on your User schema
      });
      await defaultUser.save();
      console.log("Default user created");
    }

    // Map the data and extract image URL from the object
    const processedData = initData.data.map((obj) => ({
      ...obj,
      owner: defaultUser._id,
    }));
    

    // Insert the processed data
    await Listing.insertMany(processedData);
    console.log("Data was initialized successfully");
    
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

initDB();