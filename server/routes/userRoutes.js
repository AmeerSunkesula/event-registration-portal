import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"
import { uploadProfilePicture } from "../controllers/userController.js"

const router = express.Router()

// protect -> multer -> controller
router.put("/profile-picture", protect, upload.single("avatar"), uploadProfilePicture)

export default router
