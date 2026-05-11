import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Workshop", "Seminar", "Tech Fest", "Cultural", "Sports"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    // Unique hybrid event code
    eventCode: {
      type: String,
      unique: true,
    },
    // Reference to the user (Organizer) who created the event
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Array of references to registered users (Students)
    registeredStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    poster: {
      type: String, // Stored filename
    },
  },
  { timestamps: true },
)

export default mongoose.model("Event", eventSchema)
