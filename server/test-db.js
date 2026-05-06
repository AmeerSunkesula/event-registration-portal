import mongoose from "mongoose"
import dotenv from "dotenv"

// Load variables from the .env file
dotenv.config()

const uri = process.env.MONGO_URI

if (!uri) {
  console.error("❌ MONGO_URI is not defined in the environment variables.")
  process.exit(1)
}

console.log("Attempting to connect to MongoDB...")

mongoose
  .connect(uri, {
    dbName: "EventPortalDB",
  })
  .then(() => {
    console.log("🎉 Successfully connected to MongoDB via Node.js!")
    mongoose.connection.close()
    process.exit(0)
  })
  .catch((err) => {
    console.error("❌ Connection failed. Detailed error below:")
    console.error(err.name, err.message)
    process.exit(1)
  })
