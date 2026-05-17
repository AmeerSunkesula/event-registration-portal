import User from "../models/User.js"
import bcrypt from "bcryptjs"
import generateToken from "../services/tokenService.js"

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department, acknowledgementAccepted } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: "User already exists" })

    if (role === "staff" && !acknowledgementAccepted) {
      return res.status(400).json({ message: "Staff must accept acknowledgement" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: role !== "staff",
      rollNumber: role === "student" ? rollNumber : undefined,
      department: (role === "student" || role === "staff") ? department : undefined,
      acknowledgementAccepted: role === "staff" ? true : undefined,
    })

    await newUser.save()

    // Generate & return token if approved
    let token = null
    if (newUser.isApproved) {
      token = generateToken(newUser)
    }

    res.status(201).json({
      message: newUser.isApproved ? "User registered successfully" : "Registration successful. Pending admin approval.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        rollNumber: newUser.rollNumber,
        department: newUser.department,
        isApproved: newUser.isApproved,
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

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" })

    if (user.role === "staff" && !user.isApproved) {
      return res.status(403).json({ message: "You don't have access or your access is removed. Wait until admin's approval." })
    }

    // Generate & return token
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

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: "Email is required" })
    
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })
    
    user.passwordResetRequested = true
    await user.save()
    
    res.status(200).json({ message: "Password reset requested successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
