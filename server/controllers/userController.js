import User from "../models/User.js"

// Upload user profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    // No file attached
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" })
    }

    // Normalize path separators
    const filePath = req.file.path.replace(/\\/g, "/")

    // Update and return user without password
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: filePath },
      { new: true }
    ).select("-password")

    res.status(200).json({ user: updatedUser })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
