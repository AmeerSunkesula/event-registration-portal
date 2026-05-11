import jwt from "jsonwebtoken"

// Signs and returns a JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, rollNumber: user.rollNumber },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  )
}

export default generateToken
