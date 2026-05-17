import express from "express"
import { protect, adminOnly } from "../middleware/authMiddleware.js"
import { uploadProfile } from "../middleware/uploadMiddleware.js"
import { 
  getMe, uploadProfilePicture, removeProfilePicture, updateProfile, 
  changePassword, deleteAccount, 
  getUsers, deleteUser, getPasswordResetRequests, approvePasswordReset
} from "../controllers/userController.js"

const router = express.Router()

// Fetch current user from DB
router.get("/me", protect, getMe)

// protect -> multer -> controller
router.put("/profile-picture", protect, uploadProfile.single("profilePicture"), uploadProfilePicture)
router.delete("/profile-picture", protect, removeProfilePicture)

// Update name / rollNumber / department
router.put("/update", protect, updateProfile)

// User Actions
router.put("/change-password", protect, changePassword)
router.post("/delete-account", protect, deleteAccount)

// Admin Actions
router.get("/", protect, adminOnly, getUsers)
router.delete("/:id", protect, adminOnly, deleteUser)
router.get("/password-resets", protect, adminOnly, getPasswordResetRequests)
router.put("/approve-reset/:id", protect, adminOnly, approvePasswordReset)

export default router
