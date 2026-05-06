import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "organizer", "admin"],
      default: "student",
    },
    // College specific fields (Required for students)
    rollNumber: {
      type: String,
      required: function () {
        return this.role === "student"
      },
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
      required: function () {
        return this.role === "student"
      },
    },
  },
  { timestamps: true },
)

export default mongoose.model("User", userSchema)
