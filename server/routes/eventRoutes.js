import express from "express"
import { protect, adminOnly } from "../middleware/authMiddleware.js"
import upload from "../middleware/uploadMiddleware.js"
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
  removeUserFromEvent
} from "../controllers/eventController.js"

const router = express.Router()

// All static named routes — must come before /:id
router.get("/my-events",        protect, getMyEvents)
router.get("/organized-by-me",  protect, getOrganizedEvents)
router.get("/",                 protect, getEvents)
router.post("/create",          protect, upload.single("poster"), createEvent)
router.post("/register/:id",    protect, registerForEvent)
router.post("/unregister/:id",  protect, unregisterFromEvent)
router.get("/:id/dashboard-data", protect, getEventDashboardData)

// Dynamic param — last to avoid collisions
router.put("/:id",              protect, updateEvent)
router.get("/:id",              protect, getEventById)
router.delete("/:id",           protect, deleteEvent)
router.delete("/:id/users/:userId", protect, adminOnly, removeUserFromEvent)

export default router
