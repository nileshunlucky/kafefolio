import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Kafefolio', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'], // Allowed file formats
    },
});

export const upload = multer({ storage });