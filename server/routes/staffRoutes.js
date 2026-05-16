import express from "express"
import { protect, adminOnly, staffOnly } from "../middleware/authMiddleware.js"
import {
  getPendingStaff,
  approveStaff,
  getApprovedStaff,
  sendCoordinatorRequest,
  handleCoordinatorRequest,
  revokeStaff,
  removeStaffFromEvent
} from "../controllers/staffController.js"

const router = express.Router()

// Admin routes
router.get("/pending", protect, adminOnly, getPendingStaff)
router.put("/approve/:staffId", protect, adminOnly, approveStaff)
router.put("/revoke/:staffId", protect, adminOnly, revokeStaff)
router.delete("/event/:eventId/staff/:staffId", protect, adminOnly, removeStaffFromEvent)

// Organizer / Admin routes
router.get("/approved", protect, getApprovedStaff)
router.post("/request/:eventId/:staffId", protect, sendCoordinatorRequest)

// Staff routes
router.put("/handle-request/:eventId", protect, staffOnly, handleCoordinatorRequest)

export default router
