import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary.js"

// Profile uploads → Cloudinary folder
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event-portal/profiles",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
})

// Poster uploads → Cloudinary folder
const posterStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event-portal/posters",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
})

export const uploadProfile = multer({ storage: profileStorage })
export const uploadPoster  = multer({ storage: posterStorage })
