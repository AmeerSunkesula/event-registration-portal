import Event from "../models/Event.js"
import User from "../models/User.js"
import mongoose from "mongoose"

// Create a new event
export const createEvent = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authorized" })

    const { title, description, category, date, venue, capacity,
            eventType, parentEvent } = req.body

    const newId     = new mongoose.Types.ObjectId()
    const eventCode = `${newId.toString().slice(0, 8)}-${req.user.rollNumber}`

    const event = new Event({
      _id: newId,
      title, description, category, date, venue, capacity,
      eventType:   eventType   || "standalone",
      parentEvent: parentEvent || null,
      organizer:   req.user.id,
      eventCode,
      poster: req.file ? req.file.path.replace(/\\/g, "/") : null,
    })

    const savedEvent = await event.save()

    // Two-way link for organizer
    await User.findByIdAndUpdate(req.user.id, {
      $push: { organizedEvents: event._id },
    })

    res.status(201).json(savedEvent)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Update existing event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found" })

    // Check authorization
    if (req.user.role !== "admin" && String(req.user._id) !== String(event.organizer)) {
      return res.status(403).json({ message: "Not authorized to update this event" })
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )

    res.status(200).json(updatedEvent)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email")
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get single event with children if main
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")

    if (!event) return res.status(404).json({ message: "Event not found" })

    // Attach sub-events for main events
    if (event.eventType === "main") {
      const children = await Event.find({ parentEvent: event._id })
        .populate("organizer", "name email")
      return res.status(200).json({ ...event.toObject(), children })
    }

    res.status(200).json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get populated event data for dashboard (Organizer / Admin)
export const getEventDashboardData = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email profilePicture")
      .populate("registeredStudents", "name email rollNumber department")
      .populate("coordinators", "name email profilePicture")

    if (!event) return res.status(404).json({ message: "Event not found" })

    // Check authorization
    if (req.user.role !== "admin" && String(req.user._id) !== String(event.organizer._id)) {
      return res.status(403).json({ message: "Not authorized to manage this event" })
    }

    res.status(200).json(event)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get events current user registered for
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ registeredStudents: req.user.id })
      .sort({ date: 1 })
      .populate("organizer", "name email")
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get events current user is organizing
export const getOrganizedEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ date: 1 })
      .populate("organizer", "name email")
    res.status(200).json(events)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Register student for an event
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found" })

    // Already registered
    if (event.registeredStudents.includes(req.user.id)) {
      return res.status(400).json({ message: "Already registered for this event" })
    }

    // Capacity check
    if (event.registeredStudents.length >= event.capacity) {
      return res.status(400).json({ message: "Event is at full capacity" })
    }

    // Atomic two-way link
    await Promise.all([
      Event.findByIdAndUpdate(event._id, { $push: { registeredStudents: req.user.id } }),
      User.findByIdAndUpdate(req.user.id, { $push: { registeredEvents: event._id } }),
    ])

    res.status(200).json({ message: "Successfully registered for event" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Unregister — 7-day cancellation policy
export const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found" })

    // Verify registration
    if (!event.registeredStudents.includes(req.user.id)) {
      return res.status(400).json({ message: "Not registered for this event" })
    }

    // 7-day lock check
    const daysLeft = (new Date(event.date) - Date.now()) / (1000 * 3600 * 24)
    if (daysLeft <= 7) {
      return res.status(400).json({ message: "Cancellation closed (within 7 days of event)" })
    }

    // Atomic two-way removal
    await Promise.all([
      Event.findByIdAndUpdate(event._id, { $pull: { registeredStudents: req.user.id } }),
      User.findByIdAndUpdate(req.user.id, { $pull: { registeredEvents: event._id } }),
    ])

    res.status(200).json({ message: "Successfully unregistered" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found" })

    // Check authorization
    if (req.user.role !== "admin" && String(req.user._id) !== String(event.organizer)) {
      return res.status(403).json({ message: "Not authorized to delete this event" })
    }

    // Cascade pull event ID from ALL users
    await User.updateMany(
      {},
      {
        $pull: {
          registeredEvents: event._id,
          organizedEvents: event._id,
          coordinatedEvents: event._id,
          coordinatorRequests: event._id,
        }
      }
    )

    await Event.findByIdAndDelete(event._id)
    res.status(200).json({ message: "Event deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Remove User From Event (Admin only)
export const removeUserFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found" })

    // Atomic two-way removal
    await Promise.all([
      Event.findByIdAndUpdate(event._id, { $pull: { registeredStudents: req.params.userId } }),
      User.findByIdAndUpdate(req.params.userId, { $pull: { registeredEvents: event._id } }),
    ])

    res.status(200).json({ message: "User removed from event" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
