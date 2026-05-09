import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      rollNumber: role === "student" ? rollNumber : undefined,
      department: role === "student" ? department : undefined,
    })

    await newUser.save()
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create and assign JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    )

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}