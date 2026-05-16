import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin", "staff"], default: "student" },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== "staff"
      },
    },
    // Required for students
    rollNumber: {
      type: String,
    },
    department: {
      type: String,
      enum: [
        "Computer Engineering",
        "Mechanical",
        "Electrical",
        "Civil",
        "Other",
      ],
    },
    profilePicture: { type: String },
    // Events created by user
    organizedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    // Events student is registered for
    registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    // Staff specific fields
    coordinatorRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    coordinatedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    acknowledgementAccepted: { type: Boolean, default: false },
    passwordResetRequested: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export default mongoose.model("User", userSchema)
