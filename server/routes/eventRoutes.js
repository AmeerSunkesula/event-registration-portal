import express from "express"
import { protect, adminOnly } from "../middleware/authMiddleware.js"
import { uploadPoster } from "../middleware/uploadMiddleware.js"
import {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  getOrganizedEvents,
  registerForEvent,
  unregisterFromEvent,
  getEventDashboardData,
  updateEvent,
  deleteEvent,
  removeUserFromEvent,
  removeEventPoster
} from "../controllers/eventController.js"

const router = express.Router()

// All static named routes — must come before /:id
router.get("/my-events",        protect, getMyEvents)
router.get("/organized-by-me",  protect, getOrganizedEvents)
router.get("/",                 getEvents)
router.post("/create",          protect, uploadPoster.single("poster"), createEvent)
router.post("/register/:id",    protect, registerForEvent)
router.post("/unregister/:id",  protect, unregisterFromEvent)
router.get("/:id/dashboard-data", protect, getEventDashboardData)

// Dynamic param — last to avoid collisions
router.put("/:id",              protect, uploadPoster.single("poster"), updateEvent)
router.get("/:id",              getEventById)
router.delete("/:id",           protect, deleteEvent)
router.delete("/:id/users/:userId", protect, adminOnly, removeUserFromEvent)
router.delete("/:id/poster",    protect, removeEventPoster)

export default router
