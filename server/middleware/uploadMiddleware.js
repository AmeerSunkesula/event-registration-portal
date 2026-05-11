import multer from "multer"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"

// Ensure sub-folders exist
const EVENTS_DIR = "uploads/events"
const PROFILES_DIR = "uploads/profiles"
fs.mkdirSync(EVENTS_DIR, { recursive: true })
fs.mkdirSync(PROFILES_DIR, { recursive: true })

// Route by field name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === "avatar" ? PROFILES_DIR : EVENTS_DIR
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    // UUID-prefixed original name
    cb(null, `${uuidv4()}-${file.originalname}`)
  },
})

// Allow images only
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"]
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false)
  }
}

const upload = multer({ storage, fileFilter })

export default upload
