import jwt from "jsonwebtoken"

// Sign and return JWT
const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, rollNumber: user.rollNumber },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

export default generateToken
