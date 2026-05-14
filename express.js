import express from 'express'
import ConnectDB from './db.js'
import Entry from './Routes/User.js'
import data from './Routes/Data.js'
import cors from 'cors'
import serverless from "serverless-http";
const app = express()

ConnectDB()
app.use(cors({
  origin: "https://vercel-clothing-website-frontend.vercel.app",
  credentials: true
}));
app.use(express.json())
app.use("/api",Entry)
app.use("/api",data)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default serverless(app)
