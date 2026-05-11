import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Verify Bearer token
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password")
    next()
  } catch (err) {
    // Distinguish expired vs tampered
    const message =
      err.name === "TokenExpiredError" ? "Token has expired" : "Invalid token"
    return res.status(401).json({ message })
  }
}
