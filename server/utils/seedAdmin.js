import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/User.js"

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" })
    
    if (!adminExists) {
      console.log("No admin found. Seeding default admin...")
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash("password123", salt)
      
      const adminUser = new User({
        name: "Super Admin",
        email: "admin@eventportal.com",
        password: hashedPassword,
        role: "admin",
        isApproved: true,
      })
      
      await adminUser.save()
      console.log("Default admin created: admin@eventportal.com / password123")
    } else {
      console.log("Admin user already exists. Skipping seed.")
    }
  } catch (error) {
    console.error("Error seeding admin:", error.message)
  }
}

export default seedAdmin
