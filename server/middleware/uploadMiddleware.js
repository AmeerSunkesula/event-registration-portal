import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Not an image!'), false);
};

const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { 
    folder: 'event-portal/profiles',
    transformation: [{ width: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
  },
  allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
});

const posterStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { 
    folder: 'event-portal/posters',
    transformation: [{ width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
  },
  allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
});

export const uploadProfile = multer({ storage: profileStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadPoster = multer({ storage: posterStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
