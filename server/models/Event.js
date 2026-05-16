import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    rules:       { type: String },
    category: {
      type: String,
      enum: ["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Tech Fest", "Other"],
      required: true,
    },
    date:     { type: Date,   required: true },
    venue:    { type: String, required: true },
    capacity: { type: Number, required: true },
    // Hierarchy fields
    eventType: {
      type: String,
      enum: ["standalone", "main", "sub"],
      default: "standalone",
    },
    parentEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    // Unique hybrid event code
    eventCode: { type: String, unique: true },
    // Organizer ref
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Registered students
    registeredStudents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    coordinators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    poster: { type: String },
  },
  { timestamps: true },
)

export default mongoose.model("Event", eventSchema)
