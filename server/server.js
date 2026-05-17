// Load env vars first
import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import staffRoutes from "./routes/staffRoutes.js"
import seedAdmin from "./utils/seedAdmin.js"

const app = express()

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// Expose only sub-folders
app.use("/uploads/events", express.static(path.join(__dirname, "uploads/events")))
app.use("/uploads/profiles", express.static(path.join(__dirname, "uploads/profiles")))

// Mount routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/users", userRoutes)
app.use("/api/staff", staffRoutes)

app.get("/", (req, res) => {
  res.send("Event Portal API is officially running! 🚀")
})

const PORT = process.env.PORT || 5000

// Connect DB, then start server
connectDB().then(async () => {
  await seedAdmin()
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})
