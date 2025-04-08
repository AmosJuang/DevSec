const express = require('express')
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")
const connectDB = require("./db/connect")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const cookiesParser = require("cookie-parser")
const filmRoutes = require("./routes/filmRoutes")
const reviewRoutes = require("./routes/reviewRoutes")

const port = process.env.PORT || 3000;
const app = express()
app.use(express.json());

app.use(cors())
app.use(express.json())
app.use(cookiesParser())

app.use("/", authRoutes)
app.use("/user", userRoutes)
app.use("/films", filmRoutes)
app.use("/reviews", reviewRoutes)

connectDB()

app.listen(port, () => {
  console.log(`Server running on Port: ${port}`)
})