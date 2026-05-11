import mongoose from "mongoose"

// Connects to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("✅ Connected to MongoDB")
  } catch (error) {
    // Log error, exit process
    console.error("⚠️ Database connection failed:", error.message)
    process.exit(1)
  }
}

export default connectDB
