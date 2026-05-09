import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/authRoutes.js" // <-- Import the routes

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Mount the authentication routes
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("Event Portal API is officially running! 🚀")
})

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB")
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch((error) => {
    console.log("⚠️ Database connection failed:", error.message)
  })