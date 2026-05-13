import mongoose from "mongoose";
const MongoURL = "mongodb+srv://Clothing001:Clothing001@cluster0.ykda9jb.mongodb.net/Clothing?appName=Cluster0"
const ConnectDB = async ()=>{
  try {
    const MongoDB = mongoose.connect(MongoURL)
    console.log("Database Connected")
  } catch (error) {
    console.log("Can't Connect the database..")
  }
}
export default ConnectDB