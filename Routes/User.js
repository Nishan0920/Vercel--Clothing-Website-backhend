import express from "express";
import { body, validationResult } from "express-validator";
import User from "../Models/Entry.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
        return res.status(400).json({ success: false, errors: result.array() });
      }
      const salt = await bcrypt.genSalt(10)
      const hashData = await bcrypt.hash(req.body.password,salt)
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashData
      });
      const Data = {
        User : {
          id : newUser.id
        }
      }
      const authToken = jwt.sign(Data,"ThisIsMySecretKey")
      res.status(200).json({ success: true ,message:"newuser created successfully",authToken:authToken});
     

    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
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
        return res.status(400).json({ success: false, errors: result.array() });
      }
      
      const {email,password} = req.body
      const ExistingUser = await User.findOne({email})
      if(!ExistingUser){
         return res.status(400).json({success:false,message:"No User Found"})
      }
      
      const isMatch = await bcrypt.compare(password,ExistingUser.password)
      if(!isMatch){
        return res.status(400).json({success:false,message:"Password doesn't match"})
      }
      const Data = {
        User : {
          id: ExistingUser.id
        }
      }
      const authToken = jwt.sign(Data,"ThisIsMySecretKey")
      res.status(200).json({
        success:true,
        message : "Login Successfully",
        authToken : authToken
      })
    } catch (error) {
        res.status(400).json({success:false})
    }
  },
);
export default router;
