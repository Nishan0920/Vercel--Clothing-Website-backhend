import express from "express";
import { body, validationResult } from "express-validator";
import User from "../Models/Entry.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


router.post(
  "/signup",
  [
    body("name").isString().isLength({ min: 5 }),
    body("email", "Invalid Email").isEmail(),
    body("password", "Invalid Password").isLength({ min: 7 }),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: result.array(),
        });
      }

      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashData = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        password: hashData,
      });

      const token = jwt.sign(
        { user: { id: newUser.id } },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        success: true,
        message: "User created successfully",
        authToken: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false });
    }
  }
);


router.post(
  "/signin",
  [
    body("email", "Invalid Email").isEmail(),
    body("password", "Invalid Password").isLength({ min: 7 }),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: result.array(),
        });
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({
          success: false,
          message: "No user found",
        });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Password doesn't match",
        });
      }

      const token = jwt.sign(
        { user: { id: existingUser.id } },
        process.env.JWT_SECRET
      );

      res.status(200).json({
        success: true,
        message: "Login successful",
        authToken: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false });
    }
  }
);

export default router;