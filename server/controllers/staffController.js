import User from "../models/User.js"
import Event from "../models/Event.js"

// Get all pending staff
export const getPendingStaff = async (req, res) => {
  try {
    const pendingStaff = await User.find({ role: "staff", isApproved: false })
      .select("-password")
    res.status(200).json(pendingStaff)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Approve staff
export const approveStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.staffId)
    if (!staff) return res.status(404).json({ message: "Staff not found" })

    staff.isApproved = true
    await staff.save()
    res.status(200).json({ message: "Staff approved successfully", staff })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get all approved staff
export const getApprovedStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: "staff", isApproved: true })
      .select("_id name email profilePicture")
    res.status(200).json(staff)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Send Coordinator Request (Admin or Organizer)
export const sendCoordinatorRequest = async (req, res) => {
  try {
    const { eventId, staffId } = req.params

    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: "Event not found" })

    // Check if requester is Admin or Event Organizer
    if (req.user.role !== "admin" && String(req.user._id) !== String(event.organizer)) {
      return res.status(403).json({ message: "Not authorized to assign staff for this event" })
    }

    const staff = await User.findById(staffId)
    if (!staff || staff.role !== "staff" || !staff.isApproved) {
      return res.status(400).json({ message: "Invalid or unapproved staff" })
    }

    if (staff.coordinatorRequests.includes(eventId)) {
      return res.status(400).json({ message: "Request already sent to this staff" })
    }

    if (staff.coordinatedEvents.includes(eventId)) {
      return res.status(400).json({ message: "Staff is already coordinating this event" })
    }

    staff.coordinatorRequests.push(eventId)
    await staff.save()

    res.status(200).json({ message: "Coordinator request sent successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Handle Coordinator Request (Staff only)
export const handleCoordinatorRequest = async (req, res) => {
  try {
    const { eventId } = req.params
    const { action } = req.body // "accept" or "reject"

    const staff = await User.findById(req.user._id)

    if (!staff.coordinatorRequests.includes(eventId)) {
      return res.status(400).json({ message: "No request found for this event" })
    }

    // Remove from requests
    staff.coordinatorRequests = staff.coordinatorRequests.filter(
      id => String(id) !== String(eventId)
    )

    if (action === "accept") {
      staff.coordinatedEvents.push(eventId)
      
      const event = await Event.findById(eventId)
      if (event && !event.coordinators.includes(staff._id)) {
        event.coordinators.push(staff._id)
        await event.save()
      }
    }

    await staff.save()
    res.status(200).json({ message: `Request ${action}ed successfully` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Revoke Staff (Admin only)
export const revokeStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.staffId)
    if (!staff || staff.role !== "staff") return res.status(404).json({ message: "Staff not found" })

    staff.isApproved = false
    await staff.save()
    res.status(200).json({ message: "Staff revoked successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Remove Staff From Event (Admin only)
export const removeStaffFromEvent = async (req, res) => {
  try {
    const { eventId, staffId } = req.params
    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: "Event not found" })

    await Promise.all([
      Event.findByIdAndUpdate(eventId, { $pull: { coordinators: staffId } }),
      User.findByIdAndUpdate(staffId, { $pull: { coordinatedEvents: eventId } }),
    ])

    res.status(200).json({ message: "Staff removed from event" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
