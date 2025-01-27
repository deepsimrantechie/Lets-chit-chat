import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DATABASE CONNECTED");
    });

    // Remove the deprecated options
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("Error occurred in database:", error);
  }
};

export default connectDB;
