import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"
import { createEvent, getEvents } from "../controllers/eventController.js"

const router = express.Router()

// Any authenticated student can create
router.post("/create", protect, upload.single("poster"), createEvent)

// Protected route — all users
router.get("/", protect, getEvents)

export default router
