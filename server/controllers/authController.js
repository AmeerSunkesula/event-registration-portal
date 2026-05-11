import User from "../models/User.js"
import bcrypt from "bcryptjs"
import generateToken from "../services/tokenService.js"

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department } = req.body

    // 1. Check for existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 3. Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      rollNumber: role === "student" ? rollNumber : undefined,
      department: role === "student" ? department : undefined,
    })

    await newUser.save()

    // 4. Generate token & respond
    const token = generateToken(newUser)

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // 3. Generate token & respond
    const token = generateToken(user)

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
