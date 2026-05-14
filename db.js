import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ConnectDB = async ()=>{
  try {
    const MongoDB = await mongoose.connect(process.env.MONGODB_URI)
    console.log("Database Connected")
  } catch (error) {
    console.log("Can't Connect the database..")
    console.log(error)
  }
}
export default ConnectDB