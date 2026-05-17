import fs from "fs"
import path from "path"
import User from "../models/User.js"
import Event from "../models/Event.js"
import bcrypt from "bcryptjs"

// Return current authenticated user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("coordinatorRequests", "title venue date")
      .populate("coordinatedEvents", "title venue date")
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


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

export const removeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    // GC: delete file from disk
    if (user?.profilePicture) {
      try {
        const filePath = path.join(process.cwd(), user.profilePicture)
        fs.unlinkSync(filePath)
      } catch (_) { /* file already missing */ }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: null },
      { new: true }
    ).select("-password")

    res.status(200).json({ user: updatedUser })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Update profile fields
export const updateProfile = async (req, res) => {
  try {
    const { name, rollNumber, department, email } = req.body

    const updateData = { name }

    // Only update these fields if provided to prevent enum casting errors on empty strings (from admin profile)
    if (rollNumber) updateData.rollNumber = rollNumber
    if (department) updateData.department = department

    // Admins can update their email
    if (req.user.role === "admin" && email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } })
      if (existingUser) return res.status(400).json({ message: "Email already in use" })
      updateData.email = email
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password")

    res.status(200).json({ user: updatedUser })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// User Action - Change Password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Provide both passwords" })

    const user = await User.findById(req.user.id)
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.status(200).json({ message: "Password updated successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// User Action - Delete Account
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body
    if (!password) return res.status(400).json({ message: "Password is required to delete account" })

    const user = await User.findById(req.user.id)
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" })

    // Find all events they organized
    const organizedEvents = await Event.find({ organizer: user._id })
    const eventIds = organizedEvents.map(e => e._id)

    // Delete those events
    await Event.deleteMany({ organizer: user._id })

    // Cascade remove these event IDs from all registered attendees
    if (eventIds.length > 0) {
      await User.updateMany(
        {},
        { $pull: { registeredEvents: { $in: eventIds }, coordinatedEvents: { $in: eventIds }, coordinatorRequests: { $in: eventIds } } }
      )
    }

    // Pull user from other events they might be registered/coordinated for
    await Event.updateMany(
      {},
      { $pull: { registeredStudents: user._id, coordinators: user._id } }
    )

    await User.findByIdAndDelete(user._id)
    res.status(200).json({ message: "Account deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin Action - Get All Users (excluding current admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select("-password")
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin Action - Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    // Find all events they organized
    const organizedEvents = await Event.find({ organizer: user._id })
    const eventIds = organizedEvents.map(e => e._id)

    // Delete those events
    await Event.deleteMany({ organizer: user._id })

    // Cascade remove these event IDs from all registered attendees
    if (eventIds.length > 0) {
      await User.updateMany(
        {},
        { $pull: { registeredEvents: { $in: eventIds }, coordinatedEvents: { $in: eventIds }, coordinatorRequests: { $in: eventIds } } }
      )
    }

    // Pull user from other events they might be registered/coordinated for
    await Event.updateMany(
      {},
      { $pull: { registeredStudents: user._id, coordinators: user._id } }
    )

    await User.findByIdAndDelete(user._id)
    res.status(200).json({ message: "User deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin Action - Get Password Reset Requests
export const getPasswordResetRequests = async (req, res) => {
  try {
    const users = await User.find({ passwordResetRequested: true }).select("-password")
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Admin Action - Approve Password Reset
export const approvePasswordReset = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash("PortalReset123!", salt)
    user.passwordResetRequested = false
    await user.save()

    res.status(200).json({ message: "Password reset to default successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
