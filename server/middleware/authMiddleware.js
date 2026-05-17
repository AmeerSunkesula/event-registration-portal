import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Verify Bearer token
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" })

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")
    next()
  } catch (err) {
    // Expired vs tampered
    const message =
      err.name === "TokenExpiredError" ? "Token has expired" : "Invalid token"
    return res.status(401).json({ message })
  }
}

// Admin only guard
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Not authorized as an admin" })
  }
}

// Staff only guard
export const staffOnly = (req, res, next) => {
  if (req.user && req.user.role === "staff") {
    next()
  } else {
    res.status(403).json({ message: "Not authorized as staff" })
  }
}
