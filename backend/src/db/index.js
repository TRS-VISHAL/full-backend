import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

// Connect to MongoDB

const connectDb = async() => {
  try {
  const db = await mongoose
      .connect(`${process.env.MONGO_URI}/${DB_NAME}`)
      console.log("MongoDB Connected...")
               console.log(`connection established with ${db.connection.host}`)
      
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};


export {
      connectDb
}