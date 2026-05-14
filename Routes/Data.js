import mongoose from "mongoose";
import express from "express";
const router = express.Router();
router.post("/data", async (req, res) => {
  try {
    const db =  mongoose.connection.db;
    const Items = await db.collection("ClothingItems").find({}).toArray({});
    const Category = await db.collection("ClothingCategory").find({}).toArray({});
    res.send([Items, Category]);
  } catch (error) {
    res.send(400).json({ success: false, message: "Can't fetch the data" });
  }
});
export default router;
