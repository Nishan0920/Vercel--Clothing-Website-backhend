import express from 'express'
import ConnectDB from './db.js'
import Entry from './Routes/User.js'
import data from './Routes/Data.js'
import cors from 'cors'
const app = express()
const port = 5000
ConnectDB()
app.use(cors())
app.use(express.json())
app.use("/api",Entry)
app.use("/api",data)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
