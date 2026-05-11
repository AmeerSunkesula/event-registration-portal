import Event from "../models/Event.js"
import User from "../models/User.js"
import mongoose from "mongoose"

// Create a new event
export const createEvent = async (req, res) => {
  try {
    // Guard: token must exist
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" })
    }

    const { title, description, category, date, venue, capacity } = req.body

    // Pre-generate ID before save
    const newId = new mongoose.Types.ObjectId()

    // Build code before saving
    const eventCode = `${newId.toString().slice(0, 8)}-${req.user.rollNumber}`

    // Single save, all fields ready
    const event = new Event({
      _id: newId,
      title,
      description,
      category,
      date,
      venue,
      capacity,
      organizer: req.user.id,
      eventCode,
      // Store relative URL path
      poster: req.file ? req.file.path.replace(/\\/g, "/") : null,
    })

    await event.save()

    // Two-way link: update user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { organizedEvents: event._id },
    })

    res.status(201).json(event)
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
